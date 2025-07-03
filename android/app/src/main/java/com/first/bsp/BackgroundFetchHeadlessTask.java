package com.first.bsp;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONObject;

import java.io.OutputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class BackgroundFetchHeadlessTask {

    public static void onFetch(Context context, String taskId) {
        Log.d("BSP", "🔁 Background fetch triggered: " + taskId);

        try {
            SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
            String raw = prefs.getString("credentials", null);
            if (raw == null) {
                Log.w("BSP", "⚠️ No credentials saved");
                return;
            }

            JSONObject creds = new JSONObject(raw);
            String username = creds.getString("username");
            String password = creds.getString("password");

            URL url = new URL("https://your-api-url.com/inference"); // 🔁 Replace this
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String jsonBody = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}";
            OutputStream os = conn.getOutputStream();
            os.write(jsonBody.getBytes("UTF-8"));
            os.close();

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = in.readLine()) != null) sb.append(line);
                in.close();

                JSONObject result = new JSONObject(sb.toString());
                if (!result.getBoolean("safeness")) {
                    Log.d("BSP", "🚨 Triggered alert: Unsafe prediction");
                    // TODO: Show native notification if desired
                }
            } else {
                Log.e("BSP", "❌ API error: " + responseCode);
            }

        } catch (Exception e) {
            Log.e("BSP", "🔥 Exception: " + e.getMessage());
        }
    }
}
