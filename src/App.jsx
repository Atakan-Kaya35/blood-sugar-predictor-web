import { useEffect, useState } from "react";
import { useLocation
  //, useNavigate 
  } from "react-router-dom";
import PredictionChart from "./components/PredictionChart";
import { handleInferenceNotification } from "./components/NotificationHandler"; // adjust path if needed


function App() {
  const { state } = useLocation();
  //const navigate = useNavigate();
  const { username, password } = state || {};

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrediction = async () => {
    try {
      const res = await fetch("https://7gh3eu50xc.execute-api.eu-central-1.amazonaws.com/dev/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Inference failed");

      setResult(data);

      // 🔔 Trigger notifications here
      handleInferenceNotification(data);

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const didRun = { current: false };
    const intervalIdRef = { current: null };

    // Prevent StrictMode double-fetch
    if (!didRun.current) {
      fetchPrediction(); // fire immediately
      didRun.current = true;
    }

    // Set up polling every 5 minutes
    const intervalId = setInterval(() => {
      fetchPrediction();
    }, 5 * 60 * 1000); // 5 min

    // Save reference for cleanup
    intervalIdRef.current = intervalId;

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <p className="text-lg text-purple-600 animate-pulse">Loading predictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const extractTriplets = (number) => {
    const a = Math.floor(number / 1e6);
    const b = Math.floor((number % 1e6) / 1e3);
    const c = number % 1e3;
    return [
      [a, 0.5],
      [b, 0.5],
      [c, 0.5],
    ];
  };



  const values = [
    ...extractTriplets(result.befores2),
    ...extractTriplets(result.befores1),
    ...extractTriplets(result.befores),
    ...extractTriplets(result.afters),
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
        BSP Prediction Chart
      </h1>
      <div className="max-w-4xl mx-auto h-[400px]">
        <PredictionChart values={values} indicators={result.indicators} />
      </div>
    </div>
  );
}

export default App;
