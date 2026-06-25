import { useEffect, useState } from "react";

const LoadingState = ({
  title = "Waking up the server...",
  message = "The backend is hosted on Render, so the first request may take a little longer. You’ll know it’s ready as soon as the data appears.",
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center">
      <div className="flex max-w-md flex-col items-center">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400"></div>

        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
          Render Server Loading
        </p>

        <h3 className="mt-2 text-lg font-black text-white">{title}</h3>

        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
          {message}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-xs font-bold text-slate-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
          Waiting {seconds}s
        </div>

        <p className="mt-4 text-xs text-slate-500">
          This usually only happens on the first visit after the server has been inactive.
        </p>
      </div>
    </div>
  );
};

export default LoadingState;