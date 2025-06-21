import { useLocation } from "react-router-dom";
import PredictionChart from "./components/PredictionChart";

function App() {
  const { state } = useLocation();
  const result = state?.result;

  if (!result) {
    return <div className="text-center mt-20 text-xl">No prediction data.</div>;
  }

  // Extract values from 4 fields (same as before)
  const extractTriplets = (number) =>
    number.toString().match(/.{3}/g).map((v) => [parseInt(v), 0.5]);

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
