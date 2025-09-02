import "../Css/login.css";

import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const change = (event) => {
        setemail(event.target.value);
    };

    const changep = (event) => {
        setpassword(event.target.value);
    };

    const handlechange = async () => {
        // IMPORTANT: Avoid using alert() in production/Canvas environments.
        // Use a custom modal or message display for user feedback.
        if (!email) {
            console.error('Email field is empty.');
            // You might want to display an error message in the UI here
            return;
        }
        if (!password) {
            console.error('Password field is empty.');
            // You might want to display an error message in the UI here
            return;
        }

        const API_URL = process.env.REACT_APP_API_URL;

        
        try {
            let response = await fetch(`${API_URL}/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            if (result.auth) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', JSON.stringify(result.auth));
                const from = location.state?.from || '/';
                navigate(from, { replace: true });
            } else {
                console.log('Invalid login:', result);
                // Display invalid login message to the user
            }
        } catch (err) {
            console.error('Error while fetching login data:', err);
            // Display a generic error message to the user
        }
    };

    return (
        <div className='logindiv'>
            <h2 className='logheadign'>Login</h2>
            <input className='loginh1' type="text" placeholder='Enter email' onChange={change} value={email} />
            <input className='loginh2' type="password" placeholder='Enter password' onChange={changep} value={password} />
            <button className="loginbutton" type='button' onClick={handlechange}>Login</button>
            <li id='account-link'><Link to='/sign' >create new account</Link></li>
        </div>
    );
};

export default Login;
