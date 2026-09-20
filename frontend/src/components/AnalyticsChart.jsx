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
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">

      <p className="text-sm font-bold text-slate-800">
        {item.payload.name}
      </p>

      <p className="mt-1 text-xs font-semibold text-blue-600">
        Prompts: {item.value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| ANALYTICS CHART
|--------------------------------------------------------------------------
*/

function AnalyticsChart({ stats }) {

  /*
  |--------------------------------------------------------------------------
  | SAFE VALUES
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
  | THREAT DISTRIBUTION
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
  | BAR DATA
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
    Medium: "#f59e0b",
    High: "#f97316",
    Critical: "#ef4444",
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

  const displayedAttackTypes =
    attackTypeData.slice(0, 8);

  /*
  |--------------------------------------------------------------------------
  | ATTACK COLORS
  |--------------------------------------------------------------------------
  */

  const ATTACK_COLORS = [
    "#2563eb",
    "#7c3aed",
    "#f97316",
    "#ef4444",
    "#eab308",
    "#ec4899",
    "#0f766e",
    "#4f46e5",
  ];

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* ================================================================
          KEY SECURITY METRICS
      ================================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* SAFE RATE */}

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="absolute left-0 top-0 h-1 w-full bg-green-500" />

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <ShieldCheck
                size={21}
                className="text-green-600"
              />
            </div>

            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-700">
              SAFE
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Safe Prompt Rate
          </p>

          <h2 className="mt-1 text-3xl font-black text-green-600">
            {safePromptRate}%
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            {safePrompts} of {totalScans} scans
          </p>

        </div>

        {/* HIGH RISK */}

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="absolute left-0 top-0 h-1 w-full bg-red-500" />

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <ShieldAlert
                size={21}
                className="text-red-600"
              />
            </div>

            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700">
              HIGH RISK
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            High Risk Rate
          </p>

          <h2 className="mt-1 text-3xl font-black text-red-600">
            {highRiskRate}%
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            HIGH + CRITICAL findings
          </p>

        </div>

        {/* AVERAGE RISK */}

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="absolute left-0 top-0 h-1 w-full bg-blue-500" />

          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Activity
                size={21}
                className="text-blue-600"
              />
            </div>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700">
              SCORE
            </span>

          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Average Risk Score
          </p>

          <h2 className="mt-1 text-3xl font-black text-blue-600">
            {averageRiskScore}
            <span className="ml-1 text-base font-semibold text-slate-400">
              /100
            </span>
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Across all prompt scans
          </p>

        </div>

      </div>

      {/* ================================================================
          THREAT LEVEL ANALYSIS
      ================================================================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* THREAT DISTRIBUTION */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <ShieldCheck
                    size={19}
                    className="text-blue-600"
                  />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Threat Distribution
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Distribution across security levels
                  </p>

                </div>

              </div>

            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {totalScans} Scans
            </span>

          </div>

          {pieData.length > 0 ? (

            <div className="mt-4">

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={105}
                    innerRadius={62}
                    paddingAngle={3}
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
                          stroke="#ffffff"
                          strokeWidth={2}
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
                    height={42}
                    formatter={(value) => (
                      <span className="text-xs font-medium text-slate-500">
                        {value}
                      </span>
                    )}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="flex h-72 items-center justify-center">

              <div className="text-center">

                <ShieldCheck
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No threat data available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Security classifications will appear
                  after scans are completed.
                </p>

              </div>

            </div>

          )}

        </div>

        {/* THREAT ANALYSIS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <TrendingUp
                    size={19}
                    className="text-orange-500"
                  />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Threat Analysis
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Prompts detected at each security level
                  </p>

                </div>

              </div>

            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
              LEVELS
            </span>

          </div>

          <div className="mt-4">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={threatBarData}
                margin={{
                  top: 15,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  axisLine={{
                    stroke: "#cbd5e1",
                  }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={
                    <ThreatTooltip />
                  }
                />

                <Bar
                  dataKey="count"
                  radius={[
                    7,
                    7,
                    0,
                    0,
                  ]}
                  maxBarSize={48}
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

      </div>

      {/* ================================================================
          ATTACK TYPE ANALYSIS
      ================================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <AlertTriangle
                size={20}
                className="text-orange-500"
              />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Attack Type Analysis
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Most frequently detected attack categories
              </p>

            </div>

          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            TOP {displayedAttackTypes.length}
          </span>

        </div>

        {displayedAttackTypes.length > 0 ? (

          <div className="mt-7 space-y-5">

            {displayedAttackTypes.map(
              (attack, index) => {

                const maxValue =
                  displayedAttackTypes[0]
                    ?.value || 1;

                const percentage =
                  Math.max(
                    5,
                    Math.round(
                      (attack.value /
                        maxValue) *
                        100
                    )
                  );

                return (
                  <div
                    key={`${attack.name}-${index}`}
                    className="group"
                  >

                    <div className="mb-2 flex items-center justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500">
                          {index + 1}
                        </div>

                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              ATTACK_COLORS[
                                index %
                                  ATTACK_COLORS.length
                              ],
                          }}
                        />

                        <span className="truncate text-sm font-semibold text-slate-700">
                          {attack.name}
                        </span>

                      </div>

                      <span className="shrink-0 text-sm font-black text-slate-900">
                        {attack.value}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

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

          <div className="flex h-56 items-center justify-center">

            <div className="text-center">

              <AlertTriangle
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No attack-type data available
              </p>

              <p className="mt-1 text-xs text-slate-400">
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <TrendingUp
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Security Summary
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Current overview of PromptSentinel activity
            </p>

          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* HIGH RISK */}

          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold text-slate-500">
                High-Risk Findings
              </p>

              <ShieldAlert
                size={18}
                className="text-red-500"
              />

            </div>

            <h3 className="mt-3 text-3xl font-black text-red-600">
              {highRiskFindings}
            </h3>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-red-400">
              HIGH + CRITICAL
            </p>

          </div>

          {/* AVERAGE RISK */}

          <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold text-slate-500">
                Average Risk Score
              </p>

              <Activity
                size={18}
                className="text-orange-500"
              />

            </div>

            <h3 className="mt-3 text-3xl font-black text-orange-600">
              {averageRiskScore}
              <span className="text-base font-semibold text-orange-400">
                /100
              </span>
            </h3>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-orange-400">
              OVERALL SCAN RISK
            </p>

          </div>

          {/* TOTAL SCANS */}

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold text-slate-500">
                Total Prompt Scans
              </p>

              <Activity
                size={18}
                className="text-blue-500"
              />

            </div>

            <h3 className="mt-3 text-3xl font-black text-blue-600">
              {totalScans}
            </h3>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
              ANALYZED PROMPTS
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsChart;