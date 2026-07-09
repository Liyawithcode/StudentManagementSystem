import React from 'react';
import './common.css';

export const Card = ({ title, value, icon, trend, color }) => {
  return (
    <div className="card stat-card flex items-center justify-between" style={{ borderLeft: `4px solid ${color || 'var(--primary)'}` }}>
      <div className="stat-card-details">
        <span className="stat-card-title">{title}</span>
        <h3 className="stat-card-value">{value}</h3>
        {trend && (
          <span className={`stat-card-trend ${trend.positive ? 'text-success' : 'text-danger'}`}>
            {trend.value}
          </span>
        )}
      </div>
      {icon && (
        <div className="stat-card-icon" style={{ backgroundColor: `${color || 'var(--primary)'}20`, color: color || 'var(--primary)' }}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default Card;
