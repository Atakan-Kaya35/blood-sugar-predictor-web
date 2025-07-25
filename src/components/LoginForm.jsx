import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Login button logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Don't fetch here — just navigate
      navigate("/predict", { state: { username, password } });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign Up button logic
  const handleSignup = () => {
    navigate("/start-training", {
      state: { username, password }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-purple-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-xl px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <img src={logo} alt="App Logo" className="w-36 h-36 mb-6 mx-auto" />

        <label className="block mb-2 text-sm text-gray-700">Email</label>
        <input
          type="email"
          required
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2 text-sm text-gray-700">Password</label>
        <input
          type="password"
          required
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mb-3"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gray-200 text-purple-800 font-semibold py-2 rounded hover:bg-gray-300"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
