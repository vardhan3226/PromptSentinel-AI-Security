import {
  ShieldCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";

function SecurityHealthCard({ stats }) {
  const total = stats?.totalScans || 0;

  const safe = stats?.safePrompts || 0;
  const low = stats?.lowRiskPrompts || 0;
  const medium = stats?.mediumRiskPrompts || 0;
  const high = stats?.highRiskPrompts || 0;
  const critical = stats?.criticalRiskPrompts || 0;

  let score = 0;

  if (total > 0) {
    const weightedScore =
      safe * 100 +
      low * 80 +
      medium * 55 +
      high * 25 +
      critical * 0;

    score = Math.round(weightedScore / total);
  }

  let status = "No Data";
  let statusColor = "text-slate-400";
  let statusBg = "bg-slate-100";
  let progressColor = "bg-slate-400";

  if (total > 0 && score >= 90) {
    status = "Excellent";
    statusColor = "text-green-600";
    statusBg = "bg-green-50";
    progressColor = "bg-green-500";
  } else if (total > 0 && score >= 75) {
    status = "Good";
    statusColor = "text-blue-600";
    statusBg = "bg-blue-50";
    progressColor = "bg-blue-500";
  } else if (total > 0 && score >= 50) {
    status = "Warning";
    statusColor = "text-yellow-600";
    statusBg = "bg-yellow-50";
    progressColor = "bg-yellow-500";
  } else if (total > 0) {
    status = "Critical";
    statusColor = "text-red-600";
    statusBg = "bg-red-50";
    progressColor = "bg-red-500";
  }

  const highRiskFindings = high + critical;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* TOP ACCENT */}

      <div
        className={`absolute left-0 top-0 h-1 w-full ${progressColor}`}
      />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <ShieldCheck
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Security Health
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Overall prompt security status
              </p>

            </div>

          </div>

        </div>

        <div
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusBg} ${statusColor}`}
        >
          {status}
        </div>

      </div>

      {/* SCORE */}

      <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-5">

        <div className="flex items-end justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              Security Score
            </p>

            <p className={`mt-1 text-4xl font-black ${statusColor}`}>
              {score}%
            </p>

          </div>

          <Activity
            size={28}
            className={statusColor}
          />

        </div>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">

          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{
              width: `${Math.min(
                Math.max(score, 0),
                100
              )}%`,
            }}
          />

        </div>

        <div className="mt-2 flex justify-between text-[10px] text-slate-400">
          <span>0</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

      </div>

      {/* INFORMATION */}

      <div className="mt-5 grid grid-cols-2 gap-4">

        {/* HIGH RISK */}

        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">

          <div className="flex items-center justify-between">

            <p className="text-xs font-medium text-slate-500">
              High-Risk Findings
            </p>

            <ShieldAlert
              size={19}
              className="text-red-500"
            />

          </div>

          <p className="mt-2 text-2xl font-black text-red-600">
            {highRiskFindings}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            High + Critical
          </p>

        </div>

        {/* SCANS */}

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">

          <div className="flex items-center justify-between">

            <p className="text-xs font-medium text-slate-500">
              Total Scans
            </p>

            <Activity
              size={19}
              className="text-blue-500"
            />

          </div>

          <p className="mt-2 text-2xl font-black text-blue-600">
            {total}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Security analyses
          </p>

        </div>

      </div>

      {/* EMPTY STATE */}

      {total === 0 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">

          <p className="text-xs text-slate-500">
            Run your first prompt scan to generate
            security health data.
          </p>

        </div>
      )}

    </div>
  );
}

export default SecurityHealthCard;