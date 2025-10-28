import { Link, useLocation, useParams } from 'react-router-dom';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const state = location.state || {};

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🎟️</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Booking confirmed!</h1>
          <p className="text-slate-600 mb-6">Your order <span className="font-mono">{orderId}</span> has been placed successfully.</p>
          <div className="bg-slate-50 rounded p-4 text-left text-sm space-y-1 mb-6">
            <div><strong>Name:</strong> {state.buyer?.name}</div>
            <div><strong>Email:</strong> {state.buyer?.email}</div>
            <div><strong>Payment:</strong> {state.method?.toUpperCase()}</div>
            <div><strong>Total Paid:</strong> NPR {state.total?.toLocaleString?.() || '-'}</div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/events" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Browse more events</Link>
            <Link to="/" className="px-6 py-2 bg-slate-200 rounded">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;