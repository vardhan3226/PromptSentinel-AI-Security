import {
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Activity,
  AlertTriangle,
} from "lucide-react";

function ThreatTrendCard({ stats }) {
  const total = stats.totalScans || 0;

  const safe = stats.safePrompts || 0;
  const low = stats.lowRiskPrompts || 0;
  const medium = stats.mediumRiskPrompts || 0;
  const high = stats.highRiskPrompts || 0;
  const critical =
    stats.criticalRiskPrompts || 0;

  const getPercentage = (value) => {
    if (total === 0) {
      return 0;
    }

    return Math.round(
      (value / total) * 100
    );
  };

  const safePercent =
    getPercentage(safe);

  const lowPercent =
    getPercentage(low);

  const mediumPercent =
    getPercentage(medium);

  const highPercent =
    getPercentage(high);

  const criticalPercent =
    getPercentage(critical);

  const highRiskFindings =
    high + critical;

  const highRiskPercent =
    getPercentage(highRiskFindings);

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-lg">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Threat Distribution
          </h2>

          <p className="text-slate-400 mt-2">
            Prompt risk distribution across all scans
          </p>

        </div>

        <TrendingUp
          size={48}
          className="text-cyan-400"
        />

      </div>


      {/* EMPTY STATE */}

      {total === 0 ? (

        <div className="mt-10 bg-slate-950 rounded-xl p-8 text-center">

          <Activity
            size={40}
            className="text-slate-600 mx-auto"
          />

          <p className="text-slate-400 mt-4">

            No scan data available yet.

          </p>

          <p className="text-slate-500 text-sm mt-2">

            Scan prompts to view threat distribution.

          </p>

        </div>

      ) : (

        <div className="mt-10 space-y-6">

          {/* SAFE */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <div className="flex items-center gap-2">

                <ShieldCheck
                  className="text-green-400"
                  size={20}
                />

                <span>
                  Safe Prompts
                </span>

              </div>

              <span className="font-bold text-green-400">

                {safePercent}%

              </span>

            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${safePercent}%`,
                }}
              />

            </div>

          </div>


          {/* LOW RISK */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <div className="flex items-center gap-2">

                <Activity
                  className="text-cyan-400"
                  size={20}
                />

                <span>
                  Low Risk
                </span>

              </div>

              <span className="font-bold text-cyan-400">

                {lowPercent}%

              </span>

            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

              <div
                className="bg-cyan-500 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${lowPercent}%`,
                }}
              />

            </div>

          </div>


          {/* MEDIUM RISK */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <div className="flex items-center gap-2">

                <AlertTriangle
                  className="text-yellow-400"
                  size={20}
                />

                <span>
                  Medium Risk
                </span>

              </div>

              <span className="font-bold text-yellow-400">

                {mediumPercent}%

              </span>

            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

              <div
                className="bg-yellow-500 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${mediumPercent}%`,
                }}
              />

            </div>

          </div>


          {/* HIGH RISK */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <div className="flex items-center gap-2">

                <ShieldAlert
                  className="text-orange-400"
                  size={20}
                />

                <span>
                  High Risk
                </span>

              </div>

              <span className="font-bold text-orange-400">

                {highPercent}%

              </span>

            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${highPercent}%`,
                }}
              />

            </div>

          </div>


          {/* CRITICAL RISK */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <div className="flex items-center gap-2">

                <ShieldAlert
                  className="text-red-400"
                  size={20}
                />

                <span>
                  Critical Risk
                </span>

              </div>

              <span className="font-bold text-red-400">

                {criticalPercent}%

              </span>

            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${criticalPercent}%`,
                }}
              />

            </div>

          </div>

        </div>

      )}


      {/* SUMMARY */}

      <div className="grid grid-cols-3 gap-5 mt-10">

        {/* TOTAL */}

        <div className="bg-slate-950 rounded-xl p-5 text-center">

          <p className="text-slate-400 text-sm">
            Total Scans
          </p>

          <h3 className="text-3xl font-bold text-cyan-400 mt-2">
            {total}
          </h3>

        </div>


        {/* SAFE */}

        <div className="bg-slate-950 rounded-xl p-5 text-center">

          <p className="text-slate-400 text-sm">
            Safe
          </p>

          <h3 className="text-3xl font-bold text-green-400 mt-2">
            {safe}
          </h3>

        </div>


        {/* HIGH RISK FINDINGS */}

        <div className="bg-slate-950 rounded-xl p-5 text-center">

          <p className="text-slate-400 text-sm">
            High-Risk
          </p>

          <h3 className="text-3xl font-bold text-red-400 mt-2">
            {highRiskFindings}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {highRiskPercent}% of scans
          </p>

        </div>

      </div>

    </div>
  );
}

export default ThreatTrendCard;