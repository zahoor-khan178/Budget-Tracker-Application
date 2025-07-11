
import '../Css/update.css';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Update = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [transactionType, setTransactionType] = useState('');


    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // getdata is already wrapped in useCallback, so its reference is stable
    const getdata = useCallback(async () => {
        
        const token = JSON.parse(localStorage.getItem('token'));
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
                if(location.pathname!=='/login')
                {

                    window.alert(errorData.message || `HTTP error! Status: ${response.status}`);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            const data = await response.json();
            setTitle(data.title);
            setAmount(data.amount);
            setCategory(data.category);
            setTransactionType(data.transactionType);

        } catch (err) {
            console.error("Error fetching data:", err);
            window.alert("An error occurred while fetching the transaction data.");
        }
    }, [params.id, navigate, location.pathname]);

    useEffect(() => {
        getdata();
    }, [getdata]); 

    const handleSubmit = useCallback(async (e) => { // Remember to pass 'e' (event object)
        e.preventDefault(); // Prevent default form submission


        

        

        const token = JSON.parse(localStorage.getItem('token'));
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            
            const response = await fetch(`http://localhost:11000/update/${params.id}`, // <-- Changed endpoint
                {
                    method: 'PUT', // <-- Changed method
                    body: JSON.stringify({
                        title,
                        amount: parseFloat(amount), // Convert amount to a number
                        category,
                        transactionType,
                        userId: user._id // Assuming user._id is needed by your backend
                    }),
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `bearer ${token}` // <-- Corrected spelling
                    }
                });

            if (!response.ok) {
                const errordata = await response.json();
                 if(location.pathname!=='/login')
                {

                    window.alert(errordata.message || `HTTP error! Status: ${response.status}`);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } }); // Use absolute path
                return;
            }

            alert('Record is updated successfully');
            navigate('/view-transaction'); // Navigate to another page after success

        } catch (err) {
            console.error("Error updating data:", err); // Log for update process
            window.alert("An error occurred while updating the transaction data."); // Alert for update process
        }
    }, [params.id, navigate, location.pathname, title, amount, category, transactionType]); // <-- 'getdata()' REMOVED from dependencies

    return (
        <div className="update-container">
            <h2 id='heading'>Update Transaction</h2>
            <form onSubmit={handleSubmit}> {/* Attach handleSubmit to the form */}
        
                    {/* <label htmlFor="title">Title:</label> */}
                    <input type="text"
                        id="title"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    { !title.trim() && <span style={{ color: 'red' }}>Title is required</span>}
            
            
                    {/* <label htmlFor="amount">Amount:</label> */}
                    <input type="number"
                        id="amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        
                    />
                    {!amount.toString().trim() && <span style={{ color: 'red' }}>Amount is required</span>}
                
    
                    {/* <label htmlFor="category">Category:</label> */}
                    <input type="text"
                        id="category"
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    
                    />
            
               
                   <div id='transactiontype-div'>
                <label >Transaction Type:</label>
                <div>
                    <label htmlFor="income">Income</label>
                    <input type="radio"
                        id="income"
                        value='income'
                        checked={transactionType === 'income'}
                        onChange={(e) => setTransactionType(e.target.value)}
                        name="transactionType" // Crucial for radio group
                    
                    />
                </div>
                <div>
                    <label htmlFor="expense">Expense</label>
                    <input type="radio"
                        id="expense"
                        value='expense'
                        checked={transactionType === 'expense'}
                        onChange={(e) => setTransactionType(e.target.value)}
                        name="transactionType" // Crucial for radio group
                        required
                    />
                </div>
                </div>
              
                { !transactionType && <span style={{ color: 'red' }}>Transaction type is required</span>}

                <button type="submit">Update Transaction</button>
            </form>
        </div>
    );
}

export default Update;