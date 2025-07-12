import '../Css/update.css';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Update = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [transactionType, setTransactionType] = useState('');

    // State for validation errors
    const [titleError, setTitleError] = useState('');
    const [amountError, setAmountError] = useState('');
  
    const [transactionTypeError, setTransactionTypeError] = useState('');


    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (window.location.pathname !== '/login') {
                        alert(errorData.message || `HTTP error! Status: ${errorData.status}`);
                    }

                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login', { state: { from: location.pathname } });
                    return;

                


                    
                
            }

            const data = await response.json();
            setTitle(data.title);
            setAmount(data.amount.toString()); // Convert amount to string for input value
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

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault(); // Prevent default form submission

        // --- Client-side Validation ---
        let isValid = true;

        // Reset errors
        setTitleError('');
        setAmountError('');
      
        setTransactionTypeError('');

        // Validate Title
        if (!title.trim()) {
            setTitleError('Title is required');
            isValid = false;
        }

        // Validate Amount
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || !amount.trim()) { // Check for NaN or empty string
            setAmountError('Amount is required and must be a number');
            isValid = false;
        } else if (parsedAmount <= 0) { // Optional: if amount must be positive
            setAmountError('Amount must be greater than or equal to zero');
            isValid = false;
        }

        // Validate Category
      

        // Validate Transaction Type
        if (!transactionType) {
            setTransactionTypeError('Transaction type is required');
            isValid = false;
        }

        // If any validation fails, stop submission
        if (!isValid) {
            return;
        }
        // --- End Client-side Validation ---


        const token = JSON.parse(localStorage.getItem('token'));
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            window.alert("Your session has expired or you are not logged in. Please log in again.");
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        try {
            const response = await fetch(`http://localhost:11000/update/${params.id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        title,
                        amount: parsedAmount, // Use the parsed number
                        category,
                        transactionType,
                        userId: user._id
                    }),
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `bearer ${token}`
                    }
                });

            if (!response.ok) {
                const errordata = await response.json();
               if (window.location.pathname !== '/login') {
                        alert(errordata.message || `HTTP error! Status: ${errordata.status}`);
                    }
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login', { state: { from: location.pathname } });
                return;
            }

            alert('Record is updated successfully');
            navigate('/view-transaction');

        } catch (err) {
            console.error("Error updating data:", err);
            window.alert("An error occurred while updating the transaction data.");
        }
    }, [params.id, navigate, location.pathname, title, amount, category, transactionType]);

    return (
        <div className="update-container">
            <h2 id='heading'>Update Transaction</h2>
            <form onSubmit={handleSubmit}>
                <input type="text"
                    id="title"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setTitleError(''); // Clear error on change
                    }}
                />
                {titleError && <span style={{ color: 'red' }}>{titleError}</span>}


                <input type="number"
                    id="amount"
                    placeholder="Enter amount"
                    value={amount}
                    min="0"
                    onChange={(e) => {
                        setAmount(e.target.value);
                        setAmountError(''); // Clear error on change
                    }}
                />
                {amountError && <span style={{ color: 'red' }}>{amountError}</span>}


                <input type="text"
                    id="category"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        
                    }}
                />
                {/* {categoryError && <span style={{ color: 'red' }}>{categoryError}</span>} */}


                <div id='transactiontype-div'>
                    <label>Transaction Type:</label>
                    <div>
                        <label htmlFor="income">Income</label>
                        <input type="radio"
                            id="income"
                            value='income'
                            checked={transactionType === 'income'}
                            onChange={(e) => {
                                setTransactionType(e.target.value);
                                setTransactionTypeError(''); // Clear error on change
                            }}
                            name="transactionType"
                        />
                    </div>
                    <div>
                        <label htmlFor="expense">Expense</label>
                        <input type="radio"
                            id="expense"
                            value='expense'
                            checked={transactionType === 'expense'}
                            onChange={(e) => {
                                setTransactionType(e.target.value);
                                setTransactionTypeError(''); // Clear error on change
                            }}
                            name="transactionType"
                        />
                    </div>
                </div>
                {transactionTypeError && <span style={{ color: 'red' }}>{transactionTypeError}</span>}

                <button type="submit">Update Transaction</button>
            </form>
        </div>
    );
}

export default Update;