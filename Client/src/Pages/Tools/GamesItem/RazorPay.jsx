import React, { useContext, useEffect, useState } from "react";
import { EscomContext } from "../../../Context/escomContext";

const RazorPay = () => {
  const [data, setData] = useState({
    courseId: "123",
    amount: 0,
  });
  const { backend_url } = useContext(EscomContext);
  const [scriptLoaded, setScriptLoaded] = useState(false); // State to track script loading status

  const razorPayScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  const razorPayPlaceOrder = async () => {
    try {
      const response = await fetch(`${backend_url}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json(); // Await the response.json() as well
      console.log(result);

      const paymentObject = new window.Razorpay({
        key: "rzp_test_481XWM263JxEp8", // Replace with your Razorpay Key
        amount: result.amount, // Ensure this is in paise (multiply amount by 100 if needed)
        currency: "INR",
        order_id: result.razorpay_order_id, // Use the order ID from the backend
        handler: function (response) {
          console.log("Payment successful", response);
          const paymentDetails = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          // Call the backend to verify the payment here
          // Example:
          const res_two = fetch('/api/verify-payment', { method: 'POST', body: JSON.stringify(paymentDetails) });
          console.log(res_two)
        },
        prefill: {
          name: "John Doe", // Replace with actual user data if needed
          email: "johndoe@example.com",
          contact: "1234567890",
        },
        theme: {
          color: "#F37254", // Set your theme color here
        },
      });

      paymentObject.open(); // Open the Razorpay payment window

    } catch (error) {
      alert("Error processing the order: " + error.message);
    }
  };

  useEffect(() => {
    razorPayScript("https://checkout.razorpay.com/v1/checkout.js")
      .then(() => setScriptLoaded(true)) // Set the script as loaded
      .catch((error) => alert(error.message)); // Handle script load error
  }, [data]);

  return (
    <div>
      <input
        onChange={(e) => setData((prev) => ({ ...prev, amount: +e.target.value }))}
        style={{ width: "340px", height: "35px", margin: "20px" }}
        type="number"
      />
      <button
        style={{ width: "100px", height: "35px", margin: "20px", cursor: "pointer" }}
        onClick={razorPayPlaceOrder}
        disabled={!scriptLoaded} // Disable the button if the script is not loaded
      >
        {scriptLoaded ? "Submit" : "Loading..."}
      </button>
    </div>
  );
};

export default RazorPay;
