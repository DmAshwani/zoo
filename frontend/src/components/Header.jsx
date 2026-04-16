import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    navigate('/login');
  };

  return (
    <header className="bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xl fixed top-0 w-full z-50 shadow-[0px_12px_32px_rgba(44,52,51,0.06)] font-body text-on-background">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-900 dark:text-emerald-500" data-icon="park">park</span>
          <Link to="/" className="text-xl font-bold text-emerald-900 dark:text-emerald-100 tracking-tight flex items-center">
             The Civic Naturalist
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-6 items-center text-sm">
          {token ? (
            <>
              <Link to="/book" className="font-semibold text-emerald-800 dark:text-emerald-400 hover:opacity-80 transition-opacity">Book Tickets</Link>
              <Link to="/my-bookings" className="font-medium text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors">My Bookings</Link>
              {roles.includes('ROLE_ADMIN') && (
                <Link to="/admin" className="font-medium text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors">Admin Panel</Link>
              )}
              <button 
                onClick={handleLogout} 
                className="bg-outline-variant/20 text-on-surface px-4 py-2 rounded-lg font-medium hover:bg-outline-variant/40 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-medium text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors">Login</Link>
              <Link to="/login">
                <button className="bg-primary text-on-primary px-5 py-2 rounded-lg font-medium transition-transform active:opacity-80 hover:bg-primary-dim">
                  Register
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
