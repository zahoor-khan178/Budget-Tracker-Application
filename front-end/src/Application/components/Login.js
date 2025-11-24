import "../Css/login.css";

import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const change = (event) => {
        setemail(event.target.value);
    };

    const changep = (event) => {
        setpassword(event.target.value);
    };

    const handlechange = async () => {

        if (!email || !password) {
            alert('All fields are required.');
            return;
        }

        const API_URL = process.env.REACT_APP_API_URL;

        try {
            setloading(true);

            let response = await fetch(`${API_URL}/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            if (result.message) {
                alert(result.message);
                return;
            }

            if (result.auth) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', JSON.stringify(result.auth));
                localStorage.setItem('user.email', result.user.email);
                localStorage.setItem('user.name', result.user.name);

                const from = location.state?.from || '/';
                alert('Login successful!');
                navigate(from, { replace: true });
            } else {
                alert('Invalid login:', result);
            }
        } catch (err) {
            alert('Error while fetching login data:', err);
        } finally {
            setloading(false);
        }
    };

    return (
        <div className='logindiv'>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h2 className='logheadign'>Login</h2>

                    <div className='logininputdiv'>
                        <input
                            className='loginh2'
                            id="text_input"
                            type="email"
                            placeholder='Enter Email'
                            onChange={change}
                            value={email}
                        />

                        <input
                            className='loginh2'
                            type="password"
                            placeholder='Enter password'
                            onChange={changep}
                            value={password}
                        />

                        <Link to="/update-password" className="update-link">
                            Update Password
                        </Link>
                    </div>

                    <button
                        className="loginbutton loginh2"
                        type='button'
                        onClick={handlechange}
                    >
                        Login
                    </button>

                    <li className='account-link'>
                        <Link to='/sign'>Create new account</Link>
                    </li>
                </>
            )}
        </div>
    );
};

export default Login;
