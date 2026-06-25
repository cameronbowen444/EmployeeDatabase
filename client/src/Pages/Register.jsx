import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8000/api";

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    permissionCode: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await axios.post(`${API_URL}/register`, form, {
        withCredentials: true,
      });

      loginUser(res.data.user);
      navigate("/");
    } catch (err) {
      const backendErrors = err.response?.data?.err?.errors;

      if (backendErrors) {
        const cleanErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          cleanErrors[key] = backendErrors[key].message;
        });

        setFieldErrors(cleanErrors);
      }

      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
            Permission Required
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">Register</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Create an approved account using the correct permission code.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={updateForm}
              error={fieldErrors.firstName}
            />

            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={updateForm}
              error={fieldErrors.lastName}
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateForm}
            error={fieldErrors.email}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={updateForm}
              error={fieldErrors.password}
            />

            <Input
              label="Confirm"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateForm}
              error={fieldErrors.confirmPassword}
            />
          </div>

          <Input
            label="Permission Code"
            name="permissionCode"
            value={form.permissionCode}
            onChange={updateForm}
            error={fieldErrors.permissionCode}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-emerald-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-200">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-300 focus:ring-red-400/10"
            : "border-white/10 focus:border-emerald-300 focus:ring-emerald-400/10"
        }`}
      />

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-200">{error}</p>
      )}
    </div>
  );
};

export default Register;