
import '../Css/UpdatePassword.css';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UpdatePassword2 = () => {

    const [password, setpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [loading, setloading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    if (!email) {
        alert('Email not provided');
    }

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

    const updatepassword = async () => {

        if (!password) {
            alert('Password is required');
            return;
        }

        if (password.length !== 8) {
            alert('Password must be exactly 8 characters long');
            return;
        }

        if (password !== confirmpassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            setloading(true);

            const response = await fetch(`${REACT_APP_API_URL}/updating-password`, {
                method: 'PUT',
                body: JSON.stringify({ password, email }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();
            alert(result.message);

            if (response.status === 200) {
                navigate('/login', { replace: true });
            }

        } catch (err) {
            alert("Error updating password");
        } finally {

            setloading(false);
        }

    };

    const redirect_to_login = () => {
        navigate('/login', { replace: true });
    };

    return (
        <div className='updatepassword-page'>
            {loading ? (<p className='loading' >Updating password...</p>) :

                (

                    <>
                        <h2 className="heading">Update Password</h2>
                        <p className='paragraph'>Enter an eight characters long password</p>

                        <div className='input-fields-container'>
                            <input
                                className='email-input'
                                type='password'
                                placeholder='Enter password'
                                onChange={(e) => setpassword(e.target.value)}
                                value={password}
                                required
                            />

                            <input
                                className='email-input'
                                type='password'
                                placeholder='Confirm Password'
                                onChange={(e) => setconfirmpassword(e.target.value)}
                                value={confirmpassword}
                                required
                            />
                        </div>

                        <div className='buttons-container'>
                            <button className='cancel' onClick={redirect_to_login} disabled={loading}>
                                Cancel
                            </button>

                            <button className='next' onClick={updatepassword} disabled={loading}>
                                {loading ? "Please wait..." : "Next"}
                            </button>
                        </div>

                    </>
                )

            }



        </div>
    );
};

export default UpdatePassword2;
