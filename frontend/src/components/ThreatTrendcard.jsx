import { ShieldCheck, ShieldAlert, Activity } from "lucide-react";

function ThreatTrendCard({ stats }) {
  const total = stats?.totalScans || 0;

  const safe = stats?.safePrompts || 0;
  const low = stats?.lowRiskPrompts || 0;
  const medium = stats?.mediumRiskPrompts || 0;
  const high = stats?.highRiskPrompts || 0;
  const critical = stats?.criticalRiskPrompts || 0;

  const highRiskFindings = high + critical;

  const getPercentage = (value) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const threats = [
    {
      name: "Safe",
      value: safe,
      percentage: getPercentage(safe),
      bar: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      name: "Low",
      value: low,
      percentage: getPercentage(low),
      bar: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      name: "Medium",
      value: medium,
      percentage: getPercentage(medium),
      bar: "bg-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      name: "High",
      value: high,
      percentage: getPercentage(high),
      bar: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      name: "Critical",
      value: critical,
      percentage: getPercentage(critical),
      bar: "bg-red-500",
      bg: "bg-red-50",
      text: "text-red-600",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* TOP ACCENT */}

      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-500 via-blue-500 to-red-500" />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Activity
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Threat Distribution
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Security findings across scanned prompts
            </p>
          </div>

        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {total} Scans
        </span>

      </div>

      {/* THREAT BARS */}

      <div className="mt-7 space-y-5">

        {threats.map((threat) => (
          <div key={threat.name}>

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${threat.bg}`}
                >
                  {threat.name === "Safe" ? (
                    <ShieldCheck
                      size={15}
                      className={threat.text}
                    />
                  ) : (
                    <ShieldAlert
                      size={15}
                      className={threat.text}
                    />
                  )}
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {threat.name}
                </span>

              </div>

              <div className="flex items-center gap-2">

                <span className="text-sm font-bold text-slate-800">
                  {threat.value}
                </span>

                <span className="text-[10px] text-slate-400">
                  ({threat.percentage}%)
                </span>

              </div>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className={`h-full rounded-full transition-all duration-700 ${threat.bar}`}
                style={{
                  width: `${threat.percentage}%`,
                }}
              />

            </div>

          </div>
        ))}

      </div>

      {/* SUMMARY */}

      <div className="mt-7 grid grid-cols-3 gap-3">

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">
            {total}
          </p>

        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
            Safe
          </p>

          <p className="mt-1 text-xl font-black text-green-600">
            {safe}
          </p>

        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 p-3">

          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
            High Risk
          </p>

          <p className="mt-1 text-xl font-black text-red-600">
            {highRiskFindings}
          </p>

        </div>

      </div>

      {/* EMPTY STATE */}

      {total === 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">

          <p className="text-xs text-slate-500">
            No threat distribution data is available yet.
          </p>

        </div>
      )}

    </div>
  );
}

export default ThreatTrendCard;