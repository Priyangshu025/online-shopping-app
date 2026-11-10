import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, trend = 'up', color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
        {change && (
          <p className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change}
          </p>
        )}
      </div>

      <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default StatCard;

