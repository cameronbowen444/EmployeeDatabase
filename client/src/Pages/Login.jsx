import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../Components/LoadingState";

const API_URL = "https://employeedatabase-d9cz.onrender.com/api";

const Login = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const timedOut = searchParams.get("timeout") === "true";

  const navigate = useNavigate();
  const { loginUser, authLoading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/login`, form, {
        withCredentials: true,
      });

      loginUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <LoadingState
        title="Loading backend data..."
        message="The backend is hosted on Render and may need a few seconds to wake up. The login form will appear automatically once the server responds."
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            Welcome Back
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">Login</h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Login with an approved account to view employee data.
          </p>
        </div>

        {timedOut && !error && (
          <div className="mb-4 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-100">
            You were logged out after 1 hour of inactivity.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        {isSubmitting && (
          <div className="mb-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300"></div>

              <span>
                Logging in... Render may need a few seconds to wake up.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateForm}
              placeholder="test@test.com"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateForm}
              placeholder="password123"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/10"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Waiting for server..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Need an account?{" "}
          <Link to="/register" className="font-bold text-cyan-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;