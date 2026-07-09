import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { FiMenu, FiBell, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import './layout.css';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.body.classList.contains('dark-theme');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    const name = user.adminfullname || user.firstName || user.name || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="navbar flex items-center justify-between">
      <div className="navbar-left flex items-center gap-4">
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <h2 className="navbar-title">Student Management System</h2>
      </div>

      <div className="navbar-right flex items-center gap-4">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <button className="notification-bell" title="Notifications">
          <FiBell />
          <span className="bell-badge"></span>
        </button>

        <Link to="/profile" className="user-profile flex items-center gap-2">
          <div className="avatar-circle">
            {getInitials()}
          </div>
          <div className="user-info-text">
            <span className="user-name">
              {user?.adminfullname || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Profile'}
            </span>
            <span className="user-role-label">{user?.role || 'User'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
