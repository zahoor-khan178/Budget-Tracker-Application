import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import '../Css/Tlist.css';

const Transaclist = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchkey, setsearchkey] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Memoize these values if they are truly static for the component's lifetime
    // Otherwise, refetching them within functions is safer if they can change.
    // For now, let's keep them here as you had them, assuming they don't change frequently.
    
    const getdata = useCallback(async () => {

        const token = JSON.parse(localStorage.getItem('token'));
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: location.pathname } });
            setLoading(false);
            return;
        }


        const API_URL = process.env.REACT_APP_API_URL;

        try {
            const Response = await fetch(`${API_URL}/list`, {
                headers: {
                    authorization: `bearer ${token}`
                }
            });

            if (!Response.ok) {
                const errorData = await Response.json();
                if (location.pathname !== '/login') { // Use location.pathname, not window.location.pathname
                    alert(errorData.message || `HTTP error! Status: ${Response.status}`);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                setLoading(false);
                return;
            }

            const data = await Response.json();
            console.log('getdata data:',data);
            setTransactions(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
        }
    }, [ navigate, location.pathname, setTransactions]); // Dependencies for useCallback

    useEffect(() => {
        // Initial data fetch when the component mounts
        getdata();
    }, [getdata]);

    const deleteTransaction = async (id) => {
        const confirming = window.confirm('Are you sure you want to delete this transaction?');
        if (!confirming) {
            return;
        }

        const currentToken = JSON.parse(localStorage.getItem('token'));
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (!currentToken || !currentUser) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            const Response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `bearer ${currentToken}`
                }
            });

            if (!Response.ok) {
                const errorData = await Response.json();
                if (location.pathname !== '/login') {
                    alert(errorData.message || `HTTP error! Status: ${Response.status}`);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            setTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction._id !== id)
            );

        } catch (error) {
            console.error('Error deleting transaction:', error);
            window.alert('Error deleting transaction: ' + error.message);
        }
    };

    const searchdata = async (event) => {
        const key = event.target.value;
        setsearchkey(key); // Update the input field's value

        // If the search key becomes empty, re-fetch all data
        if (!key.trim()) {
            getdata();
            return;
        }

        const currentToken = JSON.parse(localStorage.getItem('token'));
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (!currentToken || !currentUser) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/search/${key}`, {
                method: 'GET',
                   headers: {
                authorization: `bearer ${currentToken}`  
                
            }
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (location.pathname !== '/login') {
                    window.alert(errorData.message || `HTTP status: ${response.status}`);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                setTransactions([]); // Clear transactions on error/re-auth
                return;
            }

            const data = await response.json(); // Parse the JSON data

       

           
            if (Array.isArray(data)) {
                setTransactions(data); // If it's an array, directly set it
                     console.log("Search response data:", transactions);
            } else if (data && data.message && data.message.includes("No matching transactions found.")) {
                setTransactions([]); // If it's the "no results" message, clear the list
            } else {
               
                console.warn('Unexpected response format from search API:', data);
                setTransactions([]); // Default to empty array for safety
            }

        } catch (error) {
            console.error('Searching error:', error);
            alert('Failed to search record. Please try again.');
            setTransactions([]); // Clear transactions on network or parsing error
        }
    };

    if (loading) {
        return <div className="loading-message">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error fetching data: {error.message}</div>;
    }

    return (
        <div className="transaclist-container">
            <h2>Transaction List</h2>
            <input
                type="search"
                placeholder="search here"
                id="search-box"
                onChange={searchdata}
                value={searchkey} // Ensures input is controlled by state
            />
            <ul className="transaction-list">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
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