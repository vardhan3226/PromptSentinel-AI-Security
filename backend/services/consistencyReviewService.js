function normalizeThreatLevel(value) {
  if (!value) {
    return "SAFE";
  }

  const normalized = String(value).toUpperCase();

  if (
    ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(
      normalized
    )
  ) {
    return normalized;
  }

  return "SAFE";
}

function getSemanticThreat(semanticResult) {
  if (semanticResult?.detected === true) {
    return "MALICIOUS";
  }

  return "SAFE";
}

function getLocalThreat(localResult) {
  const threatLevel = normalizeThreatLevel(
    localResult?.threatLevel
  );

  return threatLevel === "SAFE"
    ? "SAFE"
    : "MALICIOUS";
}

function getAiThreat(aiResult) {
  if (!aiResult) {
    return null;
  }

  const threatLevel = normalizeThreatLevel(
    aiResult.threatLevel
  );

  return threatLevel === "SAFE"
    ? "SAFE"
    : "MALICIOUS";
}

export function analyzeDetectionConsistency({
  localResult,
  semanticResult,
  aiResult,
}) {
  const localThreat =
    getLocalThreat(localResult);

  const semanticThreat =
    getSemanticThreat(semanticResult);

  const aiThreat =
    getAiThreat(aiResult);

  const sources = [
    {
      source: "Local Security Engine",
      classification: localThreat,
    },
    {
      source: "Semantic Similarity",
      classification: semanticThreat,
    },
  ];

  if (aiThreat !== null) {
    sources.push({
      source: "AI Analysis",
      classification: aiThreat,
    });
  }

  const classifications =
    sources.map(
      (source) => source.classification
    );

  const maliciousCount =
    classifications.filter(
      (value) => value === "MALICIOUS"
    ).length;

  const safeCount =
    classifications.filter(
      (value) => value === "SAFE"
    ).length;

  const consistent =
    maliciousCount === 0 ||
    safeCount === 0;

  const agreementCount =
    Math.max(
      maliciousCount,
      safeCount
    );

  const consistencyScore =
    classifications.length > 0
      ? Math.round(
          (agreementCount /
            classifications.length) *
            100
        )
      : 0;

  let status = "CONSISTENT";

  if (consistencyScore < 100) {
    status = "REVIEW_REQUIRED";
  }

  return {
    consistent,
    status,
    consistencyScore,
    sources,
    summary: consistent
      ? "All available detection engines agree on the security classification."
      : "Detection engines disagree and the result should be reviewed.",
  };
}

export default analyzeDetectionConsistency;