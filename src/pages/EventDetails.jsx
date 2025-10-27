import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getEventById, registerForEvent, unregisterFromEvent, isUserRegistered } = useEvents();

  const event = getEventById(id);
  const isRegistered = isAuthenticated && isUserRegistered(parseInt(id), user?.id);
  const isFull = event?.registeredCount >= event?.capacity;

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Event not found</h2>
          <button
            onClick={() => navigate('/events')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = registerForEvent(event.id, user.id, user.name, user.email);
    if (result.success) {
      alert('Successfully registered for the event!');
    } else {
      alert(result.error);
    }
  };

  const handleUnregister = () => {
    if (window.confirm('Are you sure you want to unregister from this event?')) {
      unregisterFromEvent(event.id, user.id);
      alert('Successfully unregistered from the event');
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/events')}
          className="text-primary-600 hover:text-primary-700 mb-6 flex items-center"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-96 object-cover"
          />

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-sm font-semibold text-primary-600 uppercase">
                  {event.category}
                </span>
                <h1 className="text-4xl font-bold text-slate-800 mt-2">{event.title}</h1>
              </div>
              <span className={`px-4 py-2 rounded-lg font-semibold ${
                event.status === 'upcoming' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {event.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="text-sm text-slate-500">Date & Time</p>
                    <p className="text-slate-800 font-medium">{event.date} at {event.time}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="text-slate-800 font-medium">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">👤</span>
                  <div>
                    <p className="text-sm text-slate-500">Organizer</p>
                    <p className="text-slate-800 font-medium">{event.organizer}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">🎫</span>
                  <div>
                    <p className="text-sm text-slate-500">Capacity</p>
                    <p className="text-slate-800 font-medium">
                      {event.registeredCount} / {event.capacity} registered
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About This Event</h2>
              <p className="text-slate-600 leading-relaxed">{event.description}</p>
            </div>

            {event.status === 'upcoming' && (
              <div className="flex gap-4">
                {isRegistered ? (
                  <button
                    onClick={handleUnregister}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Unregister from Event
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={isFull}
                    className={`flex-1 font-semibold py-3 rounded-lg transition ${
                      isFull
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {isFull ? 'Event Full' : 'Register for Event'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
