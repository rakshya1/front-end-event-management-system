import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, breakdown, clearCart, applyPromo, promoCode } = useCart();
  const [buyer, setBuyer] = useState({ name: user?.name || '', email: user?.email || '', phone: '' });
  const [method, setMethod] = useState('esewa');
  const [processing, setProcessing] = useState(false);
  const [code, setCode] = useState(promoCode || '');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="mb-4">Please login to continue checkout.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2 bg-blue-600 text-white rounded">Login</button>
        </div>
      </div>
    );
  }

  const disabled = items.length === 0 || !buyer.name || !buyer.email || !buyer.phone;

  const payNow = () => {
    setProcessing(true);
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}`;
      clearCart();
      navigate(`/order-success/${orderId}`, { state: { orderId, buyer, method, total: breakdown.total } });
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Checkout</h1>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Buyer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border rounded px-3 py-2" placeholder="Full name" value={buyer.name} onChange={e=>setBuyer({...buyer, name:e.target.value})} />
              <input className="border rounded px-3 py-2" type="email" placeholder="Email" value={buyer.email} onChange={e=>setBuyer({...buyer, email:e.target.value})} />
              <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Phone (98xxxxxxxx)" value={buyer.phone} onChange={e=>setBuyer({...buyer, phone:e.target.value})} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Payment Method</h2>
            <div className="flex gap-3">
              {['esewa','khalti','imepay'].map(m => (
                <label key={m} className={`px-4 py-2 border rounded cursor-pointer ${method===m?'border-purple-500 bg-purple-50':''}`}>
                  <input type="radio" className="mr-2" checked={method===m} onChange={()=>setMethod(m)} />
                  {m.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <h2 className="font-semibold mb-2">Promo Code</h2>
            <div className="flex gap-2">
              <input className="flex-1 border rounded px-3 py-2" placeholder="SAVE10 or NEPAL5" value={code} onChange={e=>setCode(e.target.value)} />
              <button onClick={()=>applyPromo(code)} className="px-4 py-2 bg-slate-200 rounded">Apply</button>
            </div>
          </div>

          <button disabled={disabled || processing} onClick={payNow} className={`mt-4 w-full py-3 rounded text-white font-semibold ${disabled || processing ? 'bg-slate-400' : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:shadow'}`}>
            {processing ? 'Processing...' : `Pay NPR ${breakdown.total.toLocaleString()} Now`}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {items.map(i => (
              <div key={i.key} className="border rounded p-3">
                <div className="font-medium">{i.eventTitle} — {i.ticketName}</div>
                <div className="text-sm text-slate-600">Qty {i.quantity} × NPR {i.price.toLocaleString()}</div>
                <div className="text-sm">Total: NPR {(i.price*i.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="text-sm flex justify-between"><span>Subtotal</span><span>NPR {breakdown.subtotal.toLocaleString()}</span></div>
          <div className="text-sm flex justify-between"><span>Service fee</span><span>NPR {breakdown.serviceFee.toLocaleString()}</span></div>
          <div className="text-sm flex justify-between"><span>VAT</span><span>NPR {breakdown.vat.toLocaleString()}</span></div>
          {breakdown.discount>0 && (<div className="text-sm flex justify-between text-green-700"><span>Discount</span><span>- NPR {breakdown.discount.toLocaleString()}</span></div>)}
          <div className="border-t mt-2 pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-red-600">NPR {breakdown.total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;