import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="home-link">AI Therapy Assistant</Link>
      <div className="auth-buttons">
        {currentUser ? (
          <>
            <span className="user-email">{currentUser.email}</span>
            <button 
              className="auth-btn login"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button 
              className="auth-btn login"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button 
              className="auth-btn signup"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
