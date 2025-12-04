import '../Css/signup.css';
import emailjs from '@emailjs/browser';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setconfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    // these are emailjs configuration details related to emailjs service and my emailjs account

    const emailConfig = {
        SERVICE_ID: 'service_u8u1m53',
        TEMPLATE_ID: 'template_9nxyk6k',
        PUBLIC_KEY: 'EWVbwGT3M5NQj-umQ',
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name)
            return alert("name is required");
        if (!email)
            return alert("email is required");
        if (!email.endsWith("@gmail.com")) return alert("Invalid Gmail");
        if (!password)
            return alert("password is required");
        if (password.length !== 8) return alert("Password must be 8 characters long");
        if (confirmpassword !== password)
            return alert("passwords do not match");

        try {
            setLoading(true);

            // 1. verify email with backend & get token
            const response = await fetch(`${process.env.REACT_APP_API_URL}/verify`, {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            // If there's an error message from backend

            if (result.message) {
                setLoading(false);
                return alert(result.message);
            }

            const token = result.token;

            // 2. Send email with ONLY token
            const templateParams = {
                from_name: "Budget Tracker App",
                user_email: email,
                message:
                    "Please click the link below to verify your account:\n\n" +
                    `https://budget-tracker-application-bb2h.vercel.app/verify-email?token=${token}`
            };

            const confirm = await emailjs.send(
                emailConfig.SERVICE_ID,
                emailConfig.TEMPLATE_ID,
                templateParams,
                emailConfig.PUBLIC_KEY
            );

            // if email is sent suscessfully you will be redirected to the emailverificationpage.

            if (confirm.status === 200) {
                navigate('/verify-email', { state: { from: "/sign", email: result.email } });
                setLoading(false);

            }

        } catch (err) {
            console.log("EMAILJS ERROR:", err);
            alert("Error sending email");
            setLoading(false);
        }


    };


    if (loading) {
        return <div className="loading">Loading...</div>;
    }


    return (
        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className='create-account'>Create Account</h2>

            <input
                type="text"
                placeholder='Enter your name'
                className='form-input'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
            />

            <input
                type="email"
                placeholder='Enter your email'
                className='form-input'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
            />

            <input
                type="password"
                placeholder='Enter a password'
                className='form-input'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                pattern=".{8}"
                title="Password must be exactly 8 characters long"
                required
            />
            <input
                type="password"
                placeholder='Confirm Password'
                className='form-input'
                onChange={(e) => setconfirmPassword(e.target.value)}
                value={confirmpassword}
                // pattern=".{8}"
                // title="Password must be exactly 8 characters long"
                required
            />

            <button
                type='submit'
                className='signup-button form-input'
                onClick={handleSignup}
            >
                Sign Up
            </button>
        </form>
    );
};

export default Signup;
