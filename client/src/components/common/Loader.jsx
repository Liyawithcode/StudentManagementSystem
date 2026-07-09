import React from 'react';
import './common.css';

export const Loader = ({ fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
