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
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          icon: <ShieldCheck size={58} />,
          description: "No significant security threats were detected.",
        };

      case "LOW":
        return {
          color: "text-lime-400",
          bg: "bg-lime-500/10",
          border: "border-lime-500/30",
          icon: <ShieldCheck size={58} />,
          description: "The prompt contains minor security indicators.",
        };

      case "MEDIUM":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          icon: <AlertTriangle size={58} />,
          description: "The prompt contains suspicious security indicators.",
        };

      case "HIGH":
        return {
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          icon: <ShieldAlert size={58} />,
          description:
            "The prompt contains strong indicators of an AI security attack.",
        };

      case "CRITICAL":
        return {
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: <ShieldX size={58} />,
          description:
            "Critical security indicators were detected. Immediate blocking is recommended.",
        };

      default:
        return {
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/30",
          icon: <ShieldCheck size={58} />,
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

  const aiDetectedKeywords = Array.isArray(result.aiDetectedKeywords)
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

  const consistencyAnalysis = result.consistencyAnalysis || {};

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
      ? "text-green-400"
      : consistencyStatus === "INCONSISTENT"
        ? "text-orange-400"
        : "text-yellow-400";

  const consistencyBg =
    consistencyStatus === "CONSISTENT"
      ? "bg-green-500/10 border-green-500/20"
      : consistencyStatus === "INCONSISTENT"
        ? "bg-orange-500/10 border-orange-500/20"
        : "bg-yellow-500/10 border-yellow-500/20";

  return (
    <div
      className={`mt-8 rounded-3xl border p-6 md:p-8 shadow-2xl ${status.bg} ${status.border}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className={`${status.color} shrink-0`}>
            {status.icon}
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                AI Security Report
              </h2>

              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                <Activity
                  size={16}
                  className="text-green-400"
                />

                <span className="text-green-400 text-xs md:text-sm font-semibold">
                  AI Analysis Active
                </span>
              </div>
            </div>

            <p
              className={`text-2xl font-bold mt-2 ${status.color}`}
            >
              {result.threatLevel}
            </p>

            <p className="text-slate-400 mt-1">
              {status.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-cyan-400" size={24} />

            <h3 className="font-bold text-lg text-white">
              Attack Type
            </h3>
          </div>

          <p className="text-slate-300 leading-7">
            {result.attackType || "Safe Prompt"}
          </p>

          {attackTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {attackTypes.map((type, index) => (
                <span
                  key={`${type}-${index}`}
                  className="bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full text-xs font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShieldAlert
                className="text-orange-400"
                size={24}
              />

              <h3 className="font-bold text-lg text-white">
                Risk Score
              </h3>
            </div>

            <span className="text-xl font-bold text-white">
              {riskScore}/100
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${
                riskScore >= 80
                  ? "bg-red-500"
                  : riskScore >= 50
                    ? "bg-yellow-400"
                    : "bg-green-400"
              }`}
              style={{
                width: `${Math.min(Math.max(riskScore, 0), 100)}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 mt-3">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Critical</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain
                className="text-cyan-400"
                size={24}
              />

              <h3 className="font-bold text-lg text-white">
                Detection Confidence
              </h3>
            </div>

            <span className="text-xl font-bold text-white">
              {confidence}%
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-cyan-400 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(Math.max(confidence, 0), 100)}%`,
              }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Confidence in the final security classification.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles
              className="text-violet-400"
              size={24}
            />

            <h3 className="font-bold text-lg text-white">
              Detection Engine
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                Local Security Engine
              </span>

              <span className="text-green-400 font-semibold">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                Threat Classification
              </span>

              <span className="text-green-400 font-semibold">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                AI Analysis
              </span>

              <span className="text-green-400 font-semibold">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <Search
              className="text-green-400"
              size={24}
            />

            <div>
              <h3 className="font-bold text-lg text-white">
                Matched Security Indicators
              </h3>

              <p className="text-sm text-slate-500">
                Patterns and keywords identified during analysis
              </p>
            </div>
          </div>

          {matchedPatterns.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-5">
              {matchedPatterns.map((pattern, index) => (
                <span
                  key={`${pattern}-${index}`}
                  className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-2 rounded-full text-sm"
                >
                  {pattern}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 mt-4">
              No suspicious security indicators detected.
            </p>
          )}
        </div>

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <Brain
              className="text-violet-400"
              size={24}
            />

            <div>
              <h3 className="font-bold text-lg text-white">
                AI-Detected Keywords
              </h3>

              <p className="text-sm text-slate-500">
                Additional indicators identified by AI analysis
              </p>
            </div>
          </div>

          {aiDetectedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-5">
              {aiDetectedKeywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="bg-violet-500/10 border border-violet-500/20 text-violet-300 px-3 py-2 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 mt-4">
              No additional AI-detected keywords.
            </p>
          )}
        </div>

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <Brain
              className="text-yellow-400"
              size={24}
            />

            <h3 className="font-bold text-lg text-white">
              Detection Reason
            </h3>
          </div>

          <p className="leading-7 text-slate-300">
            {detectionReason}
          </p>
        </div>

        {/* CONSISTENCY & MANUAL REVIEW */}

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6 md:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <ShieldCheck
                className="text-cyan-400"
                size={24}
              />

              <div>
                <h3 className="font-bold text-lg text-white">
                  Consistency & Manual Review
                </h3>

                <p className="text-sm text-slate-500">
                  Cross-check of local, semantic, and AI detection results
                </p>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${consistencyBg} ${consistencyColor}`}
            >
              {consistencyStatus}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-slate-950/60 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400">
                  Consistency Score
                </span>

                <span className="text-xl font-bold text-white">
                  {Math.min(
                    Math.max(consistencyScore, 0),
                    100
                  )}
                  %
                </span>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    consistencyScore >= 80
                      ? "bg-green-400"
                      : consistencyScore >= 50
                        ? "bg-yellow-400"
                        : "bg-orange-400"
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

            <div className="bg-slate-950/60 border border-slate-700/50 rounded-xl p-5">
              <p className="text-slate-400 mb-2">
                Review Status
              </p>

              <p className={`font-semibold ${consistencyColor}`}>
                {typeof consistencyAnalysis.consistent === "boolean"
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
            <div className="mt-5">
              <p className="text-slate-400 mb-3">
                Analysis Sources
              </p>

              <div className="flex flex-wrap gap-2">
                {consistencySources.map((source, index) => {
                  const sourceName =
                    typeof source === "string"
                      ? source
                      : source?.source || "Unknown Source";

                  const classification =
                    typeof source === "object"
                      ? source?.classification
                      : null;

                  return (
                    <span
                      key={`${sourceName}-${index}`}
                      className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-2 rounded-full text-sm"
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

          <div className="mt-5 bg-slate-950/60 border border-slate-700/50 rounded-xl p-5">
            <p className="text-slate-400 mb-2">
              Review Summary
            </p>

            <p className="leading-7 text-slate-300">
              {consistencySummary}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb
              className="text-green-400"
              size={24}
            />

            <div>
              <h3 className="font-bold text-lg text-white">
                Security Recommendation
              </h3>

              <p className="text-sm text-slate-500">
                Final recommendation from PromptSentinel
              </p>
            </div>
          </div>

          <p className="leading-7 text-slate-300">
            {recommendation}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-cyan-500/10 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles
              className="text-cyan-400"
              size={24}
            />

            <div>
              <h3 className="font-bold text-lg text-white">
                AI Analysis Recommendation
              </h3>

              <p className="text-sm text-slate-500">
                Additional recommendation generated by AI analysis
              </p>
            </div>
          </div>

          <p className="leading-7 text-slate-300">
            {aiRecommendation}
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-700/50 rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <ScanSearch
              className="text-slate-300"
              size={24}
            />

            <div>
              <h3 className="font-bold text-lg text-white">
                Scanned Prompt
              </h3>

              <p className="text-sm text-slate-500">
                Sensitive information is masked before display
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-300 leading-7 whitespace-pre-wrap break-words">
              {scannedPrompt || "Prompt text unavailable."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => generateSecurityReport(result)}
          className="flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <Download size={22} />

          Download Security Report
        </button>
      </div>
    </div>
  );
}

export default ResultCard;