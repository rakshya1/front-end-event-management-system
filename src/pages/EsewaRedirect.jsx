import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EsewaRedirect = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    useEffect(() => {
        if (!data) {
            navigate("/checkout"); // redirect to checkout if accessed directly
            return;
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.payment_url;

        Object.entries(data.params).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }, [data, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            {/* <h1 className="text-2xl font-bold mb-4">Redirecting to eSewa...</h1> */}
            <div className="animate-pulse text-green-600">Connecting to eSewa…</div>
            <p>Please wait while we redirect you to the eSewa payment page.</p>
        </div>
    );
};

export default EsewaRedirect;
