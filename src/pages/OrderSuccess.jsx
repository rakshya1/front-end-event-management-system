import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bookingApi from '../api/bookingApi';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const state = location.state || {};
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!state.total); // If no state, need to fetch

  useEffect(() => {
    // If we don't have order details from state, fetch them
    if (!state.total && orderId) {
      const fetchOrder = async () => {
        try {
          const response = await bookingApi.getMyBookings();
          const orders = response.data.data;
          const foundOrder = orders.find(o => o.id === parseInt(orderId));
          if (foundOrder) {
            setOrder(foundOrder);
          }
        } catch (error) {
          console.error('Failed to fetch order:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, state.total]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Use order data from API if available, otherwise use state
  const displayData = order || state;

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">�</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 mb-6">
            Your order <span className="font-mono font-semibold">#{orderId}</span> has been placed successfully.
          </p>
          
          {order && (
            <div className="bg-slate-50 rounded-lg p-6 text-left mb-6">
              <h2 className="font-semibold text-lg mb-4 text-center">Order Details</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`font-semibold ${
                    order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Method:</span>
                  <span className="font-semibold">{order.payment_method?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="font-semibold text-lg">NPR {order.total_amount}</span>
                </div>
                {order.contact_name && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Contact Name:</span>
                    <span className="font-semibold">{order.contact_name}</span>
                  </div>
                )}
                {order.contact_email && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-semibold">{order.contact_email}</span>
                  </div>
                )}
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Tickets:</h3>
                  {order.items.map((item) => (
                    <div key={item.id} className="bg-white rounded p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.ticket?.name || 'Ticket'}</p>
                          <p className="text-sm text-slate-600">
                            {item.event?.title || 'Event'}
                          </p>
                          <p className="text-xs text-slate-500">
                            Quantity: {item.quantity} × NPR {item.unit_price}
                          </p>
                        </div>
                        <p className="font-semibold">NPR {item.quantity * item.unit_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!order && state.total && (
            <div className="bg-slate-50 rounded p-4 text-left text-sm space-y-1 mb-6">
              <div><strong>Name:</strong> {state.buyer?.name}</div>
              <div><strong>Email:</strong> {state.buyer?.email}</div>
              <div><strong>Payment:</strong> {state.method?.toUpperCase()}</div>
              <div><strong>Total Paid:</strong> NPR {state.total?.toLocaleString?.() || '-'}</div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              📧 A confirmation email with your ticket details has been sent to your email address.
            </p>
          </div>
          
          <div className="flex gap-3 justify-center flex-wrap">
            <Link 
              to="/my-bookings"
              state={{ fromPayment: true }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              View All My Bookings
            </Link>
            <Link 
              to="/events" 
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium transition-colors"
            >
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;