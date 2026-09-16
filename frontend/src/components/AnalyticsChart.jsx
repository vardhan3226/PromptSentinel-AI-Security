import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| THREAT TOOLTIP
|--------------------------------------------------------------------------
*/

function ThreatTooltip({
  active,
  payload,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-white font-semibold">
        {item.payload.name}
      </p>

      <p className="text-cyan-400 mt-1">
        Prompts: {item.value}
      </p>
    </div>
  );
}

function AnalyticsChart({ stats }) {
  /*
  |--------------------------------------------------------------------------
  | SAFE FALLBACK VALUES
  |--------------------------------------------------------------------------
  */

  const totalScans = Number(
    stats?.totalScans || 0
  );

  const safePrompts = Number(
    stats?.safePrompts || 0
  );

  const lowRiskPrompts = Number(
    stats?.lowRiskPrompts || 0
  );

  const mediumRiskPrompts = Number(
    stats?.mediumRiskPrompts || 0
  );

  const highRiskPrompts = Number(
    stats?.highRiskPrompts || 0
  );

  const criticalRiskPrompts = Number(
    stats?.criticalRiskPrompts || 0
  );

  const highRiskFindings = Number(
    stats?.highRiskFindings ??
      highRiskPrompts + criticalRiskPrompts
  );

  const averageRiskScore = Number(
    stats?.averageRiskScore || 0
  );

  const safePromptRate = Number(
    stats?.safePromptRate || 0
  );

  /*
  |--------------------------------------------------------------------------
  | HIGH RISK RATE
  |--------------------------------------------------------------------------
  */

  const highRiskRate =
    totalScans === 0
      ? 0
      : Math.round(
          (highRiskFindings / totalScans) *
            100
        );

  /*
  |--------------------------------------------------------------------------
  | THREAT DISTRIBUTION DATA
  |--------------------------------------------------------------------------
  */

  const pieData = [
    {
      name: "Safe",
      value: safePrompts,
    },
    {
      name: "Low",
      value: lowRiskPrompts,
    },
    {
      name: "Medium",
      value: mediumRiskPrompts,
    },
    {
      name: "High",
      value: highRiskPrompts,
    },
    {
      name: "Critical",
      value: criticalRiskPrompts,
    },
  ].filter(
    (item) => item.value > 0
  );

  /*
  |--------------------------------------------------------------------------
  | THREAT LEVEL BAR DATA
  |--------------------------------------------------------------------------
  */

  const threatBarData = [
    {
      name: "Safe",
      count: safePrompts,
    },
    {
      name: "Low",
      count: lowRiskPrompts,
    },
    {
      name: "Medium",
      count: mediumRiskPrompts,
    },
    {
      name: "High",
      count: highRiskPrompts,
    },
    {
      name: "Critical",
      count: criticalRiskPrompts,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | THREAT COLORS
  |--------------------------------------------------------------------------
  */

  const THREAT_COLORS = {
    Safe: "#22c55e",
    Low: "#eab308",
    Medium: "#f97316",
    High: "#ef4444",
    Critical: "#991b1b",
  };

  /*
  |--------------------------------------------------------------------------
  | ATTACK TYPE DATA
  |--------------------------------------------------------------------------
  */

  const rawAttackDistribution =
    stats?.attackTypeDistribution;

  let attackTypeData = [];

  if (
    Array.isArray(
      rawAttackDistribution
    )
  ) {
    attackTypeData =
      rawAttackDistribution
        .map((item) => ({
          name:
            item?.name ||
            item?.attackType ||
            "Unknown",

          value: Number(
            item?.value ??
              item?.count ??
              item?.Count ??
              0
          ),
        }))
        .filter(
          (item) =>
            item.name &&
            item.value > 0
        );
  } else if (
    rawAttackDistribution &&
    typeof rawAttackDistribution ===
      "object"
  ) {
    attackTypeData =
      Object.entries(
        rawAttackDistribution
      )
        .map(
          ([name, value]) => ({
            name,
            value: Number(
              value || 0
            ),
          })
        )
        .filter(
          (item) =>
            item.value > 0
        );
  }

  /*
  |--------------------------------------------------------------------------
  | SORT ATTACK TYPES
  |--------------------------------------------------------------------------
  */

  attackTypeData.sort(
    (a, b) =>
      b.value - a.value
  );

  /*
  |--------------------------------------------------------------------------
  | SHOW TOP ATTACK TYPES
  |--------------------------------------------------------------------------
  */

  const displayedAttackTypes =
    attackTypeData.slice(0, 8);

  /*
  |--------------------------------------------------------------------------
  | ATTACK TYPE BAR COLORS
  |--------------------------------------------------------------------------
  */

  const ATTACK_COLORS = [
    "#06b6d4",
    "#8b5cf6",
    "#f97316",
    "#ef4444",
    "#eab308",
    "#ec4899",
    "#14b8a6",
    "#6366f1",
  ];

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-8">

      {/* ================================================================
          KEY SECURITY METRICS
      ================================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* SAFE PROMPT RATE */}

        <div className="bg-slate-900 border border-green-500/20 rounded-2xl p-6">

          <ShieldCheck
            size={34}
            className="text-green-400 mb-4"
          />

          <p className="text-slate-400">
            Safe Prompt Rate
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-2">
            {safePromptRate}%
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {safePrompts} of {totalScans} scans
          </p>

        </div>

        {/* HIGH RISK RATE */}

        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6">

          <ShieldAlert
            size={34}
            className="text-red-400 mb-4"
          />

          <p className="text-slate-400">
            High Risk Rate
          </p>

          <h2 className="text-4xl font-bold text-red-400 mt-2">
            {highRiskRate}%
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            HIGH + CRITICAL findings
          </p>

        </div>

        {/* AVERAGE RISK SCORE */}

        <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6">

          <Activity
            size={34}
            className="text-cyan-400 mb-4"
          />

          <p className="text-slate-400">
            Average Risk Score
          </p>

          <h2 className="text-4xl font-bold text-cyan-400 mt-2">
            {averageRiskScore}

            <span className="text-xl text-slate-500">
              /100
            </span>
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Across all prompt scans
          </p>

        </div>

      </div>

      {/* ================================================================
          THREAT LEVEL ANALYSIS
      ================================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* THREAT DISTRIBUTION */}

        <div className="bg-slate-900 rounded-3xl p-6 border border-cyan-500/20">

          <h2 className="text-2xl font-bold mb-2">
            Threat Distribution
          </h2>

          <p className="text-slate-500 text-sm mb-6">
            Distribution of detected threat levels
          </p>

          {pieData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={115}
                  innerRadius={58}
                  paddingAngle={2}
                >

                  {pieData.map(
                    (entry, index) => (
                      <Cell
                        key={`threat-${index}`}
                        fill={
                          THREAT_COLORS[
                            entry.name
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  content={
                    <ThreatTooltip />
                  }
                />

                <Legend
                  verticalAlign="bottom"
                  height={50}
                  formatter={(value) => (
                    <span className="text-slate-300">
                      {value}
                    </span>
                  )}
                />

              </PieChart>

            </ResponsiveContainer>

          ) : (

            <div className="flex items-center justify-center h-80">

              <p className="text-slate-500">
                No threat data available.
              </p>

            </div>

          )}

        </div>

        {/* THREAT ANALYSIS */}

        <div className="bg-slate-900 rounded-3xl p-6 border border-cyan-500/20">

          <h2 className="text-2xl font-bold mb-2">
            Threat Analysis
          </h2>

          <p className="text-slate-500 text-sm mb-6">
            Number of prompts detected at each
            security level
          </p>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={threatBarData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />

              <Tooltip
                content={
                  <ThreatTooltip />
                }
              />

              <Bar
                dataKey="count"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              >

                {threatBarData.map(
                  (entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={
                        THREAT_COLORS[
                          entry.name
                        ]
                      }
                    />
                  )
                )}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================================================================
          ATTACK TYPE ANALYSIS
      ================================================================= */}

      <div className="bg-slate-900 rounded-3xl border border-orange-500/20 p-8">

        <div className="flex items-center gap-4 mb-2">

          <AlertTriangle
            size={34}
            className="text-orange-400"
          />

          <h2 className="text-2xl font-bold">
            Attack Type Analysis
          </h2>

        </div>

        <p className="text-slate-500 text-sm mb-8">
          Most frequently detected attack categories
        </p>

        {displayedAttackTypes.length > 0 ? (

          <div className="space-y-5">

            {displayedAttackTypes.map(
              (attack, index) => {

                const maxValue =
                  displayedAttackTypes[0]
                    ?.value || 1;

                const percentage =
                  Math.max(
                    5,
                    Math.round(
                      (
                        attack.value /
                        maxValue
                      ) * 100
                    )
                  );

                return (
                  <div
                    key={`${attack.name}-${index}`}
                    className="space-y-2"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-3 min-w-0">

                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              ATTACK_COLORS[
                                index %
                                  ATTACK_COLORS.length
                              ],
                          }}
                        />

                        <span className="text-slate-300 truncate">
                          {attack.name}
                        </span>

                      </div>

                      <span className="text-white font-bold flex-shrink-0">
                        {attack.value}
                      </span>

                    </div>

                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">

                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            ATTACK_COLORS[
                              index %
                                ATTACK_COLORS.length
                            ],
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="flex items-center justify-center h-72">

            <div className="text-center">

              <AlertTriangle
                size={42}
                className="text-slate-600 mx-auto mb-4"
              />

              <p className="text-slate-400">
                No attack-type data available yet.
              </p>

              <p className="text-slate-600 text-sm mt-2">
                Attack categories will appear after
                threat scans are recorded.
              </p>

            </div>

          </div>

        )}

      </div>

      {/* ================================================================
          SECURITY SUMMARY
      ================================================================= */}

      <div className="bg-slate-900 rounded-3xl border border-cyan-500/20 p-8">

        <div className="flex items-center gap-4 mb-6">

          <TrendingUp
            size={34}
            className="text-cyan-400"
          />

          <h2 className="text-2xl font-bold">
            Security Summary
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* HIGH-RISK FINDINGS */}

          <div className="bg-slate-950 rounded-2xl p-5 border border-red-500/10">

            <p className="text-slate-400">
              High-Risk Findings
            </p>

            <h3 className="text-3xl font-bold text-red-400 mt-3">
              {highRiskFindings}
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              HIGH + CRITICAL
            </p>

          </div>

          {/* AVERAGE RISK */}

          <div className="bg-slate-950 rounded-2xl p-5 border border-orange-500/10">

            <p className="text-slate-400">
              Average Risk Score
            </p>

            <h3 className="text-3xl font-bold text-orange-400 mt-3">
              {averageRiskScore}/100
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              Overall scan risk
            </p>

          </div>

          {/* TOTAL SCANS */}

          <div className="bg-slate-950 rounded-2xl p-5 border border-cyan-500/10">

            <p className="text-slate-400">
              Total Prompt Scans
            </p>

            <h3 className="text-3xl font-bold text-cyan-400 mt-3">
              {totalScans}
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              Analyzed prompts
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsChart;