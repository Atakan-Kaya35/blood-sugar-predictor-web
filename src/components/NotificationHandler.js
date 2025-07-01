// NotificationHandler.js
/*
export function handleInferenceNotification(data) {
    if (Notification.permission !== "granted") return;
  
    const safe = data.safeness;
    const trend = data.trend ?? 56;
    const indicators = String(data.indicators).padStart(3, "0");
    const [extreme, plateau, trendChange] = indicators.split("").map(Number);
    const trendDir = trend % 8;
  
    // 🚨 Unsafe levels
    if (!safe) {
      new Notification("🚨 Blood Sugar Alert", {
        body: "Your levels are out of the safe range. Please take care.",
      });
    }
  
    // 📉 Rapid drop
    if (trendDir <= 2) {
      new Notification("⚠️ Rapid Drop Detected", {
        body: "You're trending down fast. Consider having a snack or checking your levels.",
      });
    }
  
    // 📛 Extreme prediction
    if (extreme === 1 || extreme === 2) {
      new Notification("📛 Extreme Value Expected", {
        body: "A very low or high blood sugar is predicted soon.",
      });
    }
  
    // ⏸️ Plateau indicator
    if (plateau === 1) {
      new Notification("⏸️ Plateau Ahead", {
        body: "Glucose levels may stabilize. Monitor to confirm.",
      });
    }
  
    // 🔄 Trend change indicator
    if (trendChange === 1 || trendChange === 2) {
      new Notification("🔄 Trend Shift", {
        body: "Upcoming change in trend detected. Stay alert.",
      });
    }
  }
    */
  