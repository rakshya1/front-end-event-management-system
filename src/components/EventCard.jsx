import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {event.category}
            </span>
          </div>
          {event.price === 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                FREE
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">
            {event.title}
          </h3>
          
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-slate-700 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date} at {event.time}</span>
            </div>
            
            <div className="flex items-center text-slate-700 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{event.location}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-lg font-bold text-blue-600">
                NPR {event.price.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500">
                {event.registeredCount}/{event.capacity} registered
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
