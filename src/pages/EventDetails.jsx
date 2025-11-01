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
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-600">{event.venue}</p>
          <p className="text-gray-500">
            {new Date(event.start_time).toLocaleDateString()}
          </p>
          <p className="text-gray-700">{event.description}</p>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {event.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tickets Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">No tickets available for this event.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{ticket.name}</h3>
                <p className="text-gray-600 mt-1">Price: Rs. {ticket.price}</p>
                <p className="text-gray-500 text-sm">
                  Available: {ticket.remaining_quantity}
                </p>

                <button
                  onClick={() => handleBuyTicket(ticket)}
                  disabled={ticket.remaining_quantity === 0}
                  className={`mt-3 w-full px-4 py-2 rounded-lg transition ${ticket.remaining_quantity === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  {ticket.remaining_quantity === 0 ? "Sold Out" : "Book Ticket"}
                </button>
              </div>
            ))}
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