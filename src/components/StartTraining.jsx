import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function StartTraining() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(state?.username || "");
  const [password, setPassword] = useState(state?.password || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const startViaAppRunner = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Step 1: Fetch Dexcom data using App Runner
      const res1 = await fetch(
        `https://ejfh8eyg6j.eu-central-1.awsapprunner.com/run/${username}/${password}`,
        { method: "POST" }
      );
      const data1 = await res1.json();
      if (!res1.ok) throw new Error(data1?.error || "Dexcom fetch failed");

      // Optional: notify user step 1 succeeded
      setMessage("Dexcom data fetched, now starting training...");

      // Step 2: Trigger training Lambda
      const res2 = await fetch("https://7gh3eu50xc.execute-api.eu-central-1.amazonaws.com/dev/training_job_trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          num_of_models: 2,
          epochs: 7,
          batch_size: 24,
          remaining_tries: 2,
          acceptable_acc_score: 0.1,
          seq_len: 12,
          num_of_layers: 3
        })
      });

      const data2 = await res2.json();
      if (!res2.ok) throw new Error(data2?.error || "Training job failed");

      setMessage("Training successfully triggered!");

      navigate("/predict", { state: { username, password } });

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startViaLambda = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://7gh3eu50xc.execute-api.eu-central-1.amazonaws.com/dev/training_job_trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          num_of_models: 2,
          epochs: 7,
          batch_size: 24,
          remaining_tries: 2,
          num_of_layers: 5,
          acceptable_acc_score: 0.1,
          seq_len: 12
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Training failed.");

      setMessage("Training started from existing data!");

      navigate("/predict", { state: { username, password } });

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-200">
      <div className="bg-white shadow-xl rounded-xl px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Start Model Training
        </h2>

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={startViaAppRunner}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 mb-3"
        >
          {loading ? "Working..." : "Fetch Dexcom Data + Start Training"}
        </button>

        <button
          onClick={startViaLambda}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Starting..." : "Start Training from Existing Data"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
