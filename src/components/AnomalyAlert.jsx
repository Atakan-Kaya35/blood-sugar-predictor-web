const anomalyDefinitions = [
  { bit: 1, label: "Noisy Signal", color: "text-yellow-700", bg: "bg-yellow-100" },
  { bit: 2, label: "Sudden Spike or Drop", color: "text-orange-700", bg: "bg-orange-100" },
  { bit: 4, label: "Missing or Delayed Readings", color: "text-amber-800", bg: "bg-amber-100" },
  { bit: 8, label: "⚠ Flatline Detected (Sensor May Be Stuck)", color: "text-red-700", bg: "bg-red-100" },
];

export default function AnomalyAlert({ anomalyCode }) {
  const triggered = anomalyDefinitions
    .filter(({ bit }) => (anomalyCode & bit) !== 0)
    .sort((a, b) => b.bit - a.bit); // Sort by severity (higher bit = higher severity)

  if (triggered.length === 0) {
    return (
      <div className="rounded-xl shadow-md p-4 mt-8 bg-green-100">
        <h3 className="text-md font-semibold text-green-700">Anomaly Check</h3>
        <p className="mt-1 text-sm text-green-700">✅ No anomalies detected</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md p-4 mt-8 bg-white border-l-4 border-red-400">
      <h3 className="text-md font-semibold text-red-700">Detected Anomalies</h3>
      <ul className="mt-2 space-y-1">
        {triggered.map((anomaly, idx) => (
          <li key={idx} className={`text-sm ${anomaly.color}`}>
            • {anomaly.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
