export default function ModelInfoCard({ model, index }) {
  // Guard clause: skip invalid data
  if (!Array.isArray(model) || model.length < 4) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-xl">
        ⚠️ Model {index + 1} has incomplete data.
      </div>
    );
  }

  const [xtreme = 0, plateau = 0, TrendC = 0, accuracy = 0] = model;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-left">
      <h3 className="text-lg font-semibold text-purple-700 mb-2">
        Model {index + 1}
      </h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li><strong>Accuracy:</strong> {(accuracy * 100).toFixed(2)}%</li>
        <li><strong>Extreme:</strong> {xtreme.toFixed(3)}</li>
        <li><strong>Plateau:</strong> {plateau.toFixed(3)}</li>
        <li><strong>Trend Change:</strong> {TrendC.toFixed(3)}</li>
      </ul>
    </div>
  );
}
