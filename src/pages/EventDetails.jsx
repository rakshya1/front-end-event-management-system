import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import Modal from '../components/Modal';
import { useCart } from '../context/CartContext';

const TICKET_ORDER = ['Normal', 'VIP', 'VVIP'];

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getEventById, deleteEvent } = useEvents();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState('');
  const [localTickets, setLocalTickets] = useState([]);

  const event = getEventById(id);
  const { addItem } = useCart();

  useEffect(() => {
    if (event?.ticketTypes?.length) {
      setLocalTickets(event.ticketTypes);
    } else if (event) {
      setLocalTickets([
        { name: 'Normal', price: Math.max(0, event.price), availability: Math.max(0, Math.floor(event.capacity * 0.7)), perks: ['General admission'] },
        { name: 'VIP', price: Math.max(0, Math.floor(event.price * 2)), availability: Math.max(0, Math.floor(event.capacity * 0.2)), perks: ['Reserved/VIP seating'] },
        { name: 'VVIP', price: Math.max(0, Math.floor(event.price * 3)), availability: Math.max(0, Math.floor(event.capacity * 0.1)), perks: ['Meet & greet', 'Exclusive access'] }
      ]);
    }
  }, [event]);

  const orderedTickets = useMemo(() => {
    return [...localTickets].sort((a, b) => TICKET_ORDER.indexOf(a.name) - TICKET_ORDER.indexOf(b.name));
  }, [localTickets]);

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Event not found</h2>
          <button onClick={() => navigate('/events')} className="text-primary-600 hover:text-primary-700">Back to Events</button>
        </div>
      </div>
    );
  }

  const isPast = event.status === 'past';
  const isOwner = isAuthenticated && user.role === 'organizer' && user.id === event.organizerId;

  const openBooking = (ticket) => {
    if (!isAuthenticated) {
      alert('Please login to continue.');
      navigate('/login');
      return;
    }
    const allowed = ['attendee', 'organizer', 'admin'];
    if (!allowed.includes(user.role)) {
      alert('Your account is not permitted to book tickets.');
      return;
    }
    setSelectedTicket(ticket);
    setQuantity(1);
    setBookingOpen(true);
  };

  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  const confirmBooking = () => {
    // Simulated eSewa payment success
    setLocalTickets((prev) => prev.map(t => t.name === selectedTicket.name ? { ...t, availability: Math.max(0, t.availability - quantity) } : t));
    setBookingOpen(false);
    setShowToast('Booking confirmed!');
    setTimeout(() => setShowToast(''), 3000);
  };

  const onDelete = () => {
    if (!isOwner) return;
    const ok = confirm('Delete this event? This action cannot be undone.');
    if (!ok) return;
    deleteEvent(event.id);
    alert('Event deleted');
    navigate('/events');
  };

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      {showToast && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow">{showToast}</div>
      )}

      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => navigate('/events')}
          className="text-gray-600 hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 hover:bg-clip-text hover:text-transparent mb-6 flex items-center transition-all duration-300"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-96 object-cover" />

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white text-sm font-semibold px-3 py-1 rounded-full uppercase">
                  {event.category}
                </span>
                <h1 className="text-4xl font-bold text-slate-800 mt-3">{event.title}</h1>
                <p className="text-sm text-slate-500 mt-1">Organized by {event.organizer}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg font-semibold ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {event.status}
                </span>
                {isAuthenticated && (
                  <div className="flex gap-2">
                    {isOwner && (
                      <>
                        <button onClick={() => navigate(`/events/${event.id}/edit`)} className="px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-sm">Edit Event</button>
                        <button onClick={onDelete} className="px-3 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 text-sm">Delete</button>
                      </>
                    )}
                    {(user.role === 'admin' || isOwner) && (
                      <button onClick={() => navigate('/attendees')} className="px-3 py-2 rounded-lg text-white bg-slate-700 hover:bg-slate-800 text-sm">View Registrations</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="text-sm text-slate-500">Date & Time</p>
                    <p className="text-slate-800 font-medium">{event.date} at {event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🏛️</span>
                  <div>
                    <p className="text-sm text-slate-500">Venue</p>
                    <p className="text-slate-800 font-medium">{event.location}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">About This Event</h2>
                  <p className="text-slate-600 leading-relaxed">{event.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-500">Capacity</p>
                <p className="text-slate-800 font-medium">{event.registeredCount} / {event.capacity} registered</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Tickets</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {orderedTickets.map((ticket) => (
                  <div key={ticket.name} className="border rounded-lg p-5 hover:shadow-md transition bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{ticket.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${ticket.availability > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {ticket.availability > 0 ? `${ticket.availability} left` : 'Sold out'}
                      </span>
                    </div>
                    <p className="text-blue-600 font-bold mb-2">NPR {ticket.price.toLocaleString()}</p>
                    <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1 mb-4">
                      {ticket.perks?.map((perk, idx) => (
                        <li key={idx}>{perk}</li>
                      ))}
                    </ul>
                    <button
                      disabled={ticket.availability === 0 || isPast}
                      onClick={() => openBooking(ticket)}
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        ticket.availability === 0 || isPast
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white hover:shadow-md'
                      }`}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <Modal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          title={selectedTicket ? `Book ${selectedTicket.name} Ticket` : 'Book Ticket'}
          actions={
            <>
              <button onClick={() => setBookingOpen(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => {
                if (!selectedTicket) return;
                addItem({
                  eventId: event.id,
                  eventTitle: event.title,
                  ticketName: selectedTicket.name,
                  price: selectedTicket.price,
                  quantity,
                  image: event.image,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  organizer: event.organizer,
                });
                setBookingOpen(false);
              }} className="px-6 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Add to Cart</button>
              <button onClick={confirmBooking} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Pay with eSewa</button>
            </>
          }
        >
          {selectedTicket && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-slate-700">Ticket Type</span>
                  <span className="font-semibold">{selectedTicket.name}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-slate-700">Price</span>
                  <span className="font-semibold">NPR {selectedTicket.price.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 bg-slate-200 rounded" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</button>
                  <input
                    type="number"
                    className="w-20 text-center border rounded px-2 py-2"
                    min={1}
                    max={selectedTicket.availability}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(selectedTicket.availability, Number(e.target.value) || 1)))}
                  />
                  <button className="px-3 py-2 bg-slate-200 rounded" onClick={() => setQuantity(q => Math.min(selectedTicket.availability, q + 1))} disabled={quantity >= selectedTicket.availability}>+</button>
                  <span className="text-xs text-slate-500">Available: {selectedTicket.availability}</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-red-600">NPR {totalPrice.toLocaleString()}</span>
              </div>

              <p className="text-xs text-slate-500 text-center">This is a simulated eSewa payment for demo purposes.</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default EventDetails;
