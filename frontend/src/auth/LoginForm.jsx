import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-400/10 rounded-3xl p-8 shadow-2xl">

      <h2 className="text-4xl font-bold text-white text-center">
        Welcome Back
      </h2>

      <p className="text-slate-400 text-center mt-3">
        Login to your PromptSentinel account
      </p>

      {error && (
        <p className="text-red-500 text-center mt-4">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} className="mt-8 space-y-5">

        <div>
          <label className="block text-slate-300 mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-16 text-white outline-none focus:border-cyan-400 transition"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-cyan-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Login"}
        </button>

      </form>

      <p className="text-center text-slate-400 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-cyan-400 hover:underline"
        >
          Register
        </Link>
      </p>

    </div>
  );
}

export default LoginForm;