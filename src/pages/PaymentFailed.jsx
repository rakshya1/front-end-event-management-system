const PaymentFailed = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 className="text-3xl font-bold text-red-600">Payment Failed 😢</h1>
    <p className="text-gray-600 mt-2">
      Something went wrong with your payment. Please try again or use another method.
    </p>
  </div>
);

export default PaymentFailed;
