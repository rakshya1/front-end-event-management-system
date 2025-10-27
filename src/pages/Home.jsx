import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const Home = () => {
  const { events } = useEvents();
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="min-h-[calc(100vh-280px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to EventHub</h1>
          <p className="text-xl mb-8 text-primary-100">
            Discover, organize, and attend amazing events in your area
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/events"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Browse Events
            </Link>
            <Link
              to="/signup"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition border border-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Why Choose EventHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Discover Events
              </h3>
              <p className="text-slate-600">
                Browse through a wide variety of events from technology conferences to art exhibitions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Easy Registration
              </h3>
              <p className="text-slate-600">
                Register for events with just a few clicks and manage your bookings effortlessly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Organize Events
              </h3>
              <p className="text-slate-600">
                Create and manage your own events with our powerful event management tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Upcoming Events</h2>
            <Link
              to="/events"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-xs font-semibold text-primary-600 uppercase">
                    {event.category}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-800 mt-2 mb-3">
                    {event.title}
                  </h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>📅 {event.date}</p>
                    <p>📍 {event.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
