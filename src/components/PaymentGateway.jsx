import { useState } from 'react';
import Modal from './Modal';

const PaymentGateway = ({ isOpen, onClose, event, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('khalti');

  const handlePayment = () => {
    setProcessing(true);
    console.log(`Processing payment for ${event.title} via ${paymentMethod}...`);

    // Simulate payment processing (90% success rate)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        console.log('Payment successful! ✅');
        console.log(`Transaction ID: TXN${Date.now()}`);
        console.log(`Amount: NPR ${event.price}`);
        onPaymentSuccess();
      } else {
        console.log('Payment failed! ❌');
        alert('Payment failed. Please try again.');
        setProcessing(false);
      }
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Gateway"
      actions={
        <>
          <button
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Pay NPR ${event.price.toLocaleString()}`}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-2">{event.title}</h4>
          <p className="text-sm text-slate-600 mb-2">{event.date} at {event.time}</p>
          <p className="text-sm text-slate-600 mb-2">{event.location}</p>
          <div className="border-t border-slate-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span className="text-red-600">NPR {event.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Payment Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border-2 border-purple-500 rounded-lg cursor-pointer hover:border-purple-600 transition bg-purple-50">
              <input
                type="radio"
                name="payment"
                value="khalti"
                checked={paymentMethod === 'khalti'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center flex-1">
                <span className="font-semibold text-purple-700">Khalti</span>
                <span className="ml-2 text-xs text-slate-500">(Recommended - Digital Wallet)</span>
              </div>
              <div className="flex items-center justify-center w-16 h-6 bg-purple-600 rounded px-2">
                <span className="text-white font-bold text-xs">Khalti</span>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-slate-300 rounded-lg cursor-not-allowed opacity-50">
              <input
                type="radio"
                name="payment"
                value="esewa"
                disabled
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="font-semibold text-gray-500">eSewa</span>
                <span className="ml-2 text-xs text-red-500">(Currently unavailable)</span>
              </div>
            </label>

            <label className="flex items-center p-3 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-purple-500 transition">
              <input
                type="radio"
                name="payment"
                value="imepay"
                checked={paymentMethod === 'imepay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="font-semibold text-blue-700">IME Pay</span>
                <span className="ml-2 text-xs text-slate-500">(Mobile Banking)</span>
              </div>
            </label>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">
          🔒 This is a mock payment gateway for demonstration purposes
        </p>
      </div>
    </Modal>
  );
};

export default PaymentGateway;
