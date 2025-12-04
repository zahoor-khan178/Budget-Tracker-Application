
import '../Css/Account.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
const Account = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const token = JSON.parse(localStorage.getItem('token'));


    useEffect(() => {

        setEmail(localStorage.getItem('user.email'));
        setName(localStorage.getItem('user.name'));

    }, []);

    console.log("email", email);
    console.log("name", name);



    const navigate = useNavigate();
    const redircttohome = () => {



        navigate('/');

    }

    const deleteaccount = async () => {
        //delete account logic
        const cofirming = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (!cofirming) {
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteaccount`, {
            method: "DELETE",
            body: JSON.stringify({ email }),
            headers: {
                "Content-Type": "application/json",
                "authorization": `bearer ${token}`
            },

        });

        const result = await response.json();

        if (response.status === 500 || response.status === 404) {
            alert(result.message);
            return;
        }

        alert(result.message);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user.email');
        localStorage.removeItem('user.name');
        navigate('/sign', { replace: true });
    }
    return (
        <div className='account-page'>
            <h2 className='account-heading'> Account Details</h2>

            <div className='user-data'>

                <div className='name'>Name: {name}</div>
                <div className='email'>Email: {email}</div>

            </div>


            <div className='account-buttons'>
                <button className='cancel' onClick={redircttohome}>cancel</button>
                <button className='delete' onClick={deleteaccount}>Delete Account</button>
            </div>
        </div>


    )
}

export default Account;