import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaHeart, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏠 HomeAppliance Guide
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/recommendations">Recommendations</Link>
          <Link to="/guides">Buying Guides</Link>
        </div>

        <div className="nav-auth">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          ) : (
            <>
              {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
              <Link to="/wishlist" className="nav-icon-link"><FaHeart /> Wishlist</Link>
              <Link to="/profile" className="nav-icon-link"><FaUser /> Profile</Link>
              <button onClick={handleLogout} className="btn-logout"><FaSignOutAlt /> Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
