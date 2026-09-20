import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Code2,
  KeyRound,
  Database,
  Terminal,
  LockKeyhole,
  FileWarning,
} from "lucide-react";

function TopAttackTypesCard({ history = [] }) {
  const attackCounts = {};

  history.forEach((scan) => {
    const attackType = scan?.attackType;

    if (
      !attackType ||
      attackType.toLowerCase() === "safe prompt" ||
      attackType.toLowerCase() === "safe"
    ) {
      return;
    }

    attackCounts[attackType] =
      (attackCounts[attackType] || 0) + 1;
  });

  const topAttacks = Object.entries(attackCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getIcon = (attackType) => {
    const type = attackType.toLowerCase();

    if (
      type.includes("injection") ||
      type.includes("jailbreak")
    ) {
      return ShieldAlert;
    }

    if (
      type.includes("system") ||
      type.includes("prompt leakage") ||
      type.includes("extraction")
    ) {
      return LockKeyhole;
    }

    if (
      type.includes("secret") ||
      type.includes("credential")
    ) {
      return KeyRound;
    }

    if (
      type.includes("database") ||
      type.includes("exfiltration")
    ) {
      return Database;
    }

    if (
      type.includes("code") ||
      type.includes("execution")
    ) {
      return Terminal;
    }

    if (
      type.includes("obfuscation") ||
      type.includes("encoding")
    ) {
      return Code2;
    }

    if (type.includes("role")) {
      return AlertTriangle;
    }

    return FileWarning;
  };

  const getIconStyle = (index) => {
    const styles = [
      {
        bg: "bg-red-50",
        text: "text-red-600",
      },
      {
        bg: "bg-orange-50",
        text: "text-orange-600",
      },
      {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
      },
      {
        bg: "bg-blue-50",
        text: "text-blue-600",
      },
      {
        bg: "bg-green-50",
        text: "text-green-600",
      },
    ];

    return styles[index] || styles[3];
  };

  const maxCount =
    topAttacks.length > 0
      ? topAttacks[0][1]
      : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* TOP ACCENT */}

      <div className="absolute left-0 top-0 h-1 w-full bg-blue-500" />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <ShieldAlert
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Top Attack Types
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Most frequently detected threats
            </p>
          </div>

        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Top 5
        </span>

      </div>

      {/* ATTACK LIST */}

      {topAttacks.length > 0 ? (
        <div className="mt-7 space-y-4">

          {topAttacks.map(
            ([attackType, count], index) => {
              const Icon = getIcon(attackType);
              const iconStyle =
                getIconStyle(index);

              const percentage =
                maxCount > 0
                  ? Math.round(
                      (count / maxCount) * 100
                    )
                  : 0;

              return (
                <div
                  key={attackType}
                  className="group rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                >

                  <div className="flex items-center gap-3">

                    {/* RANK */}

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-400 shadow-sm">
                      {index + 1}
                    </div>

                    {/* ICON */}

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle.bg}`}
                    >
                      <Icon
                        size={17}
                        className={iconStyle.text}
                      />
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-3">

                        <p className="truncate text-sm font-semibold text-slate-700">
                          {attackType}
                        </p>

                        <span className="shrink-0 text-sm font-black text-slate-900">
                          {count}
                        </span>

                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            index === 0
                              ? "bg-red-500"
                              : index === 1
                              ? "bg-orange-500"
                              : index === 2
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      ) : (
        <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <ShieldCheck
              size={24}
              className="text-green-600"
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            No attack types detected
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Attack statistics will appear after
            security findings are recorded.
          </p>

        </div>
      )}

      {/* FOOTER */}

      {topAttacks.length > 0 && (
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">

          <div className="h-2 w-2 rounded-full bg-red-500" />

          <p className="text-[11px] text-slate-500">
            Showing the most frequently detected
            attack categories.
          </p>

        </div>
      )}

    </div>
  );
}

export default TopAttackTypesCard;