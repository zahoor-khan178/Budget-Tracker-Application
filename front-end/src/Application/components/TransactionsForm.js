import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import '../Css/Tform.css';


const TransactionForm = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState('income');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const navigate = useNavigate();
    const location = useLocation();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);

    setErrors(prevErrors => ({ ...prevErrors, title: '' }));
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);

    setErrors(prevErrors => ({ ...prevErrors, amount: '' }));

  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const handleSubmit = async (e) => {

        const token = JSON.parse(localStorage.getItem('token'));
      const user = JSON.parse(localStorage.getItem('user'));

    e.preventDefault();

    const formErrors = {};
    if (!title) {
      formErrors.title = 'Title is required';
    }
    if (!amount || parseFloat(amount) <= 0) {
      formErrors.amount = 'Amount must be a positive number';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } 
    else if (!token || !user) {
        window.alert("Your session has expired or you are not logged in. Please log in again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
    
      else {

        const API_URL = process.env.REACT_APP_API_URL;

     try {
        setIsLoading(true);

        const Response = await fetch(`${API_URL}/transaction`, {
          method: "POST",
          body: JSON.stringify({
            title,
            amount,
            category,
            transactionType
        }),
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`
          }
        });


         if (!Response.ok) {
          const errorData = await Response.json();
          if (window.location.pathname !== '/login') {
            window.alert(errorData.message || `HTTP error! Status: ${errorData.status}`);
          }

          localStorage.removeItem('token');
          localStorage.removeItem('user');

          navigate('/login', { state: { from: location.pathname } });
          return;
        }

        // if (!response.ok) {
        //   throw new Error('Failed to submit transaction');
        // }

        const data = await Response.json();
        alert('Transaction submitted successfully');
        console.log(data);

        setTitle('');
        setAmount('');
        setCategory('');
        setTransactionType('income');
        setErrors({});
      } catch (error) {
        console.error('Error submitting transaction:', error);
        alert('An error occurred while submitting the transaction');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    // <div id='parent-div'>
      <form  className='transaction-form' onSubmit={handleSubmit}>
      <h2 className='transaction-form-heading'>Transaction Form</h2>

        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter transaction title"
          />
          {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
        </div>


        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min="0"
          />
          {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={handleCategoryChange}
            placeholder="Enter category"
          />
        </div>


        <div id='container-radio'>
          <label >Transaction Type:</label>

          <div className='radio'>
            <input
              type="radio"
               id='radio-input'
              name="transactionType"
              value="income"
              checked={transactionType === 'income'}
              onChange={handleTransactionTypeChange}
            />
            Income
          </div>
          <div className='radio'>
            <input
              type="radio"
              id='radio-input'
              name="transactionType"
              value="expense"
              checked={transactionType === 'expense'}
              onChange={handleTransactionTypeChange}
            />
            Expense
          </div>
        </div>

        <button type="submit"  className="submit-button" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    // </div>
  );
};

export default TransactionForm;