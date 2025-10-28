import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockEvents } from '../data/mockEvents';
import { mockUsers } from '../data/mockUsers';
import StatsCard from '../components/admin/StatsCard';
import ChartPanel from '../components/admin/ChartPanel';
import BarPanel from '../components/admin/BarPanel';
import PiePanel from '../components/admin/PiePanel';
import FilterBar from '../components/admin/FilterBar';

const toISODate = (d) => new Date(d).toISOString().slice(0,10);

const AdminReports = () => {
  const { user, loading } = useAuth();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    organizerId: 'all',
  });
  const [tab, setTab] = useState('overview');

  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  // organizers list from users with role organizer present in events
  const organizers = useMemo(() => {
    const ids = new Set(mockEvents.map(e=>e.organizerId).filter(Boolean));
    return mockUsers.filter(u=>u.role==='organizer' && ids.has(u.id)).map(u=>({ id: String(u.id), name: u.name }));
  }, []);

  // apply filters
  const filteredEvents = useMemo(() => {
    return mockEvents.filter(e => {
      if (filters.organizerId !== 'all' && String(e.organizerId) !== String(filters.organizerId)) return false;
      if (filters.startDate && toISODate(e.date) < filters.startDate) return false;
      if (filters.endDate && toISODate(e.date) > filters.endDate) return false;
      return true;
    });
  }, [filters]);

  // stats
  const stats = useMemo(() => {
    const totalEvents = filteredEvents.length;
    const totalUsers = mockUsers.length;
    const totalRegistrations = filteredEvents.reduce((sum, e)=> sum + (e.registeredCount || 0), 0);
    return { totalEvents, totalUsers, totalRegistrations };
  }, [filteredEvents]);

  // chart data: aggregate registrations by date
  const chart = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach(e => {
      const d = toISODate(e.date);
      map.set(d, (map.get(d)||0) + (e.registeredCount || 0));
    });
    const labels = Array.from(map.keys()).sort();
    const data = labels.map(l => map.get(l));
    return { labels, data };
  }, [filteredEvents]);

  const onFilterChange = (patch) => setFilters(prev => ({ ...prev, ...patch }));

  // derived analytics
  const eventsByMonth = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach(e => {
      const m = new Date(e.date).toLocaleString('en', { month: 'short' });
      map.set(m, (map.get(m)||0) + 1);
    });
    const labels = Array.from(map.keys());
    const data = labels.map(l => map.get(l));
    return { labels, data };
  }, [filteredEvents]);

  const categorySplit = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach(e => {
      map.set(e.category, (map.get(e.category)||0) + 1);
    });
    const labels = Array.from(map.keys());
    const data = labels.map(l => map.get(l));
    return { labels, data };
  }, [filteredEvents]);

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>

        <div className="flex gap-2 text-sm">
          {['overview','events','attendees','analytics'].map(t => (
            <button
              key={t}
              onClick={()=>setTab(t)}
              className={`px-3 py-2 rounded-lg border ${tab===t? 'bg-slate-900 text-white border-slate-900':'bg-white text-slate-700 border-slate-200'}`}
            >
              {t[0].toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        <FilterBar
          startDate={filters.startDate}
          endDate={filters.endDate}
          organizerId={filters.organizerId}
          organizers={organizers}
          onChange={onFilterChange}
        />

        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard title="Total Events" value={stats.totalEvents} icon="🎉" />
              <StatsCard title="Total Users" value={stats.totalUsers} icon="👥" />
              <StatsCard title="Total Registrations" value={stats.totalRegistrations} icon="🧾" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartPanel labels={chart.labels} data={chart.data} />
              <BarPanel labels={eventsByMonth.labels} data={eventsByMonth.data} />
            </div>
          </>
        )}

        {tab === 'events' && (
          <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
            <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
            <div className="divide-y">
              {filteredEvents
                .slice()
                .sort((a,b)=> new Date(a.date) - new Date(b.date))
                .map(e => (
                <div key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{e.title}</p>
                    <p className="text-xs text-slate-500">{e.date} • {e.time} • {e.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${e.status==='upcoming'?'bg-green-100 text-green-700':'bg-slate-100 text-slate-600'}`}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'attendees' && (
          <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
            <h2 className="text-lg font-semibold mb-3">Registrations by Organizer</h2>
            <div className="grid grid-cols-1 gap-3">
              {Array.from(filteredEvents.reduce((m,e)=> m.set(e.organizer, (m.get(e.organizer)||0) + (e.registeredCount||0)), new Map()).entries()).map(([org, count]) => (
                <div key={org} className="flex items-center justify-between bg-slate-50 rounded p-3">
                  <span className="font-medium text-slate-700">{org}</span>
                  <span className="text-slate-900 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarPanel labels={eventsByMonth.labels} data={eventsByMonth.data} />
            <PiePanel labels={categorySplit.labels} data={categorySplit.data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;