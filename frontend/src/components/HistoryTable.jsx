import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
} from "lucide-react";

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
    /\b(?:access[_-]?token|auth[_-]?token|secret[_-]?token)\s*(?::|=|\bis\b)\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_TOKEN]"
  );

  masked = masked.replace(
    /\b(?:password|passwd|pwd|passcode)\s*(?::|=|\bis\b)\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_PASSWORD]"
  );

  masked = masked.replace(
    /\b(?:secret|client[_-]?secret|private[_-]?token)\s*[:=]\s*["']?[^\s"',;]+["']?/gi,
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

function HistoryTable({ history = [] }) {
  const getBadge = (level) => {
    switch (level) {
      case "SAFE":
        return "bg-green-500/20 text-green-400";

      case "LOW":
        return "bg-lime-500/20 text-lime-400";

      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400";

      case "HIGH":
        return "bg-orange-500/20 text-orange-400";

      case "CRITICAL":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-cyan-500/20 text-cyan-400";
    }
  };

  const getIcon = (level) => {
    switch (level) {
      case "SAFE":
      case "LOW":
        return <ShieldCheck size={18} />;

      case "MEDIUM":
        return <AlertTriangle size={18} />;

      case "HIGH":
        return <ShieldAlert size={18} />;

      case "CRITICAL":
        return <ShieldX size={18} />;

      default:
        return <ShieldCheck size={18} />;
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 80) return "text-red-400";
    if (risk >= 50) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">
            Prompt Scan Records
          </h2>

          <p className="text-slate-400 mt-2">
            Complete security scan history
          </p>
        </div>

        <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full font-semibold">
          {history.length} Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-slate-300">
              <th className="text-left py-4 px-4">
                Prompt
              </th>

              <th className="text-left py-4 px-4">
                Threat
              </th>

              <th className="text-left py-4 px-4">
                Attack
              </th>

              <th className="text-left py-4 px-4">
                Risk
              </th>

              <th className="text-left py-4 px-4">
                Confidence
              </th>

              <th className="text-left py-4 px-4">
                Scanned
              </th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-16 text-slate-500"
                >
                  No Scan History Found
                </td>
              </tr>
            ) : (
              history.map((scan) => (
                <tr
                  key={scan.id}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition duration-300"
                >
                  <td className="px-4 py-5">
                    <div className="max-w-sm truncate font-medium">
                      {maskSensitivePrompt(scan.prompt) ||
                        "Prompt unavailable"}
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getBadge(
                        scan.threatLevel
                      )}`}
                    >
                      {getIcon(scan.threatLevel)}
                      {scan.threatLevel}
                    </span>
                  </td>

                  <td className="px-4 py-5 font-medium">
                    {scan.attackType}
                  </td>

                  <td
                    className={`px-4 py-5 font-bold ${getRiskColor(
                      scan.riskScore
                    )}`}
                  >
                    {scan.riskScore}/100
                  </td>

                  <td className="px-4 py-5">
                    <div className="w-28">
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-400 h-2 rounded-full"
                          style={{
                            width: `${scan.confidence}%`,
                          }}
                        />
                      </div>

                      <p className="text-sm mt-2">
                        {scan.confidence}%
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-slate-400">
                    {new Date(
                      scan.createdAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;