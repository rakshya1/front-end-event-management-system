import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

const Attendees = () => {
  const { user } = useAuth();
  const { getAllAttendees, getEventsByOrganizer, events } = useEvents();
  const [filter, setFilter] = useState('all');

  // For organizers, show only their events' attendees
  // For admins, show all attendees
  const allAttendees = getAllAttendees();
  const organizerEvents = user.role === 'organizer' 
    ? getEventsByOrganizer(user.id) 
    : [];

  const filteredAttendees = user.role === 'organizer'
    ? allAttendees.filter(a => organizerEvents.some(e => e.id === a.eventId))
    : filter === 'all'
      ? allAttendees
      : allAttendees.filter(a => a.eventId === parseInt(filter));

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            {user.role === 'organizer' ? 'My Event Attendees' : 'All Attendees'}
          </h1>
          <div className="text-sm text-slate-600">
            Total: {filteredAttendees.length} attendees
          </div>
        </div>

        {/* Filter */}
        {user.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Event
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Attendees Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Registered Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No attendees found
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map(attendee => (
                    <tr key={attendee.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{attendee.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {attendee.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {attendee.eventTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {attendee.registeredDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          attendee.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {attendee.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendees;
