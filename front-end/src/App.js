



import { BrowserRouter , Route, Routes, Outlet, useLocation, Navigate } from 'react-router-dom';

import TransactionsForm from './Application/components/TransactionsForm';

import Transaclist from './Application/components/Transclist';
import Summary from './Application/components/Summary';

// import Toggle from './Application/components/Toggle';
import Signup from './Application/components/Signup';
import Login from './Application/components/Login';
import Nav2 from './Application/components/Nav2';



const ProtectedRoutes = () => {

     let location = useLocation();

    const user = localStorage.getItem('user'); // Check for authentication data
    const token = localStorage.getItem('token'); 
   

    
  return user && token ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
};


function MainLayout() {

    let location = useLocation();

    const user = localStorage.getItem('user'); // Check for authentication data
    const token = localStorage.getItem('token'); 

   

    // Define routes where Nav and Footer should NOT be displayed
    const noNavFooterRoutes = ['/login', '/sign'];

    // Check if the current path is in the exclusion list
    const shouldShowNavAndFooter = !noNavFooterRoutes.includes(location.pathname);

    return (
        <div id="body">


           { !shouldShowNavAndFooter && <Nav2 /> }
            {/* {shouldShowNavAndFooter ? <Nav /> : <Nav2 /> } */}
            
            <div className="maindiv">
                <Routes>
                    {/* Routes accessible to everyone (non-protected) */}
                    {/* Login page: If auth_data exists, redirect away from login; otherwise, show Login component */}
                    <Route
                        path="/login"
                        element={user && token ? <Navigate to={location.state?.from || "/"} replace /> : <Login />}
                    />
                    <Route path="/sign" element={<Signup />} /> {/* Signup is always accessible */}

                    {/* Protected Routes: These routes are only accessible if auth_data exists */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/" element={<Summary />} />

                        
                        <Route path="/transaction" element={<TransactionsForm />} />
                        <Route path="/view-transaction" element={<Transaclist />} />
                    </Route>

                    {/* Catch-all for undefined routes (optional, but good for UX) */}
                    {/* If a route doesn't match and auth_data doesn't exist, redirect to login */}
                    {/* If a route doesn't match and auth_data exists, maybe redirect to home or a 404 page */}
                    {/* For this specific requirement, if auth_data does not exist, any non-login/signup page should go to login */}
                     <Route path="*" element={user && token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
                </Routes> 
            </div> 
        
        </div>
    );
}




function App() {
    return (
        <BrowserRouter>
            <MainLayout />
        </BrowserRouter>
    );
}

export default App;
