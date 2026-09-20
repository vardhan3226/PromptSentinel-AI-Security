import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  Search,
  Brain,
  Lightbulb,
  Target,
  Download,
  Activity,
  Sparkles,
  ScanSearch,
  CheckCircle2,
} from "lucide-react";

import { generateSecurityReport } from "../utils/pdf/generateSecurityReport";

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

function ResultCard({ result }) {
  if (!result) return null;

  const getStatus = () => {
    switch (result.threatLevel) {
      case "SAFE":
        return {
          color: "text-emerald-600",
          softBg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: <ShieldCheck size={46} />,
          description:
            "No significant security threats were detected.",
        };

      case "LOW":
        return {
          color: "text-lime-600",
          softBg: "bg-lime-50",
          border: "border-lime-200",
          icon: <ShieldCheck size={46} />,
          description:
            "The prompt contains minor security indicators.",
        };

      case "MEDIUM":
        return {
          color: "text-amber-600",
          softBg: "bg-amber-50",
          border: "border-amber-200",
          icon: <AlertTriangle size={46} />,
          description:
            "The prompt contains suspicious security indicators.",
        };

      case "HIGH":
        return {
          color: "text-orange-600",
          softBg: "bg-orange-50",
          border: "border-orange-200",
          icon: <ShieldAlert size={46} />,
          description:
            "The prompt contains strong indicators of an AI security attack.",
        };

      case "CRITICAL":
        return {
          color: "text-red-600",
          softBg: "bg-red-50",
          border: "border-red-200",
          icon: <ShieldX size={46} />,
          description:
            "Critical security indicators were detected. Immediate blocking is recommended.",
        };

      default:
        return {
          color: "text-blue-600",
          softBg: "bg-blue-50",
          border: "border-blue-200",
          icon: <ShieldCheck size={46} />,
          description: "Security analysis completed.",
        };
    }
  };

  const status = getStatus();

  const riskScore = Number(result.riskScore || 0);
  const confidence = Number(result.confidence || 0);

  const attackTypes = result.attackType
    ? result.attackType
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const matchedPatterns = Array.isArray(result.matchedPatterns)
    ? [...new Set(result.matchedPatterns)]
    : [];

  const aiDetectedKeywords = Array.isArray(
    result.aiDetectedKeywords
  )
    ? [...new Set(result.aiDetectedKeywords)]
    : Array.isArray(result.matchedKeywords)
      ? [...new Set(result.matchedKeywords)]
      : [];

  const detectionReason =
    result.detectionReason ||
    "The security engine analyzed the prompt and identified the indicators shown above.";

  const recommendation =
    result.recommendation ||
    "Review the prompt carefully before allowing it to reach an AI model.";

  const aiRecommendation =
    result.aiRecommendation ||
    "Reject or sanitize the input before sending it to the AI model.";

  const scannedPrompt = maskSensitivePrompt(
    result.prompt || result.scannedPrompt || ""
  );

  const consistencyAnalysis =
    result.consistencyAnalysis || {};

  const consistencyScore = Number(
    consistencyAnalysis.consistencyScore || 0
  );

  const consistencyStatus =
    consistencyAnalysis.status || "REVIEW";

  const consistencySources = Array.isArray(
    consistencyAnalysis.sources
  )
    ? consistencyAnalysis.sources
    : [];

  const consistencySummary =
    consistencyAnalysis.summary ||
    "Consistency analysis completed. Manual review is recommended when detection sources disagree.";

  const consistencyColor =
    consistencyStatus === "CONSISTENT"
      ? "text-emerald-600"
      : consistencyStatus === "INCONSISTENT"
        ? "text-orange-600"
        : "text-amber-600";

  const consistencyBg =
    consistencyStatus === "CONSISTENT"
      ? "bg-emerald-50 border-emerald-200"
      : consistencyStatus === "INCONSISTENT"
        ? "bg-orange-50 border-orange-200"
        : "bg-amber-50 border-amber-200";

  const riskBarColor =
    riskScore >= 80
      ? "bg-red-500"
      : riskScore >= 50
        ? "bg-amber-400"
        : "bg-emerald-500";

  return (
    <section className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

      {/* =========================================================
          REPORT HEADER
      ========================================================== */}

      <div
        className={`border-b ${status.border} ${status.softBg} px-6 py-6 md:px-8`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${status.color}`}
            >
              {status.icon}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  AI Security Report
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  <Activity size={13} />
                  AI Analysis Active
                </span>

              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3">

                <span
                  className={`text-lg font-bold ${status.color}`}
                >
                  {result.threatLevel}
                </span>

                <span className="text-sm text-slate-500">
                  {status.description}
                </span>

              </div>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <CheckCircle2
              size={18}
              className="text-emerald-500"
            />

            <div>
              <p className="text-xs font-semibold text-slate-800">
                Analysis Complete
              </p>

              <p className="text-[11px] text-slate-500">
                Multi-layer security evaluation
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================
          KEY METRICS
      ========================================================== */}

      <div className="grid gap-4 border-b border-slate-200 bg-slate-50/70 p-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Attack Type */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Target
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Attack Type
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {result.attackType || "Safe Prompt"}
              </p>
            </div>

          </div>

          {attackTypes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {attackTypes.map((type, index) => (
                <span
                  key={`${type}-${index}`}
                  className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600"
                >
                  {type}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Risk Score */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <ShieldAlert
                  size={20}
                  className="text-orange-500"
                />
              </div>

              <p className="text-sm font-bold text-slate-800">
                Risk Score
              </p>

            </div>

            <span className="text-lg font-bold text-slate-900">
              {riskScore}/100
            </span>

          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${riskBarColor}`}
              style={{
                width: `${Math.min(
                  Math.max(riskScore, 0),
                  100
                )}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Critical</span>
          </div>

        </div>

        {/* Confidence */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                <Brain
                  size={20}
                  className="text-cyan-600"
                />
              </div>

              <p className="text-sm font-bold text-slate-800">
                Detection Confidence
              </p>

            </div>

            <span className="text-lg font-bold text-slate-900">
              {confidence}%
            </span>

          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.max(confidence, 0),
                  100
                )}%`,
              }}
            />
          </div>

          <p className="mt-2 text-[10px] text-slate-400">
            Confidence in the final classification
          </p>

        </div>

        {/* Detection Engine */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <Sparkles
                size={20}
                className="text-violet-600"
              />
            </div>

            <p className="text-sm font-bold text-slate-800">
              Detection Engine
            </p>

          </div>

          <div className="mt-4 space-y-2.5">

            {[
              "Local Security Engine",
              "Threat Classification",
              "AI Analysis",
            ].map((engine) => (
              <div
                key={engine}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-slate-500">
                  {engine}
                </span>

                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* =========================================================
          INDICATORS
      ========================================================== */}

      <div className="grid gap-4 border-b border-slate-200 p-5 md:grid-cols-2 md:p-6">

        {/* Matched Indicators */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <Search
                size={19}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Matched Security Indicators
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Patterns identified during analysis
              </p>
            </div>

          </div>

          {matchedPatterns.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {matchedPatterns.map((pattern, index) => (
                <span
                  key={`${pattern}-${index}`}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700"
                >
                  {pattern}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              No suspicious security indicators detected.
            </div>
          )}

        </div>

        {/* AI Keywords */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <Brain
                size={19}
                className="text-violet-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                AI-Detected Keywords
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Additional indicators identified by AI
              </p>
            </div>

          </div>

          {aiDetectedKeywords.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {aiDetectedKeywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              No additional AI-detected keywords.
            </div>
          )}

        </div>

      </div>

      {/* =========================================================
          DETECTION REASON
      ========================================================== */}

      <div className="border-b border-slate-200 p-5 md:p-6">

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <Brain
                size={19}
                className="text-amber-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Detection Reason
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {detectionReason}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          CONSISTENCY
      ========================================================== */}

      <div className="border-b border-slate-200 p-5 md:p-6">

        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50">
                <ShieldCheck
                  size={19}
                  className="text-cyan-600"
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Consistency & Manual Review
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Cross-check of local, semantic, and AI detection results
                </p>
              </div>

            </div>

            <span
              className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${consistencyBg} ${consistencyColor}`}
            >
              {consistencyStatus}
            </span>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-slate-200 bg-white p-4">

              <div className="flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  Consistency Score
                </span>

                <span className="text-lg font-bold text-slate-900">
                  {Math.min(
                    Math.max(consistencyScore, 0),
                    100
                  )}
                  %
                </span>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    consistencyScore >= 80
                      ? "bg-emerald-500"
                      : consistencyScore >= 50
                        ? "bg-amber-400"
                        : "bg-orange-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.max(consistencyScore, 0),
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">

              <p className="text-xs text-slate-500">
                Review Status
              </p>

              <p
                className={`mt-2 text-sm font-semibold ${consistencyColor}`}
              >
                {typeof consistencyAnalysis.consistent ===
                "boolean"
                  ? consistencyAnalysis.consistent
                    ? "Detection sources are consistent"
                    : "Manual review recommended"
                  : consistencyStatus === "CONSISTENT"
                    ? "Detection sources are consistent"
                    : "Manual review recommended"}
              </p>

            </div>

          </div>

          {consistencySources.length > 0 && (
            <div className="mt-4">

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Analysis Sources
              </p>

              <div className="flex flex-wrap gap-2">

                {consistencySources.map((source, index) => {

                  const sourceName =
                    typeof source === "string"
                      ? source
                      : source?.source ||
                        "Unknown Source";

                  const classification =
                    typeof source === "object"
                      ? source?.classification
                      : null;

                  return (
                    <span
                      key={`${sourceName}-${index}`}
                      className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700"
                    >
                      {sourceName}
                      {classification
                        ? ` — ${classification}`
                        : ""}
                    </span>
                  );
                })}

              </div>

            </div>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Review Summary
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {consistencySummary}
            </p>

          </div>

        </div>

      </div>

      {/* =========================================================
          RECOMMENDATIONS
      ========================================================== */}

      <div className="grid gap-4 border-b border-slate-200 p-5 md:grid-cols-2 md:p-6">

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <Lightbulb
                size={19}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Security Recommendation
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Final recommendation from PromptSentinel
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {recommendation}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Sparkles
                size={19}
                className="text-blue-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                AI Analysis Recommendation
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Additional recommendation from AI analysis
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {aiRecommendation}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          SCANNED PROMPT
      ========================================================== */}

      <div className="p-5 md:p-6">

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200">
              <ScanSearch
                size={19}
                className="text-slate-600"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Scanned Prompt
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Sensitive information is masked before display
              </p>
            </div>

          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">
              {scannedPrompt || "Prompt text unavailable."}
            </p>

          </div>

        </div>

        {/* DOWNLOAD */}

        <div className="mt-5 flex justify-end">

          <button
            onClick={() => generateSecurityReport(result)}
            className="
              flex
              items-center
              gap-2.5
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:bg-blue-700
              hover:-translate-y-0.5
              hover:shadow-lg
              hover:shadow-blue-600/20
            "
          >
            <Download size={18} />
            Download Security Report
          </button>

        </div>

      </div>

    </section>
  );
}

export default ResultCard;