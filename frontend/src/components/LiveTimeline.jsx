import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
} from "lucide-react";

function LiveTimeline({ history = [] }) {
  const recentScans = [...history]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 8);

  const getThreatStyle = (level) => {
    switch (level) {
      case "SAFE":
        return {
          icon: ShieldCheck,
          bg: "bg-green-50",
          text: "text-green-600",
          badge: "bg-green-50 text-green-700",
          line: "bg-green-200",
        };

      case "LOW":
        return {
          icon: ShieldCheck,
          bg: "bg-blue-50",
          text: "text-blue-600",
          badge: "bg-blue-50 text-blue-700",
          line: "bg-blue-200",
        };

      case "MEDIUM":
        return {
          icon: AlertTriangle,
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          badge: "bg-yellow-50 text-yellow-700",
          line: "bg-yellow-200",
        };

      case "HIGH":
        return {
          icon: ShieldAlert,
          bg: "bg-orange-50",
          text: "text-orange-600",
          badge: "bg-orange-50 text-orange-700",
          line: "bg-orange-200",
        };

      case "CRITICAL":
        return {
          icon: ShieldAlert,
          bg: "bg-red-50",
          text: "text-red-600",
          badge: "bg-red-50 text-red-700",
          line: "bg-red-200",
        };

      default:
        return {
          icon: Activity,
          bg: "bg-slate-50",
          text: "text-slate-500",
          badge: "bg-slate-100 text-slate-600",
          line: "bg-slate-200",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown time";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown time";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* TOP ACCENT */}

      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-green-500 to-orange-500" />

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
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest security scan activity
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
            Live
          </span>

        </div>

      </div>

      {/* TIMELINE */}

      {recentScans.length > 0 ? (
        <div className="mt-7">

          {recentScans.map((scan, index) => {
            const threatLevel =
              scan?.threatLevel || "UNKNOWN";

            const style =
              getThreatStyle(threatLevel);

            const Icon = style.icon;

            const isLast =
              index === recentScans.length - 1;

            return (
              <div
                key={
                  scan?.id ||
                  `${scan?.createdAt}-${index}`
                }
                className="relative flex gap-4"
              >

                {/* TIMELINE LINE */}

                {!isLast && (
                  <div
                    className={`absolute left-[17px] top-10 h-[calc(100%-4px)] w-px ${style.line}`}
                  />
                )}

                {/* ICON */}

                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.bg}`}
                >
                  <Icon
                    size={17}
                    className={style.text}
                  />
                </div>

                {/* CONTENT */}

                <div className="mb-5 min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm">

                  <div className="flex flex-wrap items-start justify-between gap-2">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider ${style.badge}`}
                        >
                          {threatLevel}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {formatDate(
                            scan?.createdAt
                          )}
                        </span>

                      </div>

                      <p className="mt-2 truncate text-sm font-semibold text-slate-700">
                        {scan?.attackType ||
                          "Safe Prompt"}
                      </p>

                    </div>

                    <div className="shrink-0 text-right">

                      <p className="text-lg font-black text-slate-900">
                        {scan?.riskScore ?? 0}
                      </p>

                      <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                        Risk
                      </p>

                    </div>

                  </div>

                  {/* PROMPT */}

                  <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2">

                    <p className="truncate text-xs text-slate-500">
                      {scan?.prompt ||
                        "No prompt available"}
                    </p>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      ) : (
        /* EMPTY STATE */

        <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <Activity
              size={24}
              className="text-blue-600"
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            No recent activity
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your latest security scans will appear
            here.
          </p>

        </div>
      )}

    </div>
  );
}

export default LiveTimeline;