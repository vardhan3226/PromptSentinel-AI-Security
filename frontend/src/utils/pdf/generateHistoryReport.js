
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ==================================================
// MASK SENSITIVE INFORMATION
// ==================================================

function maskSensitivePrompt(prompt) {
  if (typeof prompt !== "string") {
    return "";
  }

  let masked = prompt;

  // Private keys
  masked = masked.replace(
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/gi,
    "[REDACTED_PRIVATE_KEY]"
  );

  // Database URLs
  masked = masked.replace(
    /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|mssql):\/\/[^\s"'<>]+/gi,
    "[REDACTED_DATABASE_URL]"
  );

  // API keys
  masked = masked.replace(
    /\b(?:api[_-]?key|apikey|api[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9_-]{16,}["']?/gi,
    "[REDACTED_API_KEY]"
  );

  // AWS access keys
  masked = masked.replace(
    /\bAKIA[0-9A-Z]{16}\b/gi,
    "[REDACTED_AWS_KEY]"
  );

  // JWT tokens
  masked = masked.replace(
    /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g,
    "[REDACTED_JWT]"
  );

  // Access tokens
  masked = masked.replace(
    /\b(?:access[_-]?token|auth[_-]?token|secret[_-]?token)\s*(?::|=|\bis\b)\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_TOKEN]"
  );

  // Passwords
  masked = masked.replace(
    /\b(?:password|passwd|pwd|passcode)\s*(?::|=|\bis\b)\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_PASSWORD]"
  );

  // Secrets
  masked = masked.replace(
    /\b(?:secret|client[_-]?secret|private[_-]?token)\s*[:=]\s*["']?[^\s"',;]+["']?/gi,
    "[REDACTED_SECRET]"
  );

  // Email addresses
  masked = masked.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[REDACTED_EMAIL]"
  );

  // IPv4 addresses
  masked = masked.replace(
    /\b(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}\b/g,
    "[REDACTED_IP]"
  );

  // Phone numbers
  masked = masked.replace(
    /(?<!\d)(?:\+?\d{1,3}[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{4}|\d{10})(?!\d)/g,
    "[REDACTED_PHONE]"
  );

  return masked;
}

// ==================================================
// SAFE VALUE HELPERS
// ==================================================

function safeText(value, fallback = "—") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const result = String(value).trim();

  return result || fallback;
}

function safeDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN");
}

// ==================================================
// GENERATE PDF REPORT
// ==================================================

export const generateHistoryReport = (user, history) => {
  const doc = new jsPDF();

  // Always use a valid user object.
  const safeUser =
    user && typeof user === "object"
      ? user
      : {};

  // Always use a valid history array.
  const safeHistory = Array.isArray(history)
    ? history.filter(
        (scan) => scan && typeof scan === "object"
      )
    : [];

  // ==================================================
  // HEADER
  // ==================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 153, 255);

  doc.text("PromptSentinel", 14, 20);

  doc.setFontSize(14);
  doc.setTextColor(80);

  doc.text("Prompt Scan History Report", 14, 30);

  doc.setDrawColor(0, 153, 255);
  doc.line(14, 35, 196, 35);

  // ==================================================
  // USER INFORMATION
  // ==================================================

  doc.setFontSize(15);
  doc.setTextColor(0);

  doc.text("User Information", 14, 48);

  doc.setFontSize(11);

  doc.text(
    `Name: ${safeText(safeUser.fullName, "Not available")}`,
    18,
    58
  );

  doc.text(
    `Email: ${safeText(safeUser.email, "Not available")}`,
    18,
    66
  );

  doc.text(
    `Role: ${safeText(safeUser.role, "USER")}`,
    18,
    74
  );

  doc.text(
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    18,
    82
  );

  // ==================================================
  // SCAN HISTORY TABLE
  // ==================================================

  const tableRows = safeHistory.map((scan) => {
    const riskScore = Number(scan.riskScore);
    const confidence = Number(scan.confidence);

    return [
      maskSensitivePrompt(scan.prompt) ||
        "Prompt unavailable",

      safeText(scan.threatLevel),

      safeText(scan.attackType),

      Number.isFinite(riskScore)
        ? `${riskScore}/100`
        : "—",

      Number.isFinite(confidence)
        ? `${confidence}%`
        : "—",

      safeDate(scan.createdAt),
    ];
  });

  autoTable(doc, {
    startY: 92,

    head: [
      [
        "Prompt",
        "Threat",
        "Attack Type",
        "Risk",
        "Confidence",
        "Date",
      ],
    ],

    body: tableRows,

    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [0, 153, 255],
      textColor: 255,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },

    margin: {
      left: 14,
      right: 14,
    },
  });

  // ==================================================
  // FOOTER
  // ==================================================

  const endY =
    (doc.lastAutoTable?.finalY || 92) + 15;

  doc.setFontSize(9);
  doc.setTextColor(120);

  doc.text(
    "Sensitive prompt information is masked before report generation.",
    14,
    endY
  );

  doc.text(
    "Generated by PromptSentinel AI Prompt Security Platform",
    14,
    endY + 7
  );

  // ==================================================
  // DOWNLOAD PDF
  // ==================================================

  doc.save("PromptSentinel_History_Report.pdf");
};