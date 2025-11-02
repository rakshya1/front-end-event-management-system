import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axiosClient.get("/payment/success", {
          params: Object.fromEntries(params),
        });
        console.log("Payment verified:", response.data);
        navigate("/my-bookings");
      } catch (err) {
        console.error("Verification failed:", err);
        navigate("/payment-failed");
      }
    };
    verifyPayment();
  }, [params, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="text-gray-600 mt-2">Verifying your transaction...</p>
    </div>
  );
};

export default PaymentSuccess;
