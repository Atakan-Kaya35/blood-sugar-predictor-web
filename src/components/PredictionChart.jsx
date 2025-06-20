import Plot from "react-plotly.js";

// values = array of [glucose, TOD]; indicators is an integer
export default function PredictionChart({ values, indicators }) {
  const real = values.slice(0, 12);
  const pred = values.slice(12);

  const realX = real.map((_, i) => `T-${12 - i}`);
  const predX = ["Now", "+5min", "+10min"];

  const x = [...realX, ...predX];
  const y = [...real, ...pred].map((v) => v[0]);

  // Confidence band logic (optional)
  const showBand = indicators > 0;
  const upper = pred.map((v) => v[0] + 15);
  const lower = pred.map((v) => v[0] - 15);

  return (
    <Plot
      data={[
                {
          x: x.slice(0),
          y: y.slice(0),
          type: "scatter",
          mode: "lines+markers",
          name: "Predicted",
          line: { color: "red" },
        },
        {
          x,
          y: y.slice(0, 9),
          type: "scatter",
          mode: "lines+markers",
          name: "Real",
          line: { color: "blue" },
        },
        ...(showBand
          ? [
              {
                x: [...predX, ...predX.slice().reverse()],
                y: [...upper, ...lower.slice().reverse()],
                fill: "toself",
                fillcolor: "rgba(255, 99, 132, 0.2)",
                line: { color: "transparent" },
                name: "Confidence Band",
                type: "scatter",
                showlegend: true,
              },
            ]
          : []),
      ]}
      layout={{
        title: "Blood Sugar Over Time",
        paper_bgcolor: "white",
        plot_bgcolor: "#f9fafb",
        margin: { l: 40, r: 30, b: 40, t: 40 },
        yaxis: { title: "mg/dL", range: "autoscale" },
        xaxis: { title: "Time" },
        legend: { orientation: "h", y: -0.2 },
        responsive: true,
      }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}
