import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show navbar on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };


  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon">🌿</span>
          <span className="navbar__brand-text">Civic Naturalist Zoo</span>
        </Link>

        <div className={`navbar__links ${mobileMenuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/book/date" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>Book Tickets</Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="navbar__link" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
              {isAdmin() && (
                <Link to="/admin" className="navbar__link navbar__link--admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
              )}
              <div className="navbar__user">
                <FiUser size={16} />
                <span>{user.email?.split('@')[0]}</span>
                <button className="btn btn--ghost btn--sm" onClick={handleLogout} id="logout-btn">
                  <FiLogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
