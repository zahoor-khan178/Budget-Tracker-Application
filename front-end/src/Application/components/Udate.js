import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Update = () => {
    const [title, setTitle] = useState(''); // Initialize with empty string, not ' '
    const [amount, setAmount] = useState(''); // Initialize with empty string, not ' '
    const [category, setCategory] = useState(''); // Initialize with empty string, not ' '
    const [transactionType, setTransactionType] = useState('');
    const [error, setError] = useState(false); // Only set if there's an actual validation error on submit

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // Wrap getdata in useCallback to prevent infinite loop warnings if it were a dependency
    // And ensure its dependencies are correct
    const getdata = useCallback(async () => {
        setError(false); // Reset error state before fetching
        const token = JSON.parse(localStorage.getItem('token'));
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Correctly navigate using the function:
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            const response = await fetch(`http://localhost:11000/update/fetchdata/${params.id}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                window.alert(errorData.message || `HTTP error! Status: ${response.status}`);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Correctly navigate using the function:
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            const data = await response.json();
            setTitle(data.title);
            setAmount(data.amount); // Corrected variable name: setAmount
            setCategory(data.category); // Corrected variable name: setCategory
            setTransactionType(data.transactionType);

        } catch (err) { // Catch specific 'err' for clarity, not the 'error' state variable
            console.error("Error fetching data:", err); // Log the actual error
            window.alert("An error occurred while fetching the transaction data.");
        }
    }, [params.id, navigate, location.pathname]); // Dependencies for useCallback: params.id, navigate, location.pathname

    // Use useEffect to call getdata ONLY when the component mounts
    // or when its dependencies (like params.id) change.
    useEffect(() => {
        getdata();
    }, [getdata]); // Add getdata to dependencies as it's wrapped in useCallback


    // Move initial validation/error setting to a function called on form submission
    // Or conditionally render error messages based on state *after* initial load.
    // This `if` block should NOT be directly in the render body.
    // `error` state should typically be set based on form submission validation.
    // For now, let's just remove this problematic if block.
    // You can re-introduce validation on a submit handler.


    return (
        <div className="update-container">
            <h2>Update Transaction</h2>
            <form>
                <div>
                    <label htmlFor="">Title:</label>
                    <input type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    {/* Only show error if submission attempted AND field is empty */}
                    {error && !title && <span style={{ color: 'red' }}>title is required</span>}
                </div>
                <div>
                    <label htmlFor="">Amount:</label>
                    <input type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)} // Corrected setAmount
                        required
                    />
                    {error && !amount && <span style={{ color: 'red' }}>amount is required</span>}
                </div>
                <div>
                    <label htmlFor="">Category:</label>
                    <input type="text"
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} // Corrected setCategory
                        required
                    />
                </div>
                <label htmlFor="">Transaction Type:</label>
                <div>
                    <label htmlFor="">Income</label>
                    <input type="radio"
                        value='income'
                        checked={transactionType === 'income'}
                        onChange={(e) => setTransactionType(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="">Expense</label>
                    <input type="radio"
                        value='expense'
                        checked={transactionType === 'expense'}
                        onChange={(e) => setTransactionType(e.target.value)}
                    />
                </div>
                {/* Add an update button here */}
                {/* <button type="submit" onClick={handleUpdate}>Update Transaction</button> */}
            </form>
        </div>
    );
}

export default Update;