import '../Css/login.css';

import  { useState} from 'react';
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

        if (!email) {

            alert('email field is empty.')
            return;
        }
        if (!password) {

            alert('password field is empty.')
            return;
        }
        try {
            let response = await fetch('http://localhost:9000/login', {
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
                
            }
        } catch (err) {
            console.log('Error while fetching login data:', err);
        }
    };

    return (
        <div className='logindiv'>
            <h2 className='logheadign'>Login</h2>
            <input className='loginh1' type="text" placeholder='Enter email' onChange={change} value={email} />
            <input className='loginh2' type="password" placeholder='Enter password' onChange={changep} value={password} />
            <button className="loginbutton" type='button' onClick={handlechange}>Login</button>
            <li id='account-link'><Link to='/sign' style={{textDecoration:'none',color:'blue'}}>create new account</Link></li>
        </div>
    );
};

export default Login;
