const Alert = ({ type = "success", message, onClose }) => {
  const isError = type === "error";

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
        isError
          ? "border-red-400/30 bg-red-500/10 text-red-100"
          : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <span>{isError ? "⚠️" : "✅"}</span>
        <p>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-300 transition hover:text-white"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;