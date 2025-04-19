import { useState } from "react";
import axios from "axios";

const PromoCodeForm = ({ totalAmount, setDiscountedAmount }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const applyPromo = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/promocode/apply",
        {
          code,
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDiscountedAmount(res.data.discountedTotal);
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Apply Promo Code</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={applyPromo}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>
      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default PromoCodeForm;
