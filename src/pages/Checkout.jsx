import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bookingApi from "../api/bookingApi";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get booking data from navigation state
  const bookingData = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  
  // Editable contact information
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [isEditingContact, setIsEditingContact] = useState(false);

  useEffect(() => {
    // Redirect if no booking data
    if (!bookingData) {
      navigate("/events");
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    // Update contact info when user data changes
    if (user) {
      setContactInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    // Validate contact information
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      setError("Please fill in all contact information");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone format (basic validation)
    if (contactInfo.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare booking payload
      const payload = {
        event_id: bookingData.eventId,
        ticket_id: bookingData.ticketId,
        quantity: bookingData.quantity,
        total_price: bookingData.total,
        payment_method: paymentMethod,
        contact_info: contactInfo, // Include contact info
      };

      console.log("Creating booking:", payload);

      // Call API to create booking
      const response = await bookingApi.create(payload);

      console.log("Booking created:", response.data);

      // Show success and redirect
      alert("Booking successful! Redirecting to your bookings...");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Failed to complete booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <button
                  onClick={() => setIsEditingContact(!isEditingContact)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isEditingContact ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditingContact ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={contactInfo.name}
                      onChange={(e) => handleContactChange("name", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange("phone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="98XXXXXXXX"
                    />
                  </div>

                  <button
                    onClick={() => setIsEditingContact(false)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-medium">{contactInfo.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{contactInfo.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium">{contactInfo.phone || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="esewa"
                    checked={paymentMethod === "esewa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">eSewa</p>
                    <p className="text-sm text-gray-500">Pay with eSewa wallet</p>
                  </div>
                  <img
                    src="https://esewa.com.np/common/images/esewa_logo.png"
                    alt="eSewa"
                    className="h-8"
                  />
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="khalti"
                    checked={paymentMethod === "khalti"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Khalti</p>
                    <p className="text-sm text-gray-500">Pay with Khalti wallet</p>
                  </div>
                  <img
                    src="https://web.khalti.com/static/img/logo1.png"
                    alt="Khalti"
                    className="h-8"
                  />
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Cash on Venue</p>
                    <p className="text-sm text-gray-500">Pay at the event venue</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Event</p>
                  <p className="font-medium">{bookingData.eventTitle}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Ticket Type</p>
                  <p className="font-medium">{bookingData.ticketName}</p>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Price per ticket</span>
                  <span className="font-medium">Rs. {bookingData.price}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{bookingData.quantity}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">Rs. {bookingData.total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading || isEditingContact}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading || isEditingContact
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : `Pay Rs. ${bookingData.total.toLocaleString()}`}
              </button>

              {isEditingContact && (
                <p className="text-xs text-orange-600 text-center mt-2">
                  Please save your contact information first
                </p>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing this purchase, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;