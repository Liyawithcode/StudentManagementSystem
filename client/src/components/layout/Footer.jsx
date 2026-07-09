import React from 'react';
import './layout.css';

export const Footer = () => {
  return (
    <footer className="footer text-center">
      <p>&copy; {new Date().getFullYear()} Antigravity Student Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
