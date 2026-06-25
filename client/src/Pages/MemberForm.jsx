import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Alert from "../Components/Alert";
import ConfirmModal from "../Components/ConfirmModal";

const API_URL = "http://localhost:8000/api/members";

const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "Operations",
  "Human Resources",
  "Finance",
  "Customer Support",
  "Management",
];

const statuses = ["Active", "On Leave", "Inactive"];

const initialForm = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  phone: "",
  position: "",
  department: "",
  salary: "",
  status: "Active",
};

const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, "").slice(0, 10);

  if (numbers.length <= 3) return numbers;

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  }

  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
};

const formatSalary = (value) => {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  return Number(numbers).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const cleanSalary = (value) => {
  return Number(value.replace(/[^0-9]/g, ""));
};

const MemberForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateForm = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    if (name === "salary") {
      formattedValue = formatSalary(value);
    }

    setForm({
      ...form,
      [name]: formattedValue,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setAlert(null);
  };

  const validateFrontend = () => {
    const newErrors = {};
    const phoneNumbers = form.phone.replace(/\D/g, "");
    const salaryNumber = cleanSalary(form.salary);

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (form.firstName.trim().length < 3) {
      newErrors.firstName = "First name must be at least 3 characters.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (form.lastName.trim().length < 3) {
      newErrors.lastName = "Last name must be at least 3 characters.";
    }

    if (!form.age) {
      newErrors.age = "Age is required.";
    } else if (Number(form.age) < 18) {
      newErrors.age = "Must be at least 18.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (phoneNumbers.length !== 10) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (!form.position.trim()) {
      newErrors.position = "Position is required.";
    } else if (form.position.trim().length < 2) {
      newErrors.position = "Position must be at least 2 characters.";
    }

    if (!form.department) {
      newErrors.department = "Department is required.";
    }

    if (!form.salary) {
      newErrors.salary = "Salary is required.";
    } else if (salaryNumber < 0) {
      newErrors.salary = "Salary cannot be negative.";
    }

    if (!form.status) {
      newErrors.status = "Status is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openConfirm = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateFrontend()) return;

    setShowConfirm(true);
  };

  const createMember = async () => {
    setIsSubmitting(true);
    setErrors({});
    setAlert(null);

    try {
      await axios.post(
        API_URL,
        {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          age: Number(form.age),
          email: form.email.trim(),
          phone: form.phone.trim(),
          position: form.position.trim(),
          department: form.department,
          salary: cleanSalary(form.salary),
          status: form.status,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (err) {
      console.log(err);

      const backendErrors = err.response?.data?.err?.errors;

      if (backendErrors) {
        const cleanErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          cleanErrors[key] = backendErrors[key].message;
        });

        setErrors(cleanErrors);
      }

      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Could not create employee. Please check the form.",
      });

      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
            New Employee
          </p>

          <h2 className="mt-1 text-xl font-black text-white">Add Employee</h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Add a clean employee record to the protected database.
          </p>
        </div>

        <form onSubmit={openConfirm} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={updateForm}
              error={errors.firstName}
              placeholder="Cameron"
            />

            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={updateForm}
              error={errors.lastName}
              placeholder="Bowen"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={updateForm}
              error={errors.age}
              placeholder="25"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateForm}
              error={errors.email}
              placeholder="employee@email.com"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={updateForm}
              error={errors.phone}
              placeholder="818-555-1234"
            />

            <Input
              label="Position"
              name="position"
              value={form.position}
              onChange={updateForm}
              error={errors.position}
              placeholder="Software Engineer"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Department"
              name="department"
              value={form.department}
              onChange={updateForm}
              error={errors.department}
              options={departments}
              placeholder="Select department"
            />

            <Input
              label="Salary"
              name="salary"
              type="text"
              inputMode="numeric"
              value={form.salary}
              onChange={updateForm}
              error={errors.salary}
              placeholder="$75,000"
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={updateForm}
              error={errors.status}
              options={statuses}
              placeholder="Select status"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="rounded-xl border border-white/10 px-4 py-2 text-center text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Add this employee?"
        message={`Create ${form.firstName} ${form.lastName} as a new ${
          form.position || "employee"
        } record?`}
        confirmText="Create Employee"
        variant="primary"
        isLoading={isSubmitting}
        onClose={() => !isSubmitting && setShowConfirm(false)}
        onConfirm={createMember}
      />
    </div>
  );
};

const Input = ({
  label,
  name,
  type = "text",
  inputMode,
  value,
  onChange,
  error,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-200">
        {label}
      </label>

      <input
        type={type}
        inputMode={inputMode}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-300 focus:ring-red-400/10"
            : "border-white/10 focus:border-cyan-300 focus:ring-cyan-400/10"
        }`}
      />

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-200">{error}</p>
      )}
    </div>
  );
};

const Select = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-200">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-300 focus:ring-red-400/10"
            : "border-white/10 focus:border-cyan-300 focus:ring-cyan-400/10"
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950">
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-200">{error}</p>
      )}
    </div>
  );
};

export default MemberForm;