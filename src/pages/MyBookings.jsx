import { useEffect, useState } from "react";
import bookingApi from "../api/bookingApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await bookingApi.getMyBookings();
        setBookings(res.data.data); // adjust based on API response
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center mt-10">You have no bookings yet.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        <div className="space-y-6">
          {bookings.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order #{order.transaction_id}</h2>
                <span className={`px-3 py-1 rounded-full text-white text-sm ${
                  order.status === "paid"
                    ? "bg-green-500"
                    : order.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Payment: {order.payment_method} | Total: Rs. {order.total_amount}
              </p>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Tickets:</h3>
                {order.items.map((item) => (
                  <div key={item.id} className="mb-3">
                    <p className="font-medium">{item.ticket?.name || "Ticket"}</p>
                    <p className="text-sm text-gray-600">
                      Event: {item.event?.title || "Event"} | Qty: {item.quantity} | Price: Rs. {item.unit_price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
