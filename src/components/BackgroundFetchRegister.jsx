import { useEffect } from "react";

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
            minimumFetchInterval: 15, // every 15 minutes
            stopOnTerminate: false,   // continue after app close
            enableHeadless: true,     // run even if app killed
          },
          async (taskId) => {
            console.log("[JS] BackgroundFetch event: ", taskId);
            // (Optional: fetch from API here using saved credentials)
            BackgroundFetch.finish(taskId);
          },
          (error) => {
            console.error("Failed to configure BackgroundFetch", error);
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
