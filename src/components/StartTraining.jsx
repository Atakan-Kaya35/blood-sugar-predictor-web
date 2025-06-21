import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function StartTraining() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { state } = useLocation();
  const { username, password } = state || {};

  const handleStart = async () => {
    setLoading(true);
    setMessage("Creating your deep learning model...");

    try {
      // Start training
      const makeRes = await fetch(`http://localhost:8080/make/${username}/${password}`, {
        method: "POST",
      });

      if (!makeRes.ok) throw new Error("Model creation failed");

      setMessage("Model created. Fetching predictions...");

      // Fetch predictions
      const runRes = await fetch(`http://localhost:8080/run/${username}/${password}`, {
        method: "POST",
      });

      const result = await runRes.json();

      if (!runRes.ok) throw new Error(result?.error || "Inference failed");

      // Navigate to chart page with prediction result
      navigate("/predict", { state: { result } });

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Welcome!</h1>
      <p className="text-gray-700 mb-4 text-lg">Press the button below to begin training your personal prediction model.</p>

      <button
        onClick={handleStart}
        disabled={loading}
        className="bg-purple-600 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-purple-700 transition"
      >
        {loading ? "Working..." : "🚀 Start Training"}
      </button>

      {message && <p className="mt-6 text-gray-700">{message}</p>}
    </div>
  );
}
