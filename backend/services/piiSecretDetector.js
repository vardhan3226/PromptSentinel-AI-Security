function normalizeInput(prompt) {
  if (typeof prompt !== "string") {
    return "";
  }

  return prompt;
}

function addFinding(findings, type, category) {
  const exists = findings.some(
    (finding) =>
      finding.type === type &&
      finding.category === category
  );

  if (!exists) {
    findings.push({
      type,
      category,
    });
  }
}

function detectPII(prompt, findings) {
  let detected = false;

  const emailPattern =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

  if (emailPattern.test(prompt)) {
    addFinding(findings, "EMAIL", "PII");
    detected = true;
  }

  const phonePattern =
    /(?<!\d)(?:\+?\d{1,3}[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{4}|\d{10})(?!\d)/g;

  if (phonePattern.test(prompt)) {
    addFinding(findings, "PHONE_NUMBER", "PII");
    detected = true;
  }

  const ipPattern =
    /\b(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}\b/g;

  if (ipPattern.test(prompt)) {
    addFinding(findings, "IP_ADDRESS", "PII");
    detected = true;
  }

  const cardPattern =
    /\b(?:\d[ -]*?){13,19}\b/g;

  const possibleCards = prompt.match(cardPattern);

  if (possibleCards) {
    for (const value of possibleCards) {
      const digitsOnly = value.replace(/\D/g, "");

      if (
        digitsOnly.length >= 13 &&
        digitsOnly.length <= 19
      ) {
        addFinding(
          findings,
          "CREDIT_CARD_NUMBER",
          "PII"
        );

        detected = true;
        break;
      }
    }
  }

  return detected;
}

function detectSecrets(prompt, findings) {
  let detected = false;

  const apiKeyPattern =
    /\b(?:api[_-]?key|apikey|api[_-]?token)\s*(?::|=|\bis\b)\s*["']?[A-Za-z0-9_\-]{16,}["']?/gi;

  if (apiKeyPattern.test(prompt)) {
    addFinding(findings, "API_KEY", "SECRET");
    detected = true;
  }

  const awsAccessKeyPattern =
    /\bAKIA[0-9A-Z]{16}\b/g;

  if (awsAccessKeyPattern.test(prompt)) {
    addFinding(
      findings,
      "AWS_ACCESS_KEY",
      "SECRET"
    );

    detected = true;
  }

  const jwtPattern =
    /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g;

  if (jwtPattern.test(prompt)) {
    addFinding(findings, "JWT_TOKEN", "SECRET");
    detected = true;
  }

  const privateKeyPattern =
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i;

  if (privateKeyPattern.test(prompt)) {
    addFinding(
      findings,
      "PRIVATE_KEY",
      "SECRET"
    );

    detected = true;
  }

  const passwordPattern =
    /\b(?:password|passwd|pwd|passcode|pass)\s*(?::|=|\bis\b)\s*["']?[^\s"',;]{4,}/gi;

  if (passwordPattern.test(prompt)) {
    addFinding(
      findings,
      "PASSWORD",
      "SECRET"
    );

    detected = true;
  }

  const tokenPattern =
    /\b(?:access[_-]?token|auth[_-]?token|secret[_-]?token)\s*(?::|=|\bis\b)\s*["']?[A-Za-z0-9._~+/=-]{12,}["']?/gi;

  if (tokenPattern.test(prompt)) {
    addFinding(
      findings,
      "AUTH_TOKEN",
      "SECRET"
    );

    detected = true;
  }

  const databaseUrlPattern =
    /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|mssql):\/\/[^\s"'<>]+/gi;

  if (databaseUrlPattern.test(prompt)) {
    addFinding(
      findings,
      "DATABASE_CONNECTION_STRING",
      "SECRET"
    );

    detected = true;
  }

  return detected;
}

export function detectPIIAndSecrets(prompt) {
  const normalizedPrompt = normalizeInput(prompt);

  if (!normalizedPrompt) {
    return {
      detected: false,
      piiDetected: false,
      secretsDetected: false,
      findings: [],
      summary: "No sensitive information detected",
    };
  }

  const findings = [];

  const piiDetected = detectPII(
    normalizedPrompt,
    findings
  );

  const secretsDetected = detectSecrets(
    normalizedPrompt,
    findings
  );

  let summary =
    "No sensitive information detected";

  if (piiDetected && secretsDetected) {
    summary =
      "PII and secret information detected";
  } else if (piiDetected) {
    summary = "PII detected in prompt";
  } else if (secretsDetected) {
    summary = "Secret information detected in prompt";
  }

  return {
    detected: piiDetected || secretsDetected,
    piiDetected,
    secretsDetected,
    findings,
    summary,
  };
}

export function maskSensitiveData(prompt) {
  if (typeof prompt !== "string") {
    return "";
  }

  let masked = prompt;

  masked = masked.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[REDACTED_EMAIL]"
  );

  masked = masked.replace(
    /(?<!\d)(?:\+?\d{1,3}[\s.-]?)?(?:\d{3}[\s.-]?\d{3}[\s.-]?\d{4}|\d{10})(?!\d)/g,
    "[REDACTED_PHONE]"
  );

  masked = masked.replace(
    /\b(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}\b/g,
    "[REDACTED_IP]"
  );

  masked = masked.replace(
    /\b(?:\d[ -]*?){13,19}\b/g,
    (value) => {
      const digitsOnly = value.replace(/\D/g, "");

      if (
        digitsOnly.length >= 13 &&
        digitsOnly.length <= 19
      ) {
        return "[REDACTED_CARD]";
      }

      return value;
    }
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
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/gi,
    "[REDACTED_PRIVATE_KEY]"
  );

  masked = masked.replace(
    /\b(?:api[_-]?key|apikey|api[_-]?token)\s*(?::|=|\bis\b)\s*["']?[A-Za-z0-9_\-]{16,}["']?/gi,
    "[REDACTED_API_KEY]"
  );

  masked = masked.replace(
    /\b(?:password|passwd|pwd|passcode|pass)\s*(?::|=|\bis\b)\s*["']?[^\s"',;]{4,}/gi,
    "[REDACTED_PASSWORD]"
  );

  masked = masked.replace(
    /\b(?:access[_-]?token|auth[_-]?token|secret[_-]?token)\s*(?::|=|\bis\b)\s*["']?[A-Za-z0-9._~+/=-]{12,}["']?/gi,
    "[REDACTED_TOKEN]"
  );

  masked = masked.replace(
    /\b(?:secret|client[_-]?secret|private[_-]?token)\s*(?::|=|\bis\b)\s*["']?[^\s"',;]{4,}/gi,
    "[REDACTED_SECRET]"
  );

  masked = masked.replace(
    /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|mssql):\/\/[^\s"'<>]+/gi,
    "[REDACTED_DATABASE_URL]"
  );

  return masked;
}

export default detectPIIAndSecrets;