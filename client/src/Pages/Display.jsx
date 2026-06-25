import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import LoadingState from "../Components/LoadingState";
import Alert from "../Components/Alert";
import ConfirmModal from "../Components/ConfirmModal";
import StatsBanner from "../Components/StatsBanner";

const API_URL = "https://employeedatabase-d9cz.onrender.com/api/members";

const formatSalary = (salary) => {
  if (!salary && salary !== 0) return "N/A";

  return Number(salary).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const Display = () => {
  const [members, setMembers] = useState([]);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = async () => {
    try {
      const res = await axios.get(API_URL, {
        withCredentials: true,
      });

      setMembers(res.data);
    } catch (err) {
      console.log(err);

      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Could not load employees. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);

    try {
      await axios.delete(`${API_URL}/${memberToDelete._id}`, {
        withCredentials: true,
      });

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberToDelete._id)
      );

      setAlert({
        type: "success",
        message: `${memberToDelete.firstName} ${memberToDelete.lastName} was deleted.`,
      });

      setMemberToDelete(null);
    } catch (err) {
      console.log(err);

      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Could not delete this employee. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Loading employees..."
        message="Fetching secure employee records."
      />
    );
  }

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <StatsBanner members={members} />
      <div className="mb-5 flex items-center justify-between gap-4">
        
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
            Protected Records
          </p>
          <h2 className="mt-1 text-xl font-black text-white">Employees</h2>
        </div>

        <Link
          to="/new"
          className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
        >
          + Add Employee
        </Link>
      </div>

      
      {members.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-xl">
            🗂️
          </div>

          <h3 className="text-lg font-black text-white">Nothing here yet</h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Add your first employee record to start the demo.
          </p>

          <Link
            to="/new"
            className="mt-5 inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Create Employee
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 text-sm font-black text-slate-950">
                  {member.firstName?.charAt(0).toUpperCase()}
                  {member.lastName?.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-black text-white">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="truncate text-sm font-semibold text-slate-400">
                    {member.position}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-300">
                  {member.department}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    member.status === "Active"
                      ? "bg-emerald-400/10 text-emerald-300"
                      : member.status === "On Leave"
                        ? "bg-yellow-400/10 text-yellow-300"
                        : "bg-red-400/10 text-red-300"
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <InfoBox label="Age" value={member.age} />
                <InfoBox label="Salary" value={formatSalary(member.salary)} />
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                <p className="truncate text-sm font-semibold text-slate-300">
                  {member.email}
                </p>
                <p className="mt-1 text-sm text-slate-500">{member.phone}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to={`/edit/${member._id}`}
                  className="rounded-xl border border-white/10 px-3 py-2 text-center text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Update
                </Link>

                <button
                  type="button"
                  onClick={() => setMemberToDelete(member)}
                  className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!memberToDelete}
        title="Delete employee?"
        message={`Are you sure you want to delete ${memberToDelete?.firstName} ${memberToDelete?.lastName}? This cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
        onClose={() => !isDeleting && setMemberToDelete(null)}
        onConfirm={deleteMember}
      />
    </div>
  );
};

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>

      <strong className="mt-1 block text-sm font-black text-white">
        {value}
      </strong>
    </div>
  );
};

export default Display;