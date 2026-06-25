 const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const StatsBanner = ({ members = [] }) => {
  const totalEmployees = members.length;

  const activeEmployees = members.filter(
    (member) => member.status === "Active"
  ).length;

  const onLeaveEmployees = members.filter(
    (member) => member.status === "On Leave"
  ).length;

  const inactiveEmployees = members.filter(
    (member) => member.status === "Inactive"
  ).length;

  const annualPayroll = members.reduce((total, member) => {
    return total + Number(member.salary || 0);
  }, 0);

  const averageSalary =
    totalEmployees > 0 ? Math.round(annualPayroll / totalEmployees) : 0;

  return (
    <section className="mb-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-white/[0.06] to-emerald-400/10 p-4 shadow-xl shadow-cyan-950/20">
      <div className="mb-4 flex flex-col gap-1 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Workforce Summary
          </p>
          <h3 className="mt-1 text-lg font-black text-white">
            Company Overview
          </h3>
        </div>

        <p className="text-sm font-semibold text-slate-400">
          Annual payroll and employee status totals
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard label="Employees" value={totalEmployees} />
        <StatCard label="Active" value={activeEmployees} tone="green" />
        <StatCard label="On Leave" value={onLeaveEmployees} tone="yellow" />
        <StatCard label="Inactive" value={inactiveEmployees} tone="red" />

        <StatCard
          label="Payroll"
          value={formatMoney(annualPayroll)}
          subtext="Annual total"
          large
        />

        <StatCard
          label="Average"
          value={formatMoney(averageSalary)}
          subtext="Per employee"
          large
        />
      </div>
    </section>
  );
};

const StatCard = ({ label, value, subtext, tone = "default", large = false }) => {
  const toneClasses = {
    default: "text-white",
    green: "text-emerald-300",
    yellow: "text-yellow-300",
    red: "text-red-300",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

      <h4
        className={`mt-2 font-black ${toneClasses[tone]} ${
          large ? "text-base" : "text-2xl"
        }`}
      >
        {value}
      </h4>

      {subtext && (
        <p className="mt-1 text-xs font-semibold text-slate-500">{subtext}</p>
      )}
    </div>
  );
};

export default StatsBanner;