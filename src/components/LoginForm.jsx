import { useState } from "react";

// LoginForm component handles user login UI and API request
export default function LoginForm({ onLoginSuccess }) {
  // State for username and password input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State to handle loading spinner and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form submission logic: sends a POST request to Flask API
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form reload
    setLoading(true);   // show loading
    setError("");       // reset any prior error

    try {
      // Make the API call to /run/<username>/<password>
      const res = await fetch(`http://127.0.0.1:8080/run/${username}/${password}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      // Call the success callback with API result
      onLoginSuccess(data);
    } catch (err) {
      // Display any caught error
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          BSP Login
        </h2>

        {/* Username field */}
        <label className="block mb-2 text-sm text-gray-700">Email</label>
        <input
          type="email"
          required
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password field */}
        <label className="block mb-2 text-sm text-gray-700">Password</label>
        <input
          type="password"
          required
          className="w-full mb-6 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Display error message if any */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
