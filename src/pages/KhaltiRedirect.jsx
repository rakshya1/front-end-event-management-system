import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const KhaltiRedirect = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState("Verifying your payment...");
    const [isTestMode, setIsTestMode] = useState(false);

    useEffect(() => {
        // KPG-2 returns with query parameters: pidx, transaction_id, tidx, amount, mobile, purchase_order_id, purchase_order_name, status
        const pidx = searchParams.get("pidx");
        const transactionId = searchParams.get("transaction_id");
        const purchaseOrderId = searchParams.get("purchase_order_id");
        const amount = searchParams.get("amount");
        const paymentStatus = searchParams.get("status"); // "Completed", "Pending", "Failed"
        const testMode = searchParams.get("test_mode"); // Check if test mode

        setIsTestMode(testMode === 'true');

        console.log("Khalti KPG-2 Redirect Params:", {
            pidx,
            transactionId,
            purchaseOrderId,
            amount,
            status: paymentStatus,
            testMode,
        });

        // Check if we got the required parameters
        if (!pidx) {
            setStatus("error");
            setMessage("Invalid payment response. Missing transaction data.");
            setTimeout(() => navigate("/checkout"), 3000);
            return;
        }

        // Verify payment with backend
        verifyPayment(pidx, transactionId, purchaseOrderId);
    }, [searchParams, navigate]);

    const verifyPayment = async (pidx, transactionId, purchaseOrderId) => {
        try {
            setMessage("Verifying payment with Khalti...");

            const response = await axiosClient.post("/khalti/verify", {
                pidx,
                transaction_id: transactionId,
                purchase_order_id: purchaseOrderId,
            });

            console.log("Verification response:", response.data);

            if (response.data.success) {
                const orderId = response.data.data?.order_id;
                
                setStatus("success");
                setMessage("Payment successful! Redirecting to your booking details...");
                
                setTimeout(() => {
                    // Redirect to order success page with order ID
                    if (orderId) {
                        navigate(`/order-success/${orderId}`);
                    } else {
                        // Fallback to my-bookings if no order ID
                        navigate("/my-bookings");
                    }
                }, 2000);
            } else {
                setStatus("error");
                setMessage(response.data.message || "Payment verification failed");
                
                setTimeout(() => {
                    navigate("/checkout");
                }, 3000);
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            setStatus("error");
            setMessage(
                error.response?.data?.message ||
                "Failed to verify payment. Please contact support if amount was deducted."
            );
            
            setTimeout(() => {
                navigate("/checkout");
            }, 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {/* Test Mode Banner */}
                {isTestMode && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-center gap-2 text-yellow-800 text-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Test Mode Active</span>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                            Simulated payment (no real transaction)
                        </p>
                    </div>
                )}
                
                {status === "processing" && (
                    <>
                        <div className="mb-6">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Processing Payment
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <p className="text-sm text-gray-500 mt-4">
                            Please wait while we confirm your payment...
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <div className="mt-6">
                            <div className="animate-pulse text-purple-600 text-sm">
                                Redirecting...
                            </div>
                        </div>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Payment Failed
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate("/checkout")}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default KhaltiRedirect;
