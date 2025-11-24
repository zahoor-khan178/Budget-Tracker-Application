import './Application/Css/App.css'
import { BrowserRouter, Route, Routes, Outlet, useLocation, Navigate } from 'react-router-dom';

import TransactionsForm from './Application/components/TransactionsForm';
import Transaclist from './Application/components/Transclist';
import Summary from './Application/components/Summary';
import Toggle from './Application/components/Toggle';
import Signup from './Application/components/Signup';
import EmailVerificationPage from './Application/components/EmailVerificationPage';
import Login from './Application/components/Login';
import Nav2 from './Application/components/Nav2';
import Update from './Application/components/Udate';
import Account from './Application/components/Account';
import UpdatePassword from './Application/components/UpdatePassword';
import UpdatePassword2 from './Application/components/UpdatePassword2';

const ProtectedRoutes = () => {
  let location = useLocation();
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  return user && token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

function MainLayout() {
  let location = useLocation();

  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // Paths that should NOT show the main authenticated header (Toggle)
  const PUBLIC_ROUTES = ['/login', '/sign', '/verify-email','/Account', '/update-password', '/update-password2'];

  // 1. Check if the current route is protected (should show Toggle)
  const isProtectedPath = !PUBLIC_ROUTES.includes(location.pathname);

  // 2. Check if the current route should show the simple public header (Nav2)
  // This excludes /verify-email
  const isSimpleNavPath = ['/login', '/sign'].includes(location.pathname);

  let HeaderComponent = null;

  if (isProtectedPath) {
    // Show main authenticated header
    HeaderComponent = <Toggle />;
  } else if (isSimpleNavPath) {
    // Show simple public header for login/signup
    HeaderComponent = <Nav2 />;
  }
  // If neither of the above (i.e., it's /verify-email), HeaderComponent remains null (hidden)


  return (
    <div id="body">
      {/* Renders Toggle, Nav2, or null based on the current path */}
      {HeaderComponent}

      <Routes>
        {/* Public routes (outside maindiv) */}
        <Route path="/login" element= {<Login />}/>
        <Route path="/sign" element={<Signup />} />

        <Route path="/Account" element={<Account />} />

        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/update-password2" element={<UpdatePassword2 />} />

        {/* Protected routes wrapped inside maindiv */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<div className="maindiv"><Outlet /></div>}> {/* Wrap protected routes inside maindiv */}
            <Route path="/" element={<Summary />} />
            <Route path="/transaction" element={<TransactionsForm />} />
            <Route path="/view-transaction" element={<Transaclist />} />
            <Route path="/up/:id" element={<Update />} />
          </Route>
        </Route>

            
        {/* Catch-all */}
        <Route
          path="*"
          element={user && token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
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