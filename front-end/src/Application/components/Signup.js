import '../Css/signup.css';

import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../signup.css'; 

const Signup = () => {
    const [name, setName] = useState(""); // Renamed for consistency
    const [email, setEmail] = useState(""); // Renamed for consistency
    const [password, setPassword] = useState(""); // Renamed for consistency
    const navigate = useNavigate();

   

    const handleNameChange = (event) => { // Renamed for clarity
        setName(event.target.value);
    };

    const handleEmailChange = (event) => { // Renamed for clarity
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => { // Renamed for clarity
        setPassword(event.target.value);
    };

    const handleSignup = async () => { // Renamed for clarity

        if (!name || !email || !password) { // Combined checks for brevity
            alert('All fields are required.');
            return;
        }

        try {
            let result = await fetch('http://localhost:9000/register', {
                method: 'post',
                body: JSON.stringify({ name, email, password }),
                headers: { 'Content-Type': 'application/json' } // Corrected header casing
            });

            result = await result.json();

            // Store user data if registration is successful and data is returned
            if (result.auth ) { // Assuming 'auth' property indicates success from your API
                localStorage.setItem('user', JSON.stringify(result.result));
                localStorage.setItem('token', JSON.stringify(result.auth));
                navigate("/");
            } else {
                // Handle registration failure (e.g., user already exists)
                alert(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during registration:', err); // Use console.error for errors
            alert('An error occurred during registration. Please try again later.');
        }
    };

    return (
        <div className="signup-container"> {/* Changed class name */}
            <form className="signup-form" onSubmit={(e) => e.preventDefault()}> {/* Added onSubmit to prevent default form submission */}
                <h2>Create Account</h2> {/* Changed to h2, more common for forms */}
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder='Enter your name'
                        className='form-input' // New class name
                        onChange={handleNameChange}
                        value={name}
                        required // Added HTML5 validation
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email" // Changed type to email for better validation
                        id="email"
                        placeholder='Enter your email'
                        className='form-input'
                        onChange={handleEmailChange}
                        value={email}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password" // Changed type to password for security
                        id="password"
                        placeholder='Enter a password'
                        className='form-input'
                        onChange={handlePasswordChange}
                        value={password}
                        required
                    />
                </div>
                <button type='submit' className='signup-button' onClick={handleSignup}>
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default Signup;