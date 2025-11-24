
import "../Css/Emailverificationpage.css"
import emailjs from '@emailjs/browser'
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setloading] = useState(true);
    const [resend, setresend]= useState(false);
    const hasrun = useRef(false);

    const token = new URLSearchParams(location.search).get("token"); //This code extracts the value of a query parameter named token from the URL.
    
    
    //"?." are the optional chaining operator to avoid error if state is undefined
        //  "location.state.from"  will throught error if form is undefined
        // so we use "location.state?.from" instead now if form is undefined it will 
        // return undefined instead of error
    const fromSignup = location.state?.from === "/sign";
    const email = location.state?.email;

    useEffect(() => {



        if (hasrun.current) return;
        hasrun.current = true;
        // if someone accesses this page directly neither from the link nor from signup form, 
        // he will be automatically redirected to signup page

        
        if (!token && !fromSignup) {
            setloading(false);
            navigate("/sign", { replace: true });
            return;
        }

        //  If user came from signup → DO NOT VERIFY YET
        if (fromSignup && !token) {
            setloading(false);
            return;  // just show the waiting page
        }

        //  If token exists, verify user
        if (token) {
            const verifyUser = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
                        method: "POST",
                        body: JSON.stringify({ token }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const result = await response.json();



                    // If there's an error message from backend 

                    if (result.message) {
                        alert(result.message);
                        setloading(false);
                        navigate("/sign", { replace: true });
                        return;
                    }

                    // success → login
                    localStorage.setItem("user", JSON.stringify(result.user));
                    localStorage.setItem("token", JSON.stringify(result.auth));
                     localStorage.setItem('user.email', result.user.email);
                localStorage.setItem('user.name', result.user.name);


                    setloading(false);

                    navigate("/", { replace: true });

                } catch (error) {
                    alert("Verification failed.");
                    setloading(false);
                    navigate("/sign");
                }
            };

            verifyUser();
        }

    }, [token, fromSignup, navigate]);


    const emailConfig = {
        SERVICE_ID: 'service_u8u1m53',
        TEMPLATE_ID: 'template_9nxyk6k',
        PUBLIC_KEY: 'EWVbwGT3M5NQj-umQ',
    };


// if the clicks the resend button this function will be called.
    const handleresend = async () => {
        try {
            setresend(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/resend-verification`, {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" }
            });
            const result = await response.json();

            // if there is an error message from backend
            if (result.message) {
                setresend(false);
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


            if (confirm.status === 200) {
                // if email is sent successfully
                alert("Verification email resent. Please check your inbox.");
                setresend(false);
            }


        } catch (error) {
            alert("Error resending verification email.");
            setresend(false);
        }

    }

    return (
        <div className="email-verification-page">
            {!loading && !resend && (
                <>
                    <h1 className="heading">Email Verification</h1>
                    <p className="paragraph">An Email has been sent to <strong>{email}</strong>.<br></br>
                    Please check your inbox and click the verification link to verify you email.</p>
                    <h3>Thank You ❤</h3>
                    <button className="resend" onClick={handleresend}>Resend</button>
                </>
            )}

            {loading && !resend && (
                <h2>Verifying your account…</h2>
            )}
            {resend && !loading && (
                <p>Resending verification email...</p>
            )}
        </div>
    );
};

export default EmailVerificationPage;
