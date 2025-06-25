import { useState } from 'react';
import '../Css/Tform.css';


const TransactionForm = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState('income');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    } else {
      try {
        setIsLoading(true);

        const response = await fetch('http://localhost:11000/transaction', {
          method: "POST",
          body: JSON.stringify({
            title,
            amount,
            category,
            transactionType
        }),
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Failed to submit transaction');
        }

        const data = await response.json();
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
    <div id='parent-div'>
      <h2>Transaction Form</h2>
      <form onSubmit={handleSubmit}>

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
          <label>Transaction Type:</label>
          <label className='radio'>
            <input
              type="radio"
              name="transactionType"
              value="income"
              checked={transactionType === 'income'}
              onChange={handleTransactionTypeChange}
            />
            Income
          </label>
          <label className='radio'>
            <input
              type="radio"
              name="transactionType"
              value="expense"
              checked={transactionType === 'expense'}
              onChange={handleTransactionTypeChange}
            />
            Expense
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;