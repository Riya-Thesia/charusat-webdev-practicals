import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, User as UserIcon, CheckSquare, Code, Home, Mail } from 'lucide-react';

function NavBar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">Riya's Portfolio Hub</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={16} /> Home
          </Link>

          <Link to="/projects" className={`nav-item ${isActive('/projects') ? 'active' : ''}`}>
            <Code size={16} /> Projects
          </Link>

          <Link to="/contact" className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>
            <Mail size={16} /> Contact
          </Link>

          <Link to="/tasks" className={`nav-item ${isActive('/tasks') ? 'active' : ''}`}>
            <CheckSquare size={16} /> Tasks
          </Link>
        </div>

        <div className="nav-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="user-profile-badge">
              <UserIcon size={16} />
              <span className="user-name">{user.name || user.email}</span>
              <button onClick={logout} className="btn-logout" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
