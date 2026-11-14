import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, trend = 'up' }) => {
  return (
    <div className="bg-surface p-6 rounded-card border border-line/60 flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-semibold text-ink">{value}</p>
        {change && (
          <p className={`text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
            {change}
          </p>
        )}
      </div>

      <div className="p-2.5 rounded-xl bg-surface-alt text-ink border border-line/40">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default StatCard;
