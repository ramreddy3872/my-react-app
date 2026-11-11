import React from 'react';

const StatCard = ({ title, value, subtext, icon, variant = 'primary' }) => {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
      <div className={`stat-icon ${variant}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
