import { useEffect } from "react";
import { Preferences } from '@capacitor/preferences';

export default function BackgroundFetchRegister() {
  useEffect(() => {
    const initFetch = async () => {
      try {
        const BackgroundFetch = window.BackgroundFetch;
        if (!BackgroundFetch) {
          console.log("BackgroundFetch not available");
          return;
        }

        BackgroundFetch.configure(
            {
              minimumFetchInterval: 15,
              stopOnTerminate: false,
              enableHeadless: true,
            },
            async (taskId) => {
              console.log("[JS] BackgroundFetch event:", taskId);
          
              try {
                const { value } = await Preferences.get({ key: "credentials" });
                const credentials = JSON.parse(value || "{}");
                const username = credentials.username || "";
                const password = credentials.password || "";
          
                const res = await fetch("https://7gh3eu50xc.execute-api.eu-central-1.amazonaws.com/dev/inference", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username, password }),
                });
          
                const data = await res.json();
                console.log('✅ Full API response:', JSON.stringify(data, null, 2));
              } catch (e) {
                console.error("[JS] BackgroundFetch error:", e);
              } finally {
                window.BackgroundFetch.finish(taskId); // 🧠 This is critical!
              }
            },
            (error) => {
              console.error("BackgroundFetch config error:", error);
            }
          );
          
        console.log("✅ BackgroundFetch job configured.");
      } catch (err) {
        console.error("🔥 JS error in BackgroundFetchRegister:", err);
      }
    };

    initFetch();
  }, []);

  return null;
}
