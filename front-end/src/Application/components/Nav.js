import { Link, useNavigate } from 'react-router-dom';
import '../Css/Nav.css';


const Nav = ({ onClose }) => { 
  const navigate = useNavigate();

  const handleNavLinkClick = (path) => {
    if (onClose) {
      onClose(); 
    }
    navigate(path); 
  };

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
      </ul>
    </div>
  );
};

export default Nav;