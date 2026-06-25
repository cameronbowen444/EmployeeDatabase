const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const confirmClass =
    variant === "danger"
      ? "bg-red-500 text-white hover:bg-red-400"
      : "bg-cyan-400 text-slate-950 hover:bg-cyan-300";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-xl">
          {isLoading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400"></div>
          ) : (
            "?"
          )}
        </div>

        <h3 className="text-xl font-black text-white">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">{message}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-4 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClass}`}
          >
            {isLoading ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;