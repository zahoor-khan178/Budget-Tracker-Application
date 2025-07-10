import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import '../Css/Tlist.css';

// Assuming jwtkey is defined somewhere accessible, e.g., in a config file or as an environment variable
// const jwtkey = process.env.JWT_SECRET; // Example if using environment variables

const Transaclist = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch token and user once at the top of the component
    // This ensures they are always up-to-date from localStorage
    const token = JSON.parse(localStorage.getItem('token'));
    const user = JSON.parse(localStorage.getItem('user'));

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getdata();
        // Add token and user to dependency array if they can change during component lifecycle
        // For localStorage, they typically don't change without a page reload, so [] is often fine.
    }, []);

    const getdata = async () => {
        // This block is for initial data fetch and session check
        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: location.pathname } });
            setLoading(false); // Ensure loading state is turned off
            return;
        }

        try {
            const Response = await fetch('http://localhost:11000/list', {
                headers: {
                    authorization: `bearer ${token}` // Correct spelling
                }
            });

            if (!Response.ok) {
                const errorData = await Response.json(); // Await parsing of error data
                window.alert(errorData.message || `HTTP error! Status: ${Response.status}`);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                setLoading(false); // Ensure loading state is turned off
                return;
            }

            const data = await Response.json();
            setTransactions(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error); // Log the actual error
            setError(error);
            setLoading(false);
        }
    };

    // Corrected deleteTransaction function
    const deleteTransaction = async (id) => { // Made async
        const confirming = window.confirm('Are you sure you want to delete this transaction?');
        if (!confirming) {
            return;
        }

        // Re-check token before making the request, in case it expired since component loaded
        // This is good practice for functions that might be called much later
        const currentToken = JSON.parse(localStorage.getItem('token'));
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (!currentToken || !currentUser) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: location.pathname } });
            return; // Exit if no token
        }

        try {
            const Response = await fetch(`http://localhost:11000/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `bearer ${currentToken}` // Correct spelling and use currentToken
                }
            });

            if (!Response.ok) {
                // If response is not OK, try to parse error data
                const errorData = await Response.json(); // Await parsing
                window.alert(errorData.message || `Failed to delete transaction. HTTP error! Status: ${Response.status}`);

                // If it's an authentication error (401/403), redirect to login
                if (Response.status === 401 || Response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login', { state: { from: location.pathname } });
                }
                return; // Stop execution after handling error
            }

            // If Response.ok is true, it means the deletion was successful on the backend
            // Now update the frontend state
            setTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction._id !== id)
            );
            // Optionally, show a success message
            // window.alert('Transaction deleted successfully!');

        } catch (error) {
            // Catch network errors or issues with fetch itself
            console.error('Error deleting transaction:', error); // Log the actual error
            window.alert('Error deleting transaction: ' + error.message);
        }
    };

    // Render loading, error, or the transaction list
    if (loading) {
        return <div className="loading-message">Loading...</div>; // Corrected class name as per your previous code
    }

    if (error) {
        return <div className="error-message">Error fetching data: {error.message}</div>;
    }

    return (
        <div className="transaclist-container">
            <h2>Transaction List</h2>
            <ul className="transaction-list">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => ( // Removed index if not used, or use it if needed
                        <li className="transaction-item" key={transaction._id}>
                            <span><strong>Title:</strong> {transaction.title}</span>
                            <span><strong>Amount:</strong> ${transaction.amount}</span>
                            <span><strong>Category:</strong> {transaction.category}</span>
                            <span><strong>Transaction Type:</strong> {transaction.transactionType}</span>
                            <button
                                className="delete-btn"
                                onClick={() => deleteTransaction(transaction._id)}
                            >
                                Delete
                            </button>
                            <button className="update-btn"><Link to={`/up/${transaction._id}`} id="update-link">Update</Link></button>
                        </li>
                    ))
                ) : (
                    <li>No transactions available</li>
                )}
            </ul>
        </div>
    );
};

export default Transaclist;