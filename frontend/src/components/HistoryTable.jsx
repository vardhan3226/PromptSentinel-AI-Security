import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  History,
  Search,
  Clock3,
  Activity,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| MASK SENSITIVE INFORMATION
|--------------------------------------------------------------------------
*/

function maskSensitivePrompt(prompt) {
  if (typeof prompt !== "string") {
    return "";
  }

  let masked = prompt;

  masked = masked.replace(
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/gi,
    "[REDACTED_PRIVATE_KEY]"
  );

  masked = masked.replace(
    /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|mssql):\/\/[^\s"'<>]+/gi,
    "[REDACTED_DATABASE_URL]"
  );

  masked = masked.replace(
    /\b(?:api[_-]?key|apikey|api[_-]?token)\s*[:=]\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_API_KEY]"
  );

  masked = masked.replace(
    /\bAKIA[0-9A-Z]{16}\b/gi,
    "[REDACTED_AWS_KEY]"
  );

  masked = masked.replace(
    /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    "[REDACTED_JWT]"
  );

  masked = masked.replace(
    /\b(?:access[_-]?token|access\s+token|auth[_-]?token|auth\s+token|secret[_-]?token|secret\s+token)\s*(?:[:=]|\bis\b)\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_TOKEN]"
  );

  masked = masked.replace(
    /\b(?:password|passwd|pwd|passcode)\s*(?:[:=]|\bis\b)\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_PASSWORD]"
  );

  masked = masked.replace(
    /\b(?:secret|client[_-]?secret|private[_-]?token)\s*(?:[:=]|\bis\b)\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_SECRET]"
  );

  masked = masked.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[REDACTED_EMAIL]"
  );

  masked = masked.replace(
    /\b(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}\b/g,
    "[REDACTED_IP]"
  );

  masked = masked.replace(
    /(?<!\d)(?:\+?\d{1,3}[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{4}|\d{10})(?!\d)/g,
    "[REDACTED_PHONE]"
  );

  return masked;
}

/*
|--------------------------------------------------------------------------
| HISTORY TABLE
|--------------------------------------------------------------------------
*/

function HistoryTable({ history = [] }) {
  /*
  |--------------------------------------------------------------------------
  | THREAT STYLING
  |--------------------------------------------------------------------------
  */

  const getThreatStyle = (level) => {
    switch (level) {
      case "SAFE":
        return {
          badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
          icon: "text-emerald-600",
          iconBg: "bg-emerald-100",
          label: "Safe",
        };

      case "LOW":
        return {
          badge: "border-lime-200 bg-lime-50 text-lime-700",
          icon: "text-lime-600",
          iconBg: "bg-lime-100",
          label: "Low",
        };

      case "MEDIUM":
        return {
          badge: "border-yellow-200 bg-yellow-50 text-yellow-700",
          icon: "text-yellow-600",
          iconBg: "bg-yellow-100",
          label: "Medium",
        };

      case "HIGH":
        return {
          badge: "border-orange-200 bg-orange-50 text-orange-700",
          icon: "text-orange-600",
          iconBg: "bg-orange-100",
          label: "High",
        };

      case "CRITICAL":
        return {
          badge: "border-red-200 bg-red-50 text-red-700",
          icon: "text-red-600",
          iconBg: "bg-red-100",
          label: "Critical",
        };

      default:
        return {
          badge: "border-slate-200 bg-slate-50 text-slate-600",
          icon: "text-slate-500",
          iconBg: "bg-slate-100",
          label: level || "Unknown",
        };
    }
  };

  /*
  |--------------------------------------------------------------------------
  | THREAT ICON
  |--------------------------------------------------------------------------
  */

  const getThreatIcon = (level) => {
    switch (level) {
      case "SAFE":
      case "LOW":
        return <ShieldCheck size={15} />;

      case "MEDIUM":
        return <AlertTriangle size={15} />;

      case "HIGH":
        return <ShieldAlert size={15} />;

      case "CRITICAL":
        return <ShieldX size={15} />;

      default:
        return <ShieldCheck size={15} />;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RISK STYLE
  |--------------------------------------------------------------------------
  */

  const getRiskStyle = (risk) => {
    const value = Number(risk || 0);

    if (value >= 80) {
      return {
        text: "text-red-600",
        bar: "bg-red-500",
      };
    }

    if (value >= 50) {
      return {
        text: "text-yellow-600",
        bar: "bg-yellow-500",
      };
    }

    return {
      text: "text-emerald-600",
      bar: "bg-emerald-500",
    };
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) {
      return "Unknown";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleString();
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
            <History
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Prompt Scan Records
              </h2>

              <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400 sm:inline-flex">
                History
              </span>

            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              Review your completed AI security scans.
            </p>
          </div>

        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
            <span className="relative h-2 w-2 rounded-full bg-blue-500" />
          </span>

          <span className="text-xs font-semibold text-blue-700">
            {history.length}{" "}
            {history.length === 1 ? "Record" : "Records"}
          </span>

        </div>

      </div>

      {/* =========================================================
          EMPTY STATE
      ========================================================== */}

      {history.length === 0 ? (

        <div className="relative flex min-h-85 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-green-50 blur-3xl" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

            <Search
              size={27}
              className="text-slate-400"
            />

          </div>

          <h3 className="relative mt-5 text-base font-bold text-slate-800">
            No Scan History Found
          </h3>

          <p className="relative mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Your completed prompt security scans will appear
            here after you run your first scan.
          </p>

        </div>

      ) : (

        <>
          {/* =====================================================
              DESKTOP TABLE
          ====================================================== */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_25px_rgba(15,23,42,0.04)] lg:block">

            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">

              <div className="flex items-center gap-2">

                <Activity
                  size={14}
                  className="text-blue-500"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Security Activity
                </span>

              </div>

              <span className="text-[10px] text-slate-400">
                Sensitive information is masked
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-250">

                {/* TABLE HEAD */}

                <thead>

                  <tr className="border-b border-slate-200 bg-white">

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Prompt
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Threat
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Attack Type
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Risk
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Confidence
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Scanned
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody className="divide-y divide-slate-100">

                  {history.map((scan) => {

                    const threatStyle =
                      getThreatStyle(scan.threatLevel);

                    const riskStyle =
                      getRiskStyle(scan.riskScore);

                    const risk = Math.min(
                      Math.max(
                        Number(scan.riskScore || 0),
                        0
                      ),
                      100
                    );

                    const confidence = Math.min(
                      Math.max(
                        Number(scan.confidence || 0),
                        0
                      ),
                      100
                    );

                    return (

                      <tr
                        key={scan.id}
                        className="group transition-colors duration-200 hover:bg-slate-50/70"
                      >

                        {/* PROMPT */}

                        <td className="max-w-85 px-5 py-5">

                          <div className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                              <Search
                                size={14}
                                className="text-slate-400"
                              />

                            </div>

                            <div className="min-w-0">

                              <div
                                className="truncate text-sm font-medium text-slate-800"
                                title={maskSensitivePrompt(
                                  scan.prompt
                                )}
                              >
                                {maskSensitivePrompt(
                                  scan.prompt
                                ) || "Prompt unavailable"}
                              </div>

                              <p className="mt-1 text-[9px] text-slate-400">
                                Security scan
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* THREAT */}

                        <td className="px-4 py-5">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              ${threatStyle.badge}
                            `}
                          >

                            <span
                              className={`
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                ${threatStyle.iconBg}
                                ${threatStyle.icon}
                              `}
                            >
                              {getThreatIcon(
                                scan.threatLevel
                              )}
                            </span>

                            {threatStyle.label}

                          </span>

                        </td>

                        {/* ATTACK TYPE */}

                        <td className="px-4 py-5">

                          <span
                            className="
                              inline-block
                              max-w-52.5
                              truncate
                              rounded-lg
                              border
                              border-slate-200
                              bg-slate-50
                              px-2.5
                              py-1.5
                              text-xs
                              font-medium
                              text-slate-600
                            "
                            title={
                              scan.attackType ||
                              "Safe Prompt"
                            }
                          >
                            {scan.attackType ||
                              "Safe Prompt"}
                          </span>

                        </td>

                        {/* RISK */}

                        <td className="px-4 py-5">

                          <div className="w-24">

                            <div className="flex items-center justify-between">

                              <span
                                className={`
                                  text-sm
                                  font-bold
                                  ${riskStyle.text}
                                `}
                              >
                                {risk}/100
                              </span>

                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                              <div
                                className={`h-full rounded-full ${riskStyle.bar}`}
                                style={{
                                  width: `${risk}%`,
                                }}
                              />

                            </div>

                          </div>

                        </td>

                        {/* CONFIDENCE */}

                        <td className="px-4 py-5">

                          <div className="w-28">

                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">

                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{
                                  width: `${confidence}%`,
                                }}
                              />

                            </div>

                            <div className="mt-1.5 flex items-center justify-between">

                              <span className="text-[9px] text-slate-400">
                                Confidence
                              </span>

                              <span className="text-xs font-bold text-slate-600">
                                {confidence}%
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <Clock3
                              size={13}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="whitespace-nowrap text-xs text-slate-500">
                              {formatDate(
                                scan.createdAt
                              )}
                            </span>

                          </div>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

          {/* =====================================================
              MOBILE / TABLET CARDS
          ====================================================== */}

          <div className="space-y-3 lg:hidden">

            {history.map((scan) => {

              const threatStyle =
                getThreatStyle(scan.threatLevel);

              const riskStyle =
                getRiskStyle(scan.riskScore);

              const risk = Math.min(
                Math.max(
                  Number(scan.riskScore || 0),
                  0
                ),
                100
              );

              const confidence = Math.min(
                Math.max(
                  Number(scan.confidence || 0),
                  0
                ),
                100
              );

              return (

                <div
                  key={scan.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* CARD TOP */}

                  <div className="border-b border-slate-100 p-4">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                          <Search
                            size={15}
                            className="text-blue-500"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {maskSensitivePrompt(
                              scan.prompt
                            ) || "Prompt unavailable"}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">

                            <Clock3 size={10} />

                            {formatDate(
                              scan.createdAt
                            )}

                          </p>

                        </div>

                      </div>

                      <span
                        className={`
                          inline-flex
                          shrink-0
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-[10px]
                          font-semibold
                          ${threatStyle.badge}
                        `}
                      >
                        {getThreatIcon(
                          scan.threatLevel
                        )}

                        {threatStyle.label}
                      </span>

                    </div>

                  </div>

                  {/* CARD DETAILS */}

                  <div className="grid grid-cols-2 gap-3 p-4">

                    <div className="rounded-xl bg-slate-50 p-3">

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Attack Type
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                        {scan.attackType ||
                          "Safe Prompt"}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Risk Score
                      </p>

                      <p
                        className={`
                          mt-1 text-sm font-bold
                          ${riskStyle.text}
                        `}
                      >
                        {risk}/100
                      </p>

                    </div>

                  </div>

                  {/* RISK */}

                  <div className="px-4 pb-2">

                    <div className="mb-1.5 flex items-center justify-between">

                      <span className="text-[10px] text-slate-400">
                        Risk level
                      </span>

                      <span
                        className={`
                          text-[10px] font-bold
                          ${riskStyle.text}
                        `}
                      >
                        {risk}%
                      </span>

                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className={`h-full rounded-full ${riskStyle.bar}`}
                        style={{
                          width: `${risk}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* CONFIDENCE */}

                  <div className="p-4 pt-3">

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-slate-500">
                        Detection Confidence
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {confidence}%
                      </span>

                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${confidence}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              );
            })}

          </div>
        </>
      )}

    </div>
  );
}

export default HistoryTable;