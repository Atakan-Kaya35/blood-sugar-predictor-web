import Plot from "react-plotly.js";

export default function PredictionChart({ values, indicators }) {
  // Space control
  const realSpacing = 1;
  const predSpacing = 3;

  const num_befores = 9;
  const real = values.slice(0, num_befores);
  const pred = values.slice(num_befores);

  // X axis naming issue
  // Real x-coords: tightly spaced
  const realX = real.map((_, i) => i * realSpacing);

  // Predicted x-coords: wider spacing starts after realX
  const predX = pred.map((_, i) => realX.at(-1) + predSpacing * (i + 1));

  // Full x-coords
  const x = [...realX, ...predX];
  const y = [...real, ...pred].map((v) => v[0]);

  // Labels for tick positions
  const tickvals = [...realX, ...predX];
  const ticktext = [
    ...real.map((_, i) => `-${5*(num_befores - i)}`).slice(1),
    "Now", "+5min", "+10min", "+15min"
  ];  
    
  /* 
  const realX = real.map((_, i) => `-${5*(num_befores - i)}`).slice(1);
  const predX = ["Now", "+5min", "+10min", "+15min"];
  const x = [...realX, ...predX];
  const y = [...real, ...pred].map((v) => v[0]);
 */
  const showOutline = indicators % 100 > 9;
  const trendIndicator = indicators % 10;

  const upper = pred.map((v) => v[0] + 15);
  const lower = pred.map((v) => v[0] - 15);

  const predictionY = y.slice(num_befores); // 3 predicted values
  const predictionX = x.slice(num_befores); // ["Now", "+5min", "+10min"]

  const highlight = showOutline
    ? {
        x: predictionX,
        y: predictionY,
        type: "scatter",
        mode: "lines",
        name: "Highlight",
        line: {
          color: "rgba(255, 0, 0, 0.4)",
          width: 6,
        },
        showlegend: false,
      }
    : null;

  const trendUp = trendIndicator === 2
    ? {
        x: [...predictionX, ...predictionX.slice().reverse()],
        y: [...upper, ...predictionY.slice().reverse()],
        fill: "toself",
        fillcolor: "rgba(0, 255, 0, 0.2)",
        line: { color: "transparent" },
        name: "Possible Upward Trend",
        type: "scatter",
        showlegend: true,
      }
    : null;

  const trendDown = trendIndicator === 1
    ? {
        x: [...predictionX, ...predictionX.slice().reverse()],
        y: [...predictionY, ...lower.slice().reverse()],
        fill: "toself",
        fillcolor: "rgba(0, 0, 255, 0.2)",
        line: { color: "transparent" },
        name: "Possible Downward Trend",
        type: "scatter",
        showlegend: true,
      }
    : null;

  return (
    <Plot
      data={[
        // Prediction (red)
        {
          x,
          y: y.slice(0),
          type: "scatter",
          mode: "lines+markers",
          name: "Predicted",
          line: { color: "red" },
        },
        // Real (blue)
        {
          x,
          y: y.slice(0, num_befores),
          type: "scatter",
          mode: "lines+markers",
          name: "Real",
          line: { color: "blue" },
        },
        
        // Highlight outline if indicators > 9
        ...(showOutline ? [highlight] : []),
        // Trend change upward band
        ...(trendUp ? [trendUp] : []),
        // Trend change downward band
        ...(trendDown ? [trendDown] : []),
      ]}
      layout={{
        title: "Blood Sugar Over Time",
        paper_bgcolor: "white",
        plot_bgcolor: "#f9fafb",
        margin: { l: 40, r: 30, b: 40, t: 40 },
        yaxis: { title: "mg/dL", range: "autoscale" },
        xaxis: {
          title: "Time",
          tickvals,
          ticktext,
          tickmode: "array",
          showgrid: false,
        },
        legend: { orientation: "h", y: -0.2 },
        responsive: false,
        shapes: [
          {
            type: "line",
            x0: realX[8],
            x1: realX[8],
            y0: 0,
            y1: 1,
            xref: "x",
            yref: "paper",
            line: {
              color: "gray",
              width: 1,
              dash: "dot",
            },
          },
        ],
      }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}
