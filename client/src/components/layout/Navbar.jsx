import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { FiMenu, FiBell, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { noticeService } from '../../services/noticeService.js';
import './layout.css';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);

  useEffect(() => {
    const isDark = document.body.classList.contains('dark-theme');
    setDarkMode(isDark);

    const loadLiveNotices = async () => {
      try {
        const res = await noticeService.getNotices();
        if (res && res.notices) {
          const formatted = res.notices.map(n => ({
            id: n.id || n._id,
            title: n.title,
            date: n.date || n.createdAt ? (n.date || n.createdAt.split('T')[0]) : new Date().toISOString().split('T')[0],
            category: n.category || 'General'
          })).slice().reverse();
          setNotificationsList(formatted);
          setUnreadCount(formatted.length);
        }
      } catch (err) {
        console.error('Failed to load notices for navbar:', err);
      }
    };
    loadLiveNotices();
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
  };

  const getInitials = () => {
    if (!user) return '?';
    const name = user.adminfullname || user.firstName || user.name || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="navbar flex items-center justify-between">
      <div className="navbar-left flex items-center gap-4">
        <h2 className="navbar-title">IntelliCampus</h2>
      </div>

      <div className="navbar-right flex items-center gap-4">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="notification-bell"
            onClick={handleNotificationClick}
            title="Noticeboard Announcements"
          >
            <FiBell />
            {unreadCount > 0 && <span className="bell-badge"></span>}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown animate-fade-in">
              <div className="dropdown-header">
                <h4>Campus Noticeboard</h4>
                <Link to="/notice" className="view-all-link" onClick={() => setShowNotifications(false)}>
                  View All →
                </Link>
              </div>
              <div className="dropdown-body">
                {notificationsList.map((notif) => (
                  <Link
                    key={notif.id}
                    to="/notice"
                    className="dropdown-item"
                    onClick={() => setShowNotifications(false)}
                  >
                    <div className="item-title">{notif.title}</div>
                    <div className="item-meta">
                      <span className="item-badge">{notif.category}</span>
                      <span className="item-date">{notif.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="dropdown-footer">
                <Link to="/notice" onClick={() => setShowNotifications(false)}>
                  Go to Noticeboard Page
                </Link>
              </div>
            </div>
          )}
        </div>

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
