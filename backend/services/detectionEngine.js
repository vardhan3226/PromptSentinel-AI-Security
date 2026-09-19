import attackPatterns from "./attackPatterns.js";

const threatPriority = {
  SAFE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

function normalizeText(text) {
  return String(text || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function removeSpacingObfuscation(text) {
  return text.replace(
    /\b(?:[a-z]\s+){2,}[a-z]\b/gi,
    (match) => match.replace(/\s+/g, "")
  );
}

function detectInstructionOverride(text) {
  const patterns = [
    /\b(ignore|disregard|forget|override)\b.{0,80}\b(previous|earlier|above|prior)\b.{0,50}\b(instruction|instructions|rules|prompt)\b/i,
    /\b(ignore|disregard|override)\b.{0,60}\b(system|developer|safety)\b.{0,40}\b(instruction|instructions|rules|policy|policies)\b/i,
    /\bfollow\s+(my|these|the following)\s+instructions\s+instead\b/i,
    /\bfrom now on\b.{0,100}\b(ignore|disregard|forget|override)\b/i,
    /\bnew instructions\b/i,
    /\b(highest|higher)\s+priority\b/i,
    /\byou must obey\b/i,
  ];

  return patterns.filter((pattern) => pattern.test(text));
}

function detectSystemPromptExtraction(text) {
  const patterns = [
    /\b(reveal|show|display|print|repeat|provide|tell me|give me)\b.{0,80}\b(system prompt|system instructions|hidden prompt|hidden instructions)\b/i,
    /\bwhat\b.{0,50}\b(system instructions|hidden instructions|system prompt)\b/i,
    /\b(reveal|show|display|print|repeat)\b.{0,80}\b(developer instructions|developer prompt)\b/i,
    /\bwhat are your\b.{0,50}\b(instructions|rules|configuration)\b/i,
    /\brepeat everything before\b/i,
    /\bshow everything above\b/i,
  ];

  return patterns.filter((pattern) => pattern.test(text));
}

function detectJailbreak(text) {
  const patterns = [
    /\bjailbreak\b/i,
    /\bdeveloper mode\b/i,
    /\bdo anything now\b/i,
    /\bdisable\b.{0,40}\b(safety|safeguards|filters|restrictions)\b/i,
    /\bbypass\b.{0,40}\b(safety|security|restrictions|safeguards|filters)\b/i,
    /\bno restrictions\b/i,
    /\bwithout restrictions\b/i,
    /\bunfiltered\b/i,
    /\buncensored\b/i,
    /\bignore\b.{0,50}\b(ethical|safety)\b.{0,40}\b(guidelines|rules|policies)\b/i,
  ];

  return patterns.filter((pattern) => pattern.test(text));
}

function detectRoleManipulation(text) {
  const patterns = [
    /\byou are now\b/i,
    /\bpretend you are\b/i,
    /\bpretend to be\b/i,
    /\bact as\b.{0,60}\b(unrestricted|evil|malicious|system|developer|admin)\b/i,
    /\bassume the role of\b/i,
    /\broleplay as\b/i,
    /\byou are no longer\b/i,
    /\byou are the system\b/i,
    /\byou are the developer\b/i,
    /\byou are an administrator\b/i,
  ];

  return patterns.filter((pattern) => pattern.test(text));
}

function detectSensitiveInformation(text) {
  const patterns = [
    /\b(?:reveal|show|display|print|provide|give|send|share|expose|extract|dump|retrieve|return|tell me|find|get|list)\b.{0,80}\b(api key|apikey|secret key|secret token|password|passwd|pwd|access token|authentication token|bearer token|jwt secret|private key|ssh key|environment variables|\.env file|database credentials|database password|connection string|credentials|secrets)\b/i,

    /\b(api key|apikey|secret key|secret token|password|passwd|pwd|access token|authentication token|bearer token|jwt secret|private key|ssh key|environment variables|\.env file|database credentials|database password|connection string|credentials|secrets)\b.{0,80}\b(?:reveal|show|display|print|provide|give|send|share|expose|extract|dump|retrieve|return|tell me|find|get|list)\b/i,

    /\b(?:what is|what's|where is|where are|tell me|give me)\b.{0,60}\b(?:password|api key|secret|token|credential|private key|connection string)\b/i,

    /\b(?:read|access|retrieve|extract|dump|steal|obtain|collect)\b.{0,60}\b(?:password|api key|secret|token|credential|private key|connection string)\b/i,
  ];

  return patterns.filter((pattern) => pattern.test(text));
}

function hasSensitiveRequestContext(text) {
  const requestPatterns = [
    /\b(?:reveal|show|display|print|provide|give|send|share|expose|extract|dump|retrieve|return|tell me|find|get|list|read|access|steal|obtain|collect)\b.{0,80}\b(?:api key|apikey|secret|password|passwd|pwd|token|credential|private key|ssh key|connection string|\.env|environment variable)\b/i,

    /\b(?:api key|apikey|secret|password|passwd|pwd|token|credential|private key|ssh key|connection string|\.env|environment variable)\b.{0,80}\b(?:reveal|show|display|print|provide|give|send|share|expose|extract|dump|retrieve|return|tell me|find|get|list|read|access|steal|obtain|collect)\b/i,
  ];

  return requestPatterns.some((pattern) => pattern.test(text));
}

function isPassiveSensitivePattern(pattern, text) {
  const value = normalizeText(pattern);

  const passiveIndicators = [
    "password",
    "passwd",
    "pwd",
    "email",
    "api key",
    "apikey",
    "secret key",
    "secret token",
    "access token",
    "authentication token",
    "bearer token",
    "jwt secret",
    "private key",
    "ssh key",
    "credentials",
    "secrets",
    "connection string",
    "database password",
    "database credentials",
  ];

  if (!passiveIndicators.includes(value)) {
    return false;
  }

  return !hasSensitiveRequestContext(text);
}

function detectDataExfiltration(text) {
  const patterns = [
    /\b(dump|export|download|extract|copy|send|upload)\b.{0,80}\b(database|records|confidential data|sensitive data|private data)\b/i,
    /\b(exfiltrate|steal)\b.{0,60}\b(data|information|records)\b/i,
    /\bsend\b.{0,80}\b(all|entire)\b.{0,50}\b(database|records|data)\b/i,
  ];

  return patterns.filter((pattern) => pattern.test(text));
}

function detectCodeExecution(text) {
  const patterns = [
    /\brm\s+-rf\b/i,
    /\bsudo\b.{0,50}\b(rm|shutdown|chmod)\b/i,
    /\bformat\s+c:/i,
    /\bdel\s+\/f\b/i,
    /\bpowershell\b.{0,50}\b(-command|-enc|-encodedcommand)\b/i,
    /\bcmd\.exe\b.{0,30}\b\/c\b/i,
    /\bexecute\s+(arbitrary|remote)\s+code\b/i,
    /\brun\s+(arbitrary|malicious)\s+code\b/i,
    /\beval\s*\(/i,
    /\bexec\s*\(/i,
    /\bos\.system\s*\(/i,
    /\bsubprocess\.(run|call|Popen)\s*\(/i,
  ];

  return patterns.filter((pattern) => pattern.test(text));
}

function detectObfuscation(
  originalText,
  normalizedText,
  preprocessed = null
) {
  const indicators = [];

  if (
    /\b(?:[a-z]\s+){3,}[a-z]\b/i.test(
      originalText
    )
  ) {
    indicators.push(
      "character spacing obfuscation"
    );
  }

  if (
    /\b[A-Za-z0-9+/]{40,}={0,2}\b/.test(
      originalText
    )
  ) {
    indicators.push(
      "possible encoded payload"
    );
  }

  if (
    /\\u[0-9a-f]{4}/i.test(
      originalText
    )
  ) {
    indicators.push(
      "unicode escape sequence"
    );
  }

  if (
    /\\x[0-9a-f]{2}/i.test(
      originalText
    )
  ) {
    indicators.push(
      "hexadecimal escape sequence"
    );
  }

  if (
    preprocessed?.encodingIndicators?.base64Like
  ) {
    indicators.push(
      "possible encoded payload"
    );
  }

  if (
    preprocessed?.encodingIndicators?.hexLike
  ) {
    indicators.push(
      "possible hexadecimal encoded content"
    );
  }

  if (
    normalizedText !==
      originalText.toLowerCase().trim() &&
    originalText.length > 20
  ) {
    indicators.push(
      "text normalization detected"
    );
  }

  return [
    ...new Set(indicators),
  ];
}

function collectPreprocessorEvidence(
  preprocessed,
  matchedPatterns,
  matchedAttackTypes,
  detectedThreatLevels,
  evidence,
  addUniqueEvidence
) {
  if (!preprocessed) {
    return;
  }

  const hierarchyIndicators =
    Array.isArray(
      preprocessed.hierarchyIndicators
    )
      ? preprocessed.hierarchyIndicators
      : [];

  for (
    const indicator of hierarchyIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "hierarchy"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.hierarchySignals += 1;
    }
  }

  if (
    hierarchyIndicators.length > 0
  ) {
    matchedAttackTypes.push(
      "Prompt Injection"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const roleIndicators =
    Array.isArray(
      preprocessed.roleIndicators
    )
      ? preprocessed.roleIndicators
      : [];

  for (
    const indicator of roleIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "role"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.roleSignals += 1;
    }
  }

  if (
    roleIndicators.length > 0
  ) {
    matchedAttackTypes.push(
      "Role Manipulation"
    );

    detectedThreatLevels.push(
      "MEDIUM"
    );
  }

  const bypassIndicators =
    Array.isArray(
      preprocessed.bypassIndicators
    )
      ? preprocessed.bypassIndicators
      : [];

  for (
    const indicator of bypassIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "bypass"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.bypassSignals += 1;
    }
  }

  if (
    bypassIndicators.length > 0
  ) {
    matchedAttackTypes.push(
      "Jailbreak"
    );

    detectedThreatLevels.push(
      "CRITICAL"
    );
  }

  const extractionIndicators =
    Array.isArray(
      preprocessed.extractionIndicators
    )
      ? preprocessed.extractionIndicators
      : [];

  for (
    const indicator of extractionIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "extraction"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.extractionSignals += 1;
    }
  }

  if (
    extractionIndicators.length > 0
  ) {
    matchedAttackTypes.push(
      "System Prompt Extraction"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const secretIndicators =
    Array.isArray(
      preprocessed.secretIndicators
    )
      ? preprocessed.secretIndicators
      : [];

  for (
    const indicator of secretIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "secret"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.secretSignals += 1;
    }
  }

  if (
    secretIndicators.length > 0 &&
    hasSensitiveRequestContext(
      normalizeText(
        preprocessed.originalPrompt ||
        preprocessed.normalizedPrompt ||
        ""
      )
    )
  ) {
    matchedAttackTypes.push(
      "Sensitive Data Exposure"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const executionIndicators =
    Array.isArray(
      preprocessed.executionIndicators
    )
      ? preprocessed.executionIndicators
      : [];

  for (
    const indicator of executionIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "execution"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.executionSignals += 1;
    }
  }

  if (
    executionIndicators.length > 0
  ) {
    matchedAttackTypes.push(
      "Code Execution"
    );

    detectedThreatLevels.push(
      "CRITICAL"
    );
  }

  const delimiterIndicators =
    Array.isArray(
      preprocessed.delimiterIndicators
    )
      ? preprocessed.delimiterIndicators
      : [];

  for (
    const indicator of delimiterIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "delimiter"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.delimiterSignals += 1;
    }
  }

  if (
    delimiterIndicators.length > 0
  ) {
    matchedAttackTypes.push(
      "Prompt Injection"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const encodingIndicators =
    preprocessed.encodingIndicators ||
    {};

  if (
    encodingIndicators.base64Like
  ) {
    if (
      addUniqueEvidence(
        "base64-like content",
        "encoding"
      )
    ) {
      matchedPatterns.push(
        "encoded content indicator"
      );

      evidence.encodingSignals += 1;
    }
  }

  if (
    encodingIndicators.hexLike
  ) {
    if (
      addUniqueEvidence(
        "hex-like content",
        "encoding"
      )
    ) {
      matchedPatterns.push(
        "hexadecimal content indicator"
      );

      evidence.encodingSignals += 1;
    }
  }

  if (
    encodingIndicators.base64Like ||
    encodingIndicators.hexLike
  ) {
    detectedThreatLevels.push(
      "LOW"
    );
  }
}

export function detectAttack(input) {
  if (
    typeof input !== "string" &&
    (!input || typeof input !== "object")
  ) {
    return {
      attackType: "Safe Prompt",
      threatLevel: "SAFE",
      matchedPatterns: [],
      evidence: {},
    };
  }

  const isPreprocessed =
    typeof input === "object";

  const originalText =
    isPreprocessed
      ? String(
          input.originalPrompt ||
          input.normalizedPrompt ||
          ""
        ).trim()
      : String(input).trim();

  if (!originalText) {
    return {
      attackType: "Safe Prompt",
      threatLevel: "SAFE",
      matchedPatterns: [],
      evidence: {},
    };
  }

  const normalizedText =
    normalizeText(
      isPreprocessed
        ? input.normalizedPrompt ||
          originalText
        : originalText
    );

  const deobfuscatedText =
    removeSpacingObfuscation(
      normalizedText
    );

  const matchedPatterns = [];
  const matchedAttackTypes = [];
  const detectedThreatLevels = [];

  const evidence = {
    patternMatches: 0,
    hierarchySignals: 0,
    roleSignals: 0,
    bypassSignals: 0,
    extractionSignals: 0,
    secretSignals: 0,
    exfiltrationSignals: 0,
    executionSignals: 0,
    delimiterSignals: 0,
    encodingSignals: 0,
    obfuscationSignals: 0,
    uniqueIndicators: new Set(),
  };

  const addUniqueEvidence =
    (
      indicator,
      category
    ) => {
      const normalizedIndicator =
        normalizeText(
          indicator
        );

      const evidenceKey =
        `${category}:${normalizedIndicator}`;

      if (
        evidence.uniqueIndicators.has(
          evidenceKey
        )
      ) {
        return false;
      }

      evidence.uniqueIndicators.add(
        evidenceKey
      );

      return true;
    };

  for (
    const attack of attackPatterns
  ) {
    if (
      !attack ||
      !Array.isArray(
        attack.patterns
      )
    ) {
      continue;
    }

    const matches =
      attack.patterns.filter(
        (pattern) => {
          if (
            typeof pattern !==
            "string"
          ) {
            return false;
          }

          if (
            isPassiveSensitivePattern(
              pattern,
              normalizedText
            )
          ) {
            return false;
          }

          const normalizedPattern =
            normalizeText(
              pattern
            );

          return (
            normalizedText.includes(
              normalizedPattern
            ) ||
            deobfuscatedText.includes(
              normalizedPattern
            )
          );
        }
      );

    if (
      matches.length > 0
    ) {
      for (
        const match of matches
      ) {
        if (
          addUniqueEvidence(
            match,
            "pattern"
          )
        ) {
          matchedPatterns.push(
            match
          );

          evidence.patternMatches +=
            1;
        }
      }

      matchedAttackTypes.push(
        attack.attackType
      );

      detectedThreatLevels.push(
        attack.threatLevel
      );
    }
  }

  const overrideMatches =
    detectInstructionOverride(
      normalizedText
    );

  if (
    overrideMatches.length > 0
  ) {
    if (
      addUniqueEvidence(
        "instruction hierarchy override",
        "hierarchy"
      )
    ) {
      matchedPatterns.push(
        "instruction hierarchy override"
      );

      evidence.hierarchySignals +=
        1;
    }

    matchedAttackTypes.push(
      "Prompt Injection"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const extractionMatches =
    detectSystemPromptExtraction(
      normalizedText
    );

  if (
    extractionMatches.length > 0
  ) {
    if (
      addUniqueEvidence(
        "system prompt extraction attempt",
        "extraction"
      )
    ) {
      matchedPatterns.push(
        "system prompt extraction attempt"
      );

      evidence.extractionSignals +=
        1;
    }

    matchedAttackTypes.push(
      "System Prompt Extraction"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const jailbreakMatches =
    detectJailbreak(
      normalizedText
    );

  if (
    jailbreakMatches.length > 0
  ) {
    if (
      addUniqueEvidence(
        "jailbreak behavior",
        "bypass"
      )
    ) {
      matchedPatterns.push(
        "jailbreak behavior"
      );

      evidence.bypassSignals +=
        1;
    }

    matchedAttackTypes.push(
      "Jailbreak"
    );

    detectedThreatLevels.push(
      "CRITICAL"
    );
  }

  const roleMatches =
    detectRoleManipulation(
      normalizedText
    );

  if (
    roleMatches.length > 0
  ) {
    if (
      addUniqueEvidence(
        "role manipulation",
        "role"
      )
    ) {
      matchedPatterns.push(
        "role manipulation"
      );

      evidence.roleSignals +=
        1;
    }

    matchedAttackTypes.push(
      "Role Manipulation"
    );

    detectedThreatLevels.push(
      "MEDIUM"
    );
  }

  const sensitiveMatches =
    detectSensitiveInformation(
      normalizedText
    );

  if (
    sensitiveMatches.length > 0
  ) {
    if (
      addUniqueEvidence(
        "sensitive information request",
        "secret"
      )
    ) {
      matchedPatterns.push(
        "sensitive information request"
      );

      evidence.secretSignals +=
        1;
    }

    matchedAttackTypes.push(
      "Sensitive Data Exposure"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const exfiltrationMatches =
    detectDataExfiltration(
      normalizedText
    );

  if (
    exfiltrationMatches.length > 0
  ) {
    if (
      addUniqueEvidence(
        "data exfiltration behavior",
        "exfiltration"
      )
    ) {
      matchedPatterns.push(
        "data exfiltration behavior"
      );

      evidence.exfiltrationSignals +=
        1;
    }

    matchedAttackTypes.push(
      "Data Exfiltration"
    );

    detectedThreatLevels.push(
      "HIGH"
    );
  }

  const codeMatches =
    detectCodeExecution(
      normalizedText
    );

  if (
    codeMatches.length > 0
  ) {
    if (
      addUniqueEvidence(
        "command or code execution attempt",
        "execution"
      )
    ) {
      matchedPatterns.push(
        "command or code execution attempt"
      );

      evidence.executionSignals +=
        1;
    }

    matchedAttackTypes.push(
      "Code Execution"
    );

    detectedThreatLevels.push(
      "CRITICAL"
    );
  }

  const obfuscationIndicators =
    detectObfuscation(
      originalText,
      normalizedText,
      isPreprocessed
        ? input
        : null
    );

  for (
    const indicator of
    obfuscationIndicators
  ) {
    if (
      addUniqueEvidence(
        indicator,
        "obfuscation"
      )
    ) {
      matchedPatterns.push(
        indicator
      );

      evidence.obfuscationSignals +=
        1;
    }
  }

  if (
    obfuscationIndicators.length > 0
  ) {
    detectedThreatLevels.push(
      "LOW"
    );
  }

  if (
    isPreprocessed
  ) {
    collectPreprocessorEvidence(
      input,
      matchedPatterns,
      matchedAttackTypes,
      detectedThreatLevels,
      evidence,
      addUniqueEvidence
    );
  }

  const uniquePatterns = [
    ...new Set(
      matchedPatterns
        .filter(Boolean)
        .map(
          (item) =>
            String(item).trim()
        )
        .filter(Boolean)
    ),
  ];

  const uniqueAttackTypes = [
    ...new Set(
      matchedAttackTypes
        .filter(Boolean)
        .map(
          (item) =>
            String(item).trim()
        )
        .filter(Boolean)
    ),
  ];

  let threatLevel =
    "SAFE";

  for (
    const level of
    detectedThreatLevels
  ) {
    if (
      threatPriority[level] >
      threatPriority[
        threatLevel
      ]
    ) {
      threatLevel =
        level;
    }
  }

  const signalGroups = [
    evidence.hierarchySignals,
    evidence.roleSignals,
    evidence.bypassSignals,
    evidence.extractionSignals,
    evidence.secretSignals,
    evidence.exfiltrationSignals,
    evidence.executionSignals,
    evidence.delimiterSignals,
    evidence.encodingSignals,
    evidence.obfuscationSignals,
  ].filter(
    (value) =>
      value > 0
  ).length;

  evidence.signalGroups =
    signalGroups;

  if (
    signalGroups >= 3 &&
    threatLevel === "MEDIUM"
  ) {
    threatLevel =
      "HIGH";
  }

  const hasCriticalEvidence =
    evidence.bypassSignals > 0 ||
    evidence.executionSignals > 0 ||
    uniqueAttackTypes.includes(
      "Command Injection"
    ) ||
    uniqueAttackTypes.includes(
      "Code Execution"
    );

  if (
    signalGroups >= 4 &&
    threatLevel === "HIGH" &&
    hasCriticalEvidence
  ) {
    threatLevel =
      "CRITICAL";
  }

  const attackType =
    uniqueAttackTypes.length > 0
      ? uniqueAttackTypes.join(
          ", "
        )
      : "Safe Prompt";

  delete evidence.uniqueIndicators;

  return {
    attackType,
    threatLevel,
    matchedPatterns:
      uniquePatterns,
    evidence,
  };
}