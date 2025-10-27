import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PAYMENT_METHODS, CURRENCY } from '../data/nepalData';

const NepalPaymentGateway = ({ event, onPaymentSuccess, onClose }) => {
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState('esewa');
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');

  const selectedMethod = PAYMENT_METHODS.find(m => m.name.toLowerCase() === selectedPayment);
  const processingFee = event.price * (selectedMethod?.processingFee || 0.02);
  const totalAmount = event.price + processingFee;

  const handlePayment = () => {
    // Verify user is attendee before processing payment
    if (!user || user.role !== 'attendee') {
      alert('Access Denied: Only attendees can make payments for events.');
      onClose();
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid Nepali phone number (10 digits)');
      return;
    }
    
    if (!pin || pin.length < 4) {
      alert('Please enter your payment PIN (minimum 4 digits)');
      return;
    }

    setProcessing(true);
    
    // Simulate Nepal payment processing with realistic flow
    setTimeout(() => {
      const isSuccess = Math.random() > 0.05; // 95% success rate for demo
      
      if (isSuccess) {
        const transactionId = `${selectedPayment.toUpperCase()}-${Date.now()}`;
        console.log('🎉 Payment successful!');
        console.log(`Transaction ID: ${transactionId}`);
        console.log(`Method: ${selectedMethod?.name}`);
        console.log(`Amount: ${CURRENCY.symbol}${totalAmount.toFixed(2)}`);
        console.log(`Event: ${event.title}`);
        
        // Show success message with Nepal context
        alert(`Payment successful! Your booking for "${event.title}" is confirmed. Transaction ID: ${transactionId}`);
        onPaymentSuccess({
          transactionId,
          method: selectedMethod?.name,
          amount: totalAmount,
          phoneNumber,
          timestamp: new Date().toISOString()
        });
        onClose();
      } else {
        console.log('❌ Payment failed!');
        const failureReasons = [
          'Insufficient balance in your wallet',
          'Invalid PIN entered',
          'Network connection issue',
          'Service temporarily unavailable'
        ];
        const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
        alert(`Payment failed: ${reason}. Please try again.`);
        setProcessing(false);
      }
    }, 3000); // Longer delay for realistic experience
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with Nepal colors */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-red-600">Nepal Payment Gateway</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Event Details */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-1">📅 {event.date} at {event.time}</p>
          <p className="text-gray-600 mb-1">📍 {event.location}</p>
          <p className="text-gray-600">🏛️ {event.city}, {event.province}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4 text-blue-800">Choose Payment Method</h4>
          <div className="grid grid-cols-2 gap-3">
            {PAYMENT_METHODS.filter(method => method.type === 'digital_wallet').map((method) => (
              <div
                key={method.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPayment === method.name.toLowerCase()
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedPayment(method.name.toLowerCase())}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{method.name === 'eSewa' ? '📱' : method.name === 'Khalti' ? '💜' : '🏦'}</div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Mobile Wallet)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="98xxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={processing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedMethod?.name} PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={processing}
            />
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-blue-800">Payment Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Event Price:</span>
              <span>{CURRENCY.symbol}{event.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Processing Fee ({(selectedMethod?.processingFee * 100).toFixed(1)}%):</span>
              <span>{CURRENCY.symbol}{processingFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg text-red-600">
              <span>Total Amount:</span>
              <span>{CURRENCY.symbol}{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing || !phoneNumber || !pin}
          className={`w-full py-3 rounded-md font-semibold text-white transition-all ${
            processing || !phoneNumber || !pin
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
          }`}
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay ${CURRENCY.symbol}${totalAmount.toFixed(2)} via ${selectedMethod?.name}`
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-4 text-center text-xs text-gray-500 bg-yellow-50 p-3 rounded">
          🔒 This is a demonstration payment gateway. No real transactions are processed.
          <br />
          All popular Nepal payment methods supported: eSewa, Khalti, IME Pay
        </div>
      </div>
    </div>
  );
};

export default NepalPaymentGateway;