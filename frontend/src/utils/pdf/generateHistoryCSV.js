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
    /\b(?:api[_-]?key|apikey|api[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}["']?/gi,
    "[REDACTED_API_KEY]"
  );

  masked = masked.replace(
    /\bAKIA[0-9A-Z]{16}\b/gi,
    "[REDACTED_AWS_KEY]"
  );

  masked = masked.replace(
    /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g,
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

function escapeCSV(value) {
  const text = String(value ?? "");

  return `"${text.replace(/"/g, '""')}"`;
}

export const generateHistoryCSV = (history = []) => {
  const headers = [
    "Prompt",
    "Threat",
    "Attack Type",
    "Risk",
    "Confidence",
    "Date",
  ];

  const rows = history.map((scan) => [
    maskSensitivePrompt(scan.prompt) || "Prompt unavailable",
    scan.threatLevel,
    scan.attackType,
    `${scan.riskScore}/100`,
    `${scan.confidence}%`,
    new Date(scan.createdAt).toLocaleDateString(),
  ]);

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      row.map(escapeCSV).join(",")
    ),
  ].join("\n");

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "PromptSentinel_History_Report.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};