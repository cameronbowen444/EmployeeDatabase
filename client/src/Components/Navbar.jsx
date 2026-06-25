import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser, isLoggedIn } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/90">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-sm font-black text-slate-950">
            MD
          </div>

          <div>
            <h1 className="text-base font-black leading-none tracking-tight">
              Member Database
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              Secure Admin Panel
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-slate-950"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                Members
              </NavLink>

              <NavLink
                to="/new"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400 hover:text-slate-950"
                  }`
                }
              >
                Add
              </NavLink>

              <div className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                {user?.firstName}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-red-500/10 hover:text-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-slate-950"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400 hover:text-slate-950"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;