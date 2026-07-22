import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import {
  FiGrid, FiUsers, FiBookOpen, FiBook, FiCheckSquare,
  FiClock, FiDollarSign, FiBell, FiSettings, FiActivity, FiLogOut, FiCalendar,
  FiHome, FiMapPin, FiMenu
} from 'react-icons/fi';
import './layout.css';

export const Sidebar = ({ collapsed, toggleSidebar, onNavClick }) => {
  const { user, role, logout } = useAuth();

  const handleLinkClick = () => {
    if (onNavClick) onNavClick();
  };

  const getLinks = () => {
    const common = [{ to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> }];

    if (role === 'admin') {
      return [
        ...common,
        { to: '/students', label: 'Students', icon: <FiUsers /> },
        { to: '/teachers', label: 'Teachers', icon: <FiUsers /> },
        { to: '/courses', label: 'Courses', icon: <FiBookOpen /> },
        { to: '/subjects', label: 'Subjects', icon: <FiBook /> },
        { to: '/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
        { to: '/timetable', label: 'Timetable', icon: <FiCalendar /> },
        { to: '/exams', label: 'Exams', icon: <FiClock /> },
        { to: '/fees/dashboard', label: 'Revenue Analytics', icon: <FiActivity /> },
        { to: '/fees/structures', label: 'Fee Structures', icon: <FiSettings /> },
        { to: '/fees/payments', label: 'Payment Ledgers', icon: <FiDollarSign /> },
        { to: '/fees/approvals', label: 'Offline Approvals', icon: <FiCheckSquare /> },
        { to: '/fees/report', label: 'Billing Reports', icon: <FiClock /> },
        { to: '/library', label: 'Library Catalog', icon: <FiBookOpen /> },
        { to: '/hostels', label: 'Hostel Rooms', icon: <FiHome /> },
        { to: '/transport', label: 'Transport Shuttle', icon: <FiMapPin /> },
        { to: '/notice', label: 'Noticeboard', icon: <FiBell /> },
        { to: '/settings', label: 'Settings', icon: <FiSettings /> },
      ];
    }

    if (role === 'faculty') {
      return [
        ...common,
        { to: '/students', label: 'Students', icon: <FiUsers /> },
        { to: '/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
        { to: '/timetable', label: 'My Timetable', icon: <FiCalendar /> },
        { to: '/exams', label: 'Exams', icon: <FiClock /> },
        { to: '/library', label: 'Library Catalog', icon: <FiBookOpen /> },
        { to: '/notice', label: 'Noticeboard', icon: <FiBell /> },
      ];
    }

    if (role === 'student') {
      return [
        ...common,
        { to: '/attendance', label: 'My Attendance', icon: <FiCheckSquare /> },
        { to: '/timetable', label: 'My Timetable', icon: <FiCalendar /> },
        { to: '/exams', label: 'My Exams', icon: <FiClock /> },
        { to: '/fees', label: 'My Fees', icon: <FiDollarSign /> },
        { to: '/library', label: 'Library Catalog', icon: <FiBookOpen /> },
        { to: '/hostels', label: 'My Room', icon: <FiHome /> },
        { to: '/transport', label: 'My Shuttle', icon: <FiMapPin /> },
        { to: '/notice', label: 'Noticeboard', icon: <FiBell /> },
      ];
    }

    return common;
  };

  const navLinks = getLinks();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiBookOpen className="brand-logo" />
          {!collapsed && <span className="brand-name">IntelliCampus</span>}
        </div>
        <button className="sidebar-close-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          <FiMenu />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title={collapsed ? link.label : ''}
          >
            <span className="nav-icon">{link.icon}</span>
            {!collapsed && <span className="nav-label">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={logout} title={collapsed ? 'Logout' : ''}>
          <span className="nav-icon"><FiLogOut /></span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
