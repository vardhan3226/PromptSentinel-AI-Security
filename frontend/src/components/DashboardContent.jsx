import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  ScanSearch,
} from "lucide-react";

function DashboardContent({
  stats = {},
  recentScans = [],
  user = {},
}) {
  const totalScans = Number(
    stats.totalScans || 0
  );

  const safePrompts = Number(
    stats.safePrompts || 0
  );

  const lowRiskPrompts = Number(
    stats.lowRiskPrompts || 0
  );

  const mediumRiskPrompts = Number(
    stats.mediumRiskPrompts || 0
  );

  const highRiskPrompts = Number(
    stats.highRiskPrompts || 0
  );

  const criticalRiskPrompts = Number(
    stats.criticalRiskPrompts || 0
  );

  const highRiskFindings = Number(
    stats.highRiskFindings ??
      highRiskPrompts +
        criticalRiskPrompts
  );

  const averageRiskScore = Number(
    stats.averageRiskScore || 0
  );

  const safeRate =
    totalScans > 0
      ? Math.round(
          (safePrompts /
            totalScans) *
            100
        )
      : 0;

  const highRiskRate =
    totalScans > 0
      ? Math.round(
          (highRiskFindings /
            totalScans) *
            100
        )
      : 0;

  const threatDistribution =
    stats.threatDistribution || {};

  const safe = Number(
    threatDistribution.SAFE ??
      threatDistribution.safe ??
      safePrompts
  );

  const low = Number(
    threatDistribution.LOW ??
      threatDistribution.low ??
      lowRiskPrompts
  );

  const medium = Number(
    threatDistribution.MEDIUM ??
      threatDistribution.medium ??
      mediumRiskPrompts
  );

  const high = Number(
    threatDistribution.HIGH ??
      threatDistribution.high ??
      highRiskPrompts
  );

  const critical = Number(
    threatDistribution.CRITICAL ??
      threatDistribution.critical ??
      criticalRiskPrompts
  );

  const displayName =
    user?.fullName ||
    user?.name ||
    "User";

  const getThreatStyle = (
    level
  ) => {
    switch (
      String(level).toUpperCase()
    ) {
      case "CRITICAL":
        return {
          badge:
            "border-red-100 bg-red-50 text-red-600",
          icon:
            "border-red-100 bg-red-50 text-red-600",
        };

      case "HIGH":
        return {
          badge:
            "border-orange-100 bg-orange-50 text-orange-600",
          icon:
            "border-orange-100 bg-orange-50 text-orange-600",
        };

      case "MEDIUM":
        return {
          badge:
            "border-yellow-100 bg-yellow-50 text-yellow-700",
          icon:
            "border-yellow-100 bg-yellow-50 text-yellow-700",
        };

      case "LOW":
        return {
          badge:
            "border-lime-100 bg-lime-50 text-lime-700",
          icon:
            "border-lime-100 bg-lime-50 text-lime-700",
        };

      default:
        return {
          badge:
            "border-emerald-100 bg-emerald-50 text-emerald-600",
          icon:
            "border-emerald-100 bg-emerald-50 text-emerald-600",
        };
    }
  };

  const scans = Array.isArray(
    recentScans
  )
    ? recentScans
    : [];

  return (
    <main className="min-h-screen w-full bg-[#f6f9fc] text-slate-900">
      <div className="w-full px-5 py-5 md:px-7 lg:px-8">

        {/* HEADER */}
        <section className="relative mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-[32%] overflow-hidden opacity-60">
            <div className="absolute -right-10 top-8 h-14 w-90 rotate-[-7deg] rounded-full border-8 border-orange-200" />

            <div className="absolute -right-8 top-17 h-14 w-90 rotate-[-7deg] rounded-full border-8 border-emerald-200" />
          </div>

          <div className="relative z-10 px-6 py-6 md:px-8">
            <p className="text-sm font-medium text-slate-500">
              Here's your AI security overview.
            </p>

            <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#102a63] md:text-4xl">
              Good Evening, {displayName}! 👋
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Stay secure. Build safer AI systems.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-1.5 w-9 rounded-full bg-orange-500" />
              <span className="h-1.5 w-9 rounded-full bg-slate-200" />
              <span className="h-1.5 w-9 rounded-full bg-green-600" />
            </div>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* TOTAL */}
          <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Scans
                </p>

                <p className="mt-1 text-4xl font-extrabold text-blue-600">
                  {totalScans}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All security scans
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                <ScanSearch
                  size={22}
                  className="text-blue-600"
                />
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-blue-50">
              <div className="h-full w-full rounded-full bg-blue-500" />
            </div>
          </div>

          {/* SAFE */}
          <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Safe Prompts
                </p>

                <p className="mt-1 text-4xl font-extrabold text-emerald-600">
                  {safePrompts}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {safeRate}% of total
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                <ShieldCheck
                  size={22}
                  className="text-emerald-600"
                />
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-emerald-50">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${Math.min(
                    safeRate,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* HIGH RISK */}
          <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  High-Risk Findings
                </p>

                <p className="mt-1 text-4xl font-extrabold text-red-600">
                  {highRiskFindings}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {highRiskRate}% of total
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50">
                <AlertTriangle
                  size={22}
                  className="text-red-600"
                />
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-red-50">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${Math.min(
                    highRiskRate,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* AVERAGE */}
          <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Average Risk
                </p>

                <p className="mt-1 text-4xl font-extrabold text-violet-600">
                  {averageRiskScore}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Risk score / 100
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50">
                <BarChart3
                  size={22}
                  className="text-violet-600"
                />
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-violet-50">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{
                  width: `${Math.min(
                    averageRiskScore,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* THREAT DISTRIBUTION */}
        <section className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#102a63]">
                Threat Distribution
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Current security classification
              </p>
            </div>

            <Activity
              size={20}
              className="text-blue-600"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">
                Safe
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                {safe}
              </p>
            </div>

            <div className="rounded-xl border border-lime-100 bg-lime-50/70 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-lime-700">
                Low
              </p>
              <p className="mt-1 text-2xl font-extrabold text-lime-700">
                {low}
              </p>
            </div>

            <div className="rounded-xl border border-yellow-100 bg-yellow-50/70 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-yellow-700">
                Medium
              </p>
              <p className="mt-1 text-2xl font-extrabold text-yellow-700">
                {medium}
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-orange-600">
                High
              </p>
              <p className="mt-1 text-2xl font-extrabold text-orange-700">
                {high}
              </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/70 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-red-600">
                Critical
              </p>
              <p className="mt-1 text-2xl font-extrabold text-red-700">
                {critical}
              </p>
            </div>

          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#102a63]">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Latest security scans
              </p>
            </div>

            <CheckCircle2
              size={20}
              className="text-blue-600"
            />
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {scans.length > 0 ? (
              scans
                .slice(0, 4)
                .map((scan, index) => {
                  const threat =
                    String(
                      scan?.threatLevel ||
                        scan?.threat ||
                        "SAFE"
                    ).toUpperCase();

                  const styles =
                    getThreatStyle(
                      threat
                    );

                  const rawPrompt =
                    scan?.prompt ||
                    scan?.scannedPrompt ||
                    "Security scan";

                  const prompt =
                    String(rawPrompt);

                  const shortPrompt =
                    prompt.length > 58
                      ? `${prompt.slice(
                          0,
                          58
                        )}...`
                      : prompt;

                  const dateValue =
                    scan?.createdAt ||
                    scan?.date ||
                    scan?.scannedAt;

                  let formattedDate = "";

                  if (dateValue) {
                    const date =
                      new Date(
                        dateValue
                      );

                    if (
                      !Number.isNaN(
                        date.getTime()
                      )
                    ) {
                      formattedDate =
                        date.toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        );
                    }
                  }

                  return (
                    <div
                      key={
                        scan?.id ||
                        `${prompt}-${index}`
                      }
                      className="flex items-center gap-3 py-3"
                    >
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          ${styles.icon}
                        `}
                      >
                        {threat ===
                        "SAFE" ? (
                          <ShieldCheck
                            size={17}
                          />
                        ) : (
                          <AlertTriangle
                            size={17}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {shortPrompt}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Security scan
                          {formattedDate
                            ? ` • ${formattedDate}`
                            : ""}
                        </p>
                      </div>

                      <span
                        className={`
                          shrink-0
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wide
                          ${styles.badge}
                        `}
                      >
                        {threat}
                      </span>
                    </div>
                  );
                })
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <ShieldCheck
                    size={23}
                    className="text-blue-600"
                  />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No recent scans
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Run a prompt scan to see activity here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-3 py-5">
          <div className="flex overflow-hidden rounded-full">
            <span className="h-1.5 w-5 bg-orange-500" />
            <span className="h-1.5 w-5 bg-slate-200" />
            <span className="h-1.5 w-5 bg-green-600" />
          </div>

          <span className="text-xs font-semibold text-slate-400">
            PromptSentinel · Made in India
          </span>
        </div>
      </div>
    </main>
  );
}

export default DashboardContent;