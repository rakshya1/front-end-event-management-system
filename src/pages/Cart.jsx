import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeItem, breakdown } = useCart();
  const navigate = useNavigate();

  const empty = items.length === 0;

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Your Cart</h1>
          <Link to="/events" className="text-gray-600 hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 hover:bg-clip-text hover:text-transparent">Continue browsing</Link>
        </div>

        {empty ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-600 mb-4">Your cart is empty</p>
            <Link to="/events" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Browse Events</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.key} className="bg-white rounded-lg shadow p-4 flex gap-4">
                  <img src={item.image} alt={item.eventTitle} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{item.eventTitle} — {item.ticketName}</h3>
                    <p className="text-sm text-slate-600">{item.date} • {item.time} • {item.location}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 bg-slate-200 rounded" onClick={() => updateQuantity(item.key, Math.max(1, item.quantity - 1))}>-</button>
                        <input className="w-14 text-center border rounded py-1" type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(item.key, Math.max(1, Number(e.target.value)||1))} />
                        <button className="px-2 py-1 bg-slate-200 rounded" onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
                      </div>
                      <span className="font-semibold text-blue-600">NPR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-red-600" onClick={() => removeItem(item.key)}>✕</button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-5 space-y-2">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Order Summary</h3>
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>NPR {breakdown.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Service fee ({Math.round(breakdown.serviceFeeRate*100)}%)</span><span>NPR {breakdown.serviceFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>VAT ({Math.round(breakdown.vatRate*100)}%)</span><span>NPR {breakdown.vat.toLocaleString()}</span></div>
                {breakdown.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-700"><span>Discount</span><span>- NPR {breakdown.discount.toLocaleString()}</span></div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-red-600">NPR {breakdown.total.toLocaleString()}</span></div>
                <button onClick={() => navigate('/checkout')} className="mt-3 w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow">Proceed to Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;