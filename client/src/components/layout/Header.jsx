import React from 'react';

export const Header = ({ title, subtitle, actions }) => {
  return (
    <div className="page-header flex justify-between items-center mb-4 flex-responsive">
      <div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.75rem' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions flex gap-2">{actions}</div>}
    </div>
  );
};

export default Header;
