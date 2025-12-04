import { Link, useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import '../Css/Nav.css';

const Nav = ({ onClose }) => {
  const navigate = useNavigate();
  const logoutRef = useRef(null);  // <<< Create ref

  const handleNavLinkClick = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user.email');
    localStorage.removeItem('user.name');

    navigate('/login');
    window.location.reload();
  };


  useEffect(() => {
    if (logoutRef.current) {
      logoutRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/" className="sidebar-link" onClick={() => handleNavLinkClick("/")}>Home</Link>
        </li>
        <li>
          <Link to="/transaction" className="sidebar-link" onClick={() => handleNavLinkClick("/transaction")}>Add Transaction</Link>
        </li>
        <li>
          <Link to="/view-transaction" className="sidebar-link" onClick={() => handleNavLinkClick("/view-transaction")}>View Transactions</Link>
        </li>
        <li>
          <Link to="/Account" className="sidebar-link" onClick={() => handleNavLinkClick("/Account")}>Account</Link>
        </li>


        <li>
          <Link id="logout" onClick={logout} ref={logoutRef}>Log Out</Link>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
