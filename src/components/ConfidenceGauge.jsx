import Plot from "react-plotly.js";

export default function ConfidenceGauge({ confidence }) {
  const confidenceValue = Math.max(0, Math.min(confidence, 100)); // Clamp between 0–100

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full">
      <h3 className="text-lg font-semibold text-purple-700 mb-4">
        Prediction Confidence
      </h3>
      <Plot
        data={[
          {
            type: "indicator",
            mode: "gauge+number",
            value: confidenceValue,
            title: { text: "Confidence (%)", font: { size: 18 } },
            gauge: {
              axis: { range: [0, 100], tickwidth: 1, tickcolor: "darkgray" },
              bar: { color: "purple" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 50], color: "#fee2e2" },     // Red shades
                { range: [50, 80], color: "#fef9c3" },   // Yellow shades
                { range: [80, 100], color: "#dcfce7" },  // Green shades
              ]
            }
          }
        ]}
        layout={{
          margin: { t: 0, b: 0, l: 0, r: 0 },
          paper_bgcolor: "white",
          font: { color: "gray", family: "Arial" }
        }}
        config={{ staticPlot: true }}
        style={{ width: "100%", height: "250px" }}
      />
    </div>
  );
}
