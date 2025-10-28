import React from 'react';

const FilterBar = ({ startDate, endDate, organizerId, organizers, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-slate-200 flex flex-col md:flex-row gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">From</label>
        <input type="date" value={startDate} onChange={(e)=>onChange({ startDate: e.target.value })} className="border rounded px-2 py-1" />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">To</label>
        <input type="date" value={endDate} onChange={(e)=>onChange({ endDate: e.target.value })} className="border rounded px-2 py-1" />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">Organizer</label>
        <select value={organizerId} onChange={(e)=>onChange({ organizerId: e.target.value })} className="border rounded px-2 py-1 min-w-[180px]">
          <option value="all">All organizers</option>
          {organizers.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;