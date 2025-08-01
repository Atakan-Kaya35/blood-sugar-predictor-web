import { useEffect, useState } from "react";
import { useLocation
  //, useNavigate 
  } from "react-router-dom";
import PredictionChart from "./components/PredictionChart";
//import { handleInferenceNotification } from "./components/NotificationHandler"; // adjust path if needed
import { Preferences } from "@capacitor/preferences";
import BackgroundFetchRegister from "./components/BackgroundFetchRegister";
import ModelInfoCard from "./components/ModelInfoCard.jsx";
import ConfidenceGauge from "./components/ConfidenceGauge.jsx";
import AnomalyAlert from "./components/AnomalyAlert.jsx";

function App() {
  const { state } = useLocation();
  //const navigate = useNavigate();
  const { username, password } = state || {};

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrediction = async (isFirstCall = true) => {
    try {
      const res = await fetch("https://7gh3eu50xc.execute-api.eu-central-1.amazonaws.com/dev/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, is_first_call: isFirstCall  }),
      });

      // for storage of info used by background in java native notification implementation
      await Preferences.set({
        key: "credentials",
        value: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Inference failed");

      setResult(data);

      // 🔔 Trigger notifications here
      //handleInferenceNotification(data);

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /*
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    */

    const didRun = { current: false };
    const intervalIdRef = { current: null };

    // Prevent StrictMode double-fetch
    if (!didRun.current) {
      fetchPrediction(true); // fire immediately
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

  const storeCredentials = async (username, password) => {
    await Preferences.set({
      key: "credentials",
      value: JSON.stringify({ username, password }),
    });
  };
  
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
    <>
      <BackgroundFetchRegister />
      
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Combined Chart Box */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-4 h-[450px] flex flex-col">
            <h1 className="text-xl font-bold text-purple-700 mb-2 text-center">
              BSP Prediction Chart
            </h1>
            <div className="flex-1">
              <PredictionChart values={values} indicators={result.indicators} />
            </div>
          </div>

          {/* Confidence Gauge Box */}
          <div className="bg-white rounded-xl shadow-md p-4 h-[450px]">
            <ConfidenceGauge confidence={result.confidence} />
          </div>
        </div>

        <AnomalyAlert anomalyCode={result.anomalies} />


       <div className="w-full flex flex-col items-center mt-10">
        <h2 className="text-xl font-semibold text-purple-700 mb-4 text-center">
          Model Details
        </h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-6xl px-4">
          {result.models_info.map((model, index) => (
            <ModelInfoCard key={index} model={model} index={index} />
          ))}
        </div>
      </div>

      </div>
    </>
  );
}

export default App;
