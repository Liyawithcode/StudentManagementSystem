import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { registerToastCallback } from './utils/toast.js';

function App() {
  const [toastData, setToastData] = useState(null);

  useEffect(() => {
    // Register toast listener
    registerToastCallback((message, type) => {
      setToastData({ message, type });
      // Auto clear after 4 seconds
      setTimeout(() => {
        setToastData(null);
      }, 4000);
    });
  }, []);

  // Initialize theme from localStorage or system preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  return (
    <>
      <AppRoutes />

      {/* Elegant Floating Toast Notification Overlay */}
      {toastData && (
        <div
          className="animate-slide-in-right"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toastData.type === 'error' ? 'var(--danger)' : toastData.type === 'success' ? 'var(--success)' : 'var(--primary)',
            color: 'var(--text-inverse)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {toastData.message}
        </div>
      )}
    </>
  );
}

export default App;
