import {
  ShieldCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";

function SecurityHealthCard({ stats }) {
  const total = stats.totalScans || 0;

  const safe = stats.safePrompts || 0;
  const low = stats.lowRiskPrompts || 0;
  const medium = stats.mediumRiskPrompts || 0;
  const high = stats.highRiskPrompts || 0;
  const critical = stats.criticalRiskPrompts || 0;

  let score = 0;

  if (total > 0) {
    /*
     * Security Score Calculation
     *
     * Safe prompts      = 100%
     * Low risk prompts  = 80%
     * Medium risk       = 55%
     * High risk         = 25%
     * Critical risk     = 0%
     *
     * The final score represents the
     * overall security condition of
     * scanned prompts.
     */

    const weightedScore =
      safe * 100 +
      low * 80 +
      medium * 55 +
      high * 25 +
      critical * 0;

    score = Math.round(
      weightedScore / total
    );
  }

  let status = "No Data";
  let color = "text-slate-400";
  let progress = "bg-slate-500";

  if (total > 0 && score >= 90) {
    status = "Excellent";
    color = "text-green-400";
    progress = "bg-green-500";
  } else if (total > 0 && score >= 75) {
    status = "Good";
    color = "text-cyan-400";
    progress = "bg-cyan-500";
  } else if (total > 0 && score >= 50) {
    status = "Warning";
    color = "text-yellow-400";
    progress = "bg-yellow-500";
  } else if (total > 0) {
    status = "Critical";
    color = "text-red-400";
    progress = "bg-red-500";
  }

  const highRiskFindings =
    high + critical;

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-lg">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Security Health
          </h2>

          <p className="text-slate-400 mt-2">
            Overall prompt security based on scan results
          </p>

        </div>

        <ShieldCheck
          size={48}
          className={color}
        />

      </div>


      {/* SECURITY SCORE */}

      <div className="mt-8">

        <div className="flex justify-between items-center">

          <span className="text-slate-400">
            Security Score
          </span>

          <span
            className={`font-bold text-3xl ${color}`}
          >
            {score}%
          </span>

        </div>

        <div className="w-full bg-slate-700 rounded-full h-4 mt-4 overflow-hidden">

          <div
            className={`${progress} h-4 rounded-full transition-all duration-700`}
            style={{
              width: `${score}%`,
            }}
          />

        </div>

      </div>


      {/* INFORMATION CARDS */}

      <div className="grid grid-cols-2 gap-5 mt-8">

        {/* HIGH RISK FINDINGS */}

        <div className="bg-slate-950 rounded-xl p-5">

          <ShieldAlert
            className="text-red-400 mb-3"
          />

          <p className="text-slate-400">
            High-Risk Findings
          </p>

          <h3 className="text-2xl font-bold mt-2 text-white">
            {highRiskFindings}
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            High + Critical scans
          </p>

        </div>


        {/* STATUS */}

        <div className="bg-slate-950 rounded-xl p-5">

          <Activity
            className={`${color} mb-3`}
          />

          <p className="text-slate-400">
            Status
          </p>

          <h3
            className={`text-2xl font-bold mt-2 ${color}`}
          >
            {status}
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            Based on {total} scan
            {total === 1 ? "" : "s"}
          </p>

        </div>

      </div>


      {/* NO DATA MESSAGE */}

      {total === 0 && (

        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">

          <p className="text-slate-400 text-sm">

            Run your first prompt scan to generate
            security health data.

          </p>

        </div>

      )}

    </div>
  );
}

export default SecurityHealthCard;