import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eventApi from "../api/eventApi";
import { useTickets } from "../hooks/useTickets";
import { useAuth } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { tickets, loading: ticketLoading, error: ticketError } = useTickets(id);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch event details from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await eventApi.getById(id);
        setEvent(res.data.data || res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // ✅ When user clicks Buy Ticket
  const handleBuyTicket = (ticket) => {
    console.log("Ticket clicked:", ticket); // Debug log
    setSelectedTicket(ticket);
    setQuantity(1);
    setShowModal(true);
    console.log("Modal should open now"); // Debug log
  };

  // ✅ Confirm booking → redirect to checkout
  const confirmBooking = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    if (!selectedTicket) return;

    setShowModal(false);

    navigate("/checkout", {
      state: {
        eventId: event.id,
        eventTitle: event.title,
        ticketId: selectedTicket.id,
        ticketName: selectedTicket.name,
        price: selectedTicket.price,
        quantity,
        total: selectedTicket.price * quantity,
      },
    });
  };

  if (loading || ticketLoading)
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (error || ticketError)
    return <div className="p-6 text-center text-red-600">{error || ticketError}</div>;

  if (!event)
    return <div className="p-6 text-gray-500 text-center">Event not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Event Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={event.image || "/placeholder.jpg"}
          alt={event.title}
          className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
        />
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold text-slate-800">{event.title}</h1>
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(event.start_time).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Description Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About This Event
        </h2>
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {event.description}
        </div>
      </div>

      {/* Tickets Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Select Tickets</h2>
        
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-20 h-20 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-slate-500 text-lg">No tickets available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const isSoldOut = ticket.remaining_quantity === 0;
              const isLowStock = ticket.remaining_quantity > 0 && ticket.remaining_quantity < 10;
              
              return (
                <div
                  key={ticket.id}
                  className={`relative border rounded-xl p-6 transition-all duration-200 ${
                    isSoldOut 
                      ? 'bg-slate-50 border-slate-200 opacity-60' 
                      : 'bg-white border-slate-300 hover:border-purple-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Ticket Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{ticket.name}</h3>
                        {isLowStock && !isSoldOut && (
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-semibold ml-3">
                            Only {ticket.remaining_quantity} left
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-semibold ml-3">
                            Sold Out
                          </span>
                        )}
                      </div>
                      
                      {ticket.description && (
                        <p className="text-slate-600 text-sm mb-3">{ticket.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {ticket.remaining_quantity} / {ticket.quantity} available
                        </span>
                      </div>
                    </div>

                    {/* Right: Price & Button */}
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 justify-between md:justify-start">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-800">
                          ₹{ticket.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">per ticket</div>
                      </div>
                      
                      <button
                        onClick={() => handleBuyTicket(ticket)}
                        disabled={isSoldOut}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                          isSoldOut
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {isSoldOut ? 'Sold Out' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Modal Implementation - Not relying on Modal component */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Confirm Booking</h3>
              <p className="text-gray-600 mb-4">
                You're booking a <strong>{selectedTicket.name}</strong> ticket for{" "}
                <strong>{event.title}</strong>.
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Ticket Type:</span>
                  <span className="font-semibold">{selectedTicket.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Price per ticket:</span>
                  <span className="font-semibold">Rs. {selectedTicket.price}</span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <label htmlFor="quantity" className="text-gray-700">
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={selectedTicket.remaining_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(selectedTicket.remaining_quantity, Number(e.target.value))))}
                  className="border rounded-md px-3 py-1 w-20"
                />
                <span className="text-sm text-gray-500">
                  (Max: {selectedTicket.remaining_quantity})
                </span>
              </div>

              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    Rs. {(selectedTicket.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;