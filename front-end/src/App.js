import './Application/Css/App.css'
import { BrowserRouter, Route, Routes, Outlet, useLocation, Navigate } from 'react-router-dom';

import TransactionsForm from './Application/components/TransactionsForm';
import Transaclist from './Application/components/Transclist';
import Summary from './Application/components/Summary';
import Toggle from './Application/components/Toggle';
import Signup from './Application/components/Signup';
import Login from './Application/components/Login';
import Nav2 from './Application/components/Nav2';
import Update from './Application/components/Udate';

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

  const noNavFooterRoutes = ['/login', '/sign'];
  const shouldShowNavAndFooter = !noNavFooterRoutes.includes(location.pathname);

  return (
    <div id="body">
      {shouldShowNavAndFooter ? <Toggle /> : <Nav2 />}

      <Routes>
        {/* Public routes (outside maindiv) */}
        <Route
          path="/login"
          element={user && token ? <Navigate to={location.state?.from || "/"} replace /> : <Login />}
        />
        <Route path="/sign" element={<Signup />} />

        {/* Protected routes wrapped inside maindiv */}
        <Route element={<ProtectedRoutes />}>
          <Route
            element={<div className="maindiv"><Outlet /></div>} // ✅ wrap protected routes
          >
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
