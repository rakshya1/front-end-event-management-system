import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const ticketsSold = event.tickets_sold || 0;
  const ticketsAvailable = event.tickets_available || 0;
  const ticketsRemaining = ticketsAvailable - ticketsSold;
  const percentageSold = ticketsAvailable > 0 ? (ticketsSold / ticketsAvailable) * 100 : 0;
  
  const isSoldOut = ticketsRemaining === 0;
  const isFillingFast = !isSoldOut && percentageSold >= 70;

  return (
    <Link to={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {event.category?.name}
            </span>
          </div>
          {event.price === 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                FREE
              </span>
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center pointer-events-none">
              <span className="bg-white text-slate-800 px-6 py-2 rounded-lg text-lg font-bold shadow-xl">
                SOLD OUT
              </span>
            </div>
          )}
          {isFillingFast && !isSoldOut && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-1">
              <span className="text-xs font-semibold">🔥 Filling Fast - Only {ticketsRemaining} left!</span>
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
              <svg className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{event.start_time} at {event.time}</span>
            </div>
            
            <div className="flex items-center text-slate-700 text-sm">
              <svg className="w-4 h-4 mr-2 flex-shrink-0 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{event.venue}</span>
            </div>
            
            {/* Ticket Availability Bar */}
            {!isSoldOut && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Tickets
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {ticketsRemaining} / {ticketsAvailable} available
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"
                    style={{ width: `${Math.min(percentageSold, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Price and Attendees */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Starting from</div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NPR {event.price.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">{ticketsSold}</div>
                  <div className="text-xs text-slate-500 -mt-0.5">going</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
