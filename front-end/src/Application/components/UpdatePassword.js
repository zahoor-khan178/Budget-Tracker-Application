
import '../Css/UpdatePassword.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {

    const [email, setemail] = useState('');

    const navigate = useNavigate();

    const emailvalidation = async () => {

        if (!email) {
            alert('Email is required');
            return;
        }

        if (!email.endsWith('@gmail.com')) {
            alert('invalid email');
            return;
        }

        const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


        try {


            const response = await fetch(`${REACT_APP_API_URL}/check-email`,
                {

                    method: 'POST',
                    body: JSON.stringify({ email }),
                    headers: {

                        "Content-Type": "application/json"
                    },
                });

            const result = await response.json();

            if (response.status === 404 || response.status === 500) {


                return;
            }

            if (!result.email) {

                alert('email not provided by the backend');
                return;
            }


            navigate('/update-password2', { state: { email: result.email } });


            return;



        }

        catch (err) {

            alert('error while checking email', err);

        }

    }

    const redirect_to_login = (() => {

        navigate('/login', { replace: true });
    });



    return (
        <div className='updatepassword-page'>

            <h2 className="heading">Update Password</h2>
            <input className='email-input' type='email' placeholder='Enter your email' value={email}
                onChange={(e) => { setemail(e.target.value) }} required />
            <div className='buttons-container'>
                <button type="button" className='cancel' onClick={redirect_to_login}>Cancel</button>
                <button type="button" className='next' onClick={emailvalidation}>Next</button>
            </div>
        </div>
    );
}

export default UpdatePassword;