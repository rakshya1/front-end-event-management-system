import React from 'react';

const StatsCard = ({ title, value, subtitle, icon = '📈' }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
};

export default StatsCard;