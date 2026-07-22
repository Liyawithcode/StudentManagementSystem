import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import './layout.css';

export const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className="dashboard-layout flex">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} onNavClick={closeMobileSidebar} />

      {!sidebarCollapsed && (
        <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      )}

      <div className="main-container flex flex-column flex-1">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="main-content flex-1 animate-fade-in">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
