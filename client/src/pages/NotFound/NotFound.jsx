import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

export const NotFound = () => {
  return (
    <div className="flex flex-column items-center justify-center animate-fade-in" style={{ height: '70vh', gap: '1rem' }}>
      <h1 style={{ fontSize: '6rem', fontFamily: 'Outfit, sans-serif', color: 'var(--primary)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontFamily: 'Outfit, sans-serif' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" style={{ marginTop: '1rem' }}>
        <Button variant="primary">Return Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFound;
