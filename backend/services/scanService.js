import prisma from "../lib/prisma.js";
import preprocessPrompt from "./promptPreprocessor.js";
import {
  detectPIIAndSecrets,
  maskSensitiveData,
} from "./piiSecretDetector.js";
import { detectAttack } from "./detectionEngine.js";
import { calculateRisk } from "./riskCalculator.js";
import { calculateConfidence } from "./confidenceCalculator.js";
import { generateRecommendation } from "./recommendationEngine.js";
import {
  analyzeWithGroq,
} from "./groqService.js";
import {
  analyzeSemanticSimilarity,
} from "./semanticSimilarityService.js";
import analyzeDetectionConsistency from "./consistencyReviewService.js";

const threatPriority = {
  SAFE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const VALID_THREAT_LEVELS = [
  "SAFE",
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

function normalizeThreatLevel(level) {
  if (typeof level !== "string") {
    return "SAFE";
  }

  const normalized = level.trim().toUpperCase();

  return VALID_THREAT_LEVELS.includes(normalized)
    ? normalized
    : "SAFE";
}

function normalizeScore(value, fallback = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(number))
  );
}

function getThreatLevelFromScore(score) {
  if (score >= 90) {
    return "CRITICAL";
  }

  if (score >= 70) {
    return "HIGH";
  }

  if (score >= 40) {
    return "MEDIUM";
  }

  if (score >= 15) {
    return "LOW";
  }

  return "SAFE";
}

function getMinimumScoreForThreat(threatLevel) {
  switch (threatLevel) {
    case "CRITICAL":
      return 90;

    case "HIGH":
      return 70;

    case "MEDIUM":
      return 40;

    case "LOW":
      return 15;

    case "SAFE":
    default:
      return 0;
  }
}

function getSecurityAction(threatLevel) {
  switch (threatLevel) {
    case "SAFE":
      return {
        action: "ALLOW",
        message: "Prompt appears safe.",
      };

    case "LOW":
      return {
        action: "MONITOR",
        message:
          "Minor suspicious indicators detected.",
      };

    case "MEDIUM":
      return {
        action: "WARNING",
        message:
          "Suspicious prompt detected. Review recommended.",
      };

    case "HIGH":
      return {
        action: "BLOCK",
        message: "High-risk prompt detected.",
      };

    case "CRITICAL":
      return {
        action: "BLOCK_AND_ALERT",
        message: "Critical security threat detected.",
      };

    default:
      return {
        action: "REVIEW",
        message: "Manual security review required.",
      };
  }
}

function normalizeAttackTypes(attackType) {
  if (typeof attackType !== "string") {
    return [];
  }

  if (attackType.trim() === "Safe Prompt") {
    return [];
  }

  return attackType
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function combineUnique(...arrays) {
  return [
    ...new Set(
      arrays
        .flat()
        .filter(Boolean)
        .map((item) =>
          typeof item === "string"
            ? item.trim()
            : item
        )
        .filter(Boolean)
    ),
  ];
}

function fuseResults(localResult, aiResult) {
  if (!aiResult) {
    const threatLevel = normalizeThreatLevel(
      localResult.threatLevel
    );

    const riskScore = normalizeScore(
      localResult.riskScore
    );

    return {
      threatLevel,
      riskScore,
      confidence: normalizeScore(
        localResult.confidence
      ),
      engineUsed: "LOCAL_ENGINE",
      enginesAgree: null,
      aiInfluenced: false,
    };
  }

  const localThreat = normalizeThreatLevel(
    localResult.threatLevel
  );

  const aiThreat = normalizeThreatLevel(
    aiResult.threatLevel
  );

  const localRisk = normalizeScore(
    localResult.riskScore
  );

  const aiRisk = normalizeScore(
    aiResult.riskScore
  );

  const localConfidence = normalizeScore(
    localResult.confidence
  );

  const aiConfidence = normalizeScore(
    aiResult.confidence
  );

  const enginesAgree =
    localThreat === aiThreat;

  let fusedRiskScore = Math.round(
    localRisk * 0.6 +
    aiRisk * 0.4
  );

  const strongestThreat =
    threatPriority[aiThreat] >
    threatPriority[localThreat]
      ? aiThreat
      : localThreat;

  const minimumScore =
    getMinimumScoreForThreat(
      strongestThreat
    );

  fusedRiskScore = Math.max(
    fusedRiskScore,
    minimumScore
  );

  fusedRiskScore = Math.min(
    100,
    fusedRiskScore
  );

  let finalThreatLevel =
    getThreatLevelFromScore(
      fusedRiskScore
    );

  if (
    threatPriority[strongestThreat] >
    threatPriority[finalThreatLevel]
  ) {
    finalThreatLevel = strongestThreat;

    fusedRiskScore = Math.max(
      fusedRiskScore,
      getMinimumScoreForThreat(
        strongestThreat
      )
    );
  }

  let finalConfidence;

  if (enginesAgree) {
    finalConfidence = Math.min(
      98,
      Math.round(
        (
          localConfidence +
          aiConfidence
        ) / 2
      ) + 5
    );
  } else {
    finalConfidence = Math.min(
      95,
      Math.round(
        (
          localConfidence +
          aiConfidence
        ) / 2
      )
    );
  }

  return {
    threatLevel: finalThreatLevel,
    riskScore: fusedRiskScore,
    confidence: finalConfidence,
    engineUsed:
      "LOCAL_ENGINE + GROQ_AI",
    enginesAgree,
    aiInfluenced: true,
  };
}

function buildEvidence({
  localResult,
  aiResult,
  aiKeywords,
  semanticSimilarity,
  piiSecretAnalysis,
  detectedAttacks,
}) {
  const localPatterns =
    Array.isArray(
      localResult.matchedPatterns
    )
      ? localResult.matchedPatterns
      : [];

  const semanticMatches =
    Array.isArray(
      semanticSimilarity.matches
    )
      ? semanticSimilarity.matches.map(
          (match) => ({
            attackType:
              match.attackType,
            pattern:
              match.pattern,
            similarityScore:
              match.similarityScore,
          })
        )
      : [];

  const piiFindings =
    Array.isArray(
      piiSecretAnalysis.findings
    )
      ? piiSecretAnalysis.findings.map(
          (finding) => ({
            type: finding.type,
            category: finding.category,
          })
        )
      : [];

  const sources = [];

  if (localPatterns.length > 0) {
    sources.push("Local Detection Engine");
  }

  if (semanticMatches.length > 0) {
    sources.push("Semantic Similarity");
  }

  if (aiKeywords.length > 0) {
    sources.push("Groq AI Analysis");
  }

  if (piiFindings.length > 0) {
    sources.push("PII & Secret Detection");
  }

  const reasons = [];

  if (localPatterns.length > 0) {
    reasons.push(
      `${localPatterns.length} local security pattern(s) matched`
    );
  }

  if (semanticMatches.length > 0) {
    reasons.push(
      `semantic similarity detected with a highest similarity of ${semanticSimilarity.similarityScore}%`
    );
  }

  if (aiKeywords.length > 0) {
    reasons.push(
      `${aiKeywords.length} AI security indicator(s) identified`
    );
  }

  if (piiFindings.length > 0) {
    reasons.push(
      `${piiFindings.length} sensitive information finding(s) detected`
    );
  }

  if (
    reasons.length === 0 &&
    detectedAttacks.length === 0
  ) {
    reasons.push(
      "No suspicious security evidence detected"
    );
  }

  return {
    detected:
      reasons.length > 0 &&
      (
        localPatterns.length > 0 ||
        semanticMatches.length > 0 ||
        aiKeywords.length > 0 ||
        piiFindings.length > 0 ||
        detectedAttacks.length > 0
      ),

    attackTypes:
      detectedAttacks,

    sources,

    localPatterns,

    semanticMatches,

    semanticSimilarityScore:
      semanticSimilarity.similarityScore,

    aiKeywords,

    piiFindings,

    explanation:
      reasons.join("; "),

    summary:
      reasons.join("; "),
  };
}

export const analyzePrompt = async (
  prompt,
  userId
) => {
  const workflow = [];

  if (
    !prompt ||
    typeof prompt !== "string" ||
    !prompt.trim()
  ) {
    throw new Error(
      "Valid prompt is required."
    );
  }

  workflow.push({
    step: 1,
    name: "Input Validation",
    status: "COMPLETED",
    description:
      "Prompt validated successfully.",
  });

  const preprocessed =
    preprocessPrompt(prompt);

  workflow.push({
    step: 2,
    name: "Prompt Preprocessing",
    status: "COMPLETED",
    description:
      "Prompt features and indicators extracted.",
  });

  const piiSecretAnalysis =
    detectPIIAndSecrets(prompt);

  workflow.push({
    step: 3,
    name: "PII & Secret Detection",
    status: "COMPLETED",
    description:
      piiSecretAnalysis.detected
        ? piiSecretAnalysis.summary
        : "No PII or secret information detected.",
    result: {
      detected:
        piiSecretAnalysis.detected,
      piiDetected:
        piiSecretAnalysis.piiDetected,
      secretsDetected:
        piiSecretAnalysis.secretsDetected,
      findingTypes:
        piiSecretAnalysis.findings.map(
          (finding) => finding.type
        ),
    },
  });

  const semanticSimilarity =
    analyzeSemanticSimilarity(prompt);

  workflow.push({
    step: 4,
    name:
      "Semantic Similarity Detection",
    status: "COMPLETED",
    description:
      semanticSimilarity.detected
        ? semanticSimilarity.summary
        : "No semantic similarity detected.",
    result: {
      detected:
        semanticSimilarity.detected,
      similarityScore:
        semanticSimilarity.similarityScore,
      matches:
        semanticSimilarity.matches,
    },
  });

  const detection =
    detectAttack(preprocessed);

  const localRiskScore =
    normalizeScore(
      calculateRisk(
        detection.threatLevel,
        detection.matchedPatterns
      )
    );

  const localConfidence =
    normalizeScore(
      calculateConfidence(
        detection.threatLevel,
        detection.matchedPatterns
      )
    );

  const localResult = {
    engine:
      "LOCAL_DETECTION_ENGINE",

    threatLevel:
      normalizeThreatLevel(
        detection.threatLevel
      ),

    riskScore:
      localRiskScore,

    confidence:
      localConfidence,

    attackType:
      detection.attackType ||
      "Safe Prompt",

    matchedPatterns:
      Array.isArray(
        detection.matchedPatterns
      )
        ? detection.matchedPatterns
        : [],
  };

  workflow.push({
    step: 5,
    name:
      "Local Security Analysis",
    status: "COMPLETED",
    description:
      "Rule-based security detection completed.",
    result: {
      threatLevel:
        localResult.threatLevel,
      riskScore:
        localResult.riskScore,
    },
  });

  let aiResult = null;

  try {
    aiResult =
      await analyzeWithGroq(prompt);

    if (aiResult) {
      workflow.push({
        step: 6,
        name:
          "Groq AI Security Analysis",
        status: "COMPLETED",
        description:
          "Groq AI security analysis completed.",
        result: {
          threatLevel:
            aiResult.threatLevel,
          riskScore:
            aiResult.riskScore,
        },
      });
    } else {
      workflow.push({
        step: 6,
        name:
          "Groq AI Security Analysis",
        status: "FALLBACK",
        description:
          "Groq AI unavailable. Local engine remains active.",
      });
    }
  } catch (error) {
    console.error(
      "Groq analysis failed:",
      error.message
    );

    aiResult = null;

    workflow.push({
      step: 6,
      name:
        "Groq AI Security Analysis",
      status: "FALLBACK",
      description:
        "AI analysis failed. Local engine used as fallback.",
    });
  }

  const fusionResult =
    fuseResults(
      localResult,
      aiResult
    );

  workflow.push({
    step: 7,
    name:
      "Security Result Fusion",
    status: "COMPLETED",
    description:
      aiResult
        ? "Local engine and Groq AI results combined."
        : "Local security result used.",
    result: {
      threatLevel:
        fusionResult.threatLevel,
      riskScore:
        fusionResult.riskScore,
      enginesAgree:
        fusionResult.enginesAgree,
    },
  });

  const localAttackTypes =
    normalizeAttackTypes(
      localResult.attackType
    );

  const aiAttackTypes =
    aiResult
      ? normalizeAttackTypes(
          aiResult.attackType
        )
      : [];

  const semanticAttackTypes =
    semanticSimilarity.detected
      ? semanticSimilarity.matches.map(
          (match) => match.attackType
        )
      : [];

  const detectedAttacks =
    combineUnique(
      localAttackTypes,
      aiAttackTypes,
      semanticAttackTypes
    );

  const finalAttackType =
    detectedAttacks.length > 0
      ? detectedAttacks.join(", ")
      : "Safe Prompt";

  workflow.push({
    step: 8,
    name:
      "Combine Attack Types",
    status: "COMPLETED",
    description:
      "Attack types from local, semantic, and AI analysis combined.",
    result: {
      detectedAttacks,
      finalAttackType,
    },
  });

  const aiKeywords =
    aiResult &&
    Array.isArray(
      aiResult.matchedKeywords
    )
      ? aiResult.matchedKeywords
      : [];

  const semanticMatches =
    semanticSimilarity.matches.map(
      (match) =>
        `${match.attackType}: ${match.pattern} (${match.similarityScore}% similarity)`
    );

  const combinedMatchedPatterns =
    combineUnique(
      localResult.matchedPatterns,
      aiKeywords,
      semanticMatches
    );

  const evidence =
    buildEvidence({
      localResult,
      aiResult,
      aiKeywords,
      semanticSimilarity,
      piiSecretAnalysis,
      detectedAttacks,
    });

  workflow.push({
    step: 9,
    name:
      "Combine Detection Evidence",
    status: "COMPLETED",
    description:
      "Local patterns, semantic matches, AI indicators, and sensitive-data findings combined into explainable evidence.",
    result: {
      matchedPatterns:
        combinedMatchedPatterns,
      evidence,
    },
  });

  const localRecommendation =
    generateRecommendation(
      finalAttackType,
      fusionResult.threatLevel
    );

  const aiRecommendation =
    aiResult?.recommendation &&
    typeof aiResult.recommendation ===
      "string"
      ? aiResult.recommendation.trim()
      : null;

  const recommendation =
    localRecommendation;

  workflow.push({
    step: 10,
    name:
      "Generate Recommendation",
    status: "COMPLETED",
    description:
      "Security recommendation generated.",
    result: {
      recommendation,
    },
  });

  const detectionReasons = [];

  if (
    localResult.matchedPatterns
      .length > 0
  ) {
    detectionReasons.push(
      `Local engine detected ${localResult.matchedPatterns.length} suspicious pattern(s).`
    );
  }

  if (
    piiSecretAnalysis.detected
  ) {
    detectionReasons.push(
      `Sensitive information analysis: ${piiSecretAnalysis.summary}.`
    );
  }

  if (
    semanticSimilarity.detected
  ) {
    detectionReasons.push(
      `Semantic similarity analysis: ${semanticSimilarity.summary}.`
    );
  }

  if (
    aiResult?.detectionReason
  ) {
    detectionReasons.push(
      `AI analysis: ${aiResult.detectionReason.trim()}`
    );
  }

  const detectionReason =
    detectionReasons.length > 0
      ? detectionReasons.join(" ")
      : "No malicious indicators were detected.";

  workflow.push({
    step: 11,
    name:
      "Detection Reason",
    status: "COMPLETED",
    description:
      detectionReason,
  });

  const securityAction =
    getSecurityAction(
      fusionResult.threatLevel
    );

  workflow.push({
    step: 12,
    name:
      "Final Security Decision",
    status: "COMPLETED",
    description:
      securityAction.message,
    result: {
      threatLevel:
        fusionResult.threatLevel,
      riskScore:
        fusionResult.riskScore,
      action:
        securityAction.action,
    },
  });

  const consistencyAnalysis =
    analyzeDetectionConsistency({
      localResult,
      semanticResult:
        semanticSimilarity,
      aiResult,
    });

  workflow.push({
    step: 13,
    name:
      "Consistency & Manual Review",
    status: "COMPLETED",
    description:
      consistencyAnalysis.summary,
    result: {
      status:
        consistencyAnalysis.status,
      consistencyScore:
        consistencyAnalysis.consistencyScore,
      consistent:
        consistencyAnalysis.consistent,
      sources:
        consistencyAnalysis.sources,
    },
  });

  const maskedPrompt =
    maskSensitiveData(prompt);

  const scan =
    await prisma.promptScan.create({
      data: {
        prompt:
          maskedPrompt,

        attackType:
          finalAttackType,

        threatLevel:
          fusionResult.threatLevel,

        confidence:
          fusionResult.confidence,

        riskScore:
          fusionResult.riskScore,

        recommendation,

        userId,
      },
    });

  return {
    id: scan.id,

    prompt:
      scan.prompt,

    createdAt:
      scan.createdAt,

    finalResult: {
      attackType:
        finalAttackType,

      threatLevel:
        fusionResult.threatLevel,

      riskScore:
        fusionResult.riskScore,

      confidence:
        fusionResult.confidence,

      action:
        securityAction.action,

      actionMessage:
        securityAction.message,

      recommendation,
    },

    attackType:
      finalAttackType,

    threatLevel:
      fusionResult.threatLevel,

    confidence:
      fusionResult.confidence,

    riskScore:
      fusionResult.riskScore,

    recommendation,

    workflow,

    localAnalysis:
      localResult,

    aiAnalysis:
      aiResult
        ? {
            provider:
              "Groq",

            available:
              true,

            threatLevel:
              aiResult.threatLevel,

            riskScore:
              aiResult.riskScore,

            confidence:
              aiResult.confidence,

            attackType:
              aiResult.attackType,

            matchedKeywords:
              aiKeywords,

            detectionReason:
              aiResult.detectionReason,

            recommendation:
              aiRecommendation,
          }
        : {
            provider:
              "Groq",

            available:
              false,

            status:
              "FALLBACK",

            message:
              "AI analysis unavailable. Local engine used.",
          },

    fusion: {
      engineUsed:
        fusionResult.engineUsed,

      enginesAgree:
        fusionResult.enginesAgree,

      aiInfluenced:
        fusionResult.aiInfluenced,

      localThreatLevel:
        localResult.threatLevel,

      aiThreatLevel:
        aiResult?.threatLevel ||
        null,
    },

    matchedPatterns:
      combinedMatchedPatterns,

    matchedKeywords:
      aiKeywords,

    detectedAttacks,

    detectionReason,

    localRecommendation,

    aiRecommendation,

    evidence,

    consistencyAnalysis,

    piiSecretAnalysis: {
      detected:
        piiSecretAnalysis.detected,

      piiDetected:
        piiSecretAnalysis.piiDetected,

      secretsDetected:
        piiSecretAnalysis.secretsDetected,

      findings:
        piiSecretAnalysis.findings,

      summary:
        piiSecretAnalysis.summary,
    },

    semanticSimilarity: {
      detected:
        semanticSimilarity.detected,

      similarityScore:
        semanticSimilarity.similarityScore,

      matches:
        semanticSimilarity.matches,

      summary:
        semanticSimilarity.summary,
    },

    preprocessing: {
      characterCount:
        preprocessed.characterCount,

      wordCount:
        preprocessed.wordCount,

      lineCount:
        preprocessed.lineCount,

      urlCount:
        preprocessed.urlCount,

      encodingIndicators:
        preprocessed.encodingIndicators,

      hierarchyIndicators:
        preprocessed.hierarchyIndicators,

      roleIndicators:
        preprocessed.roleIndicators,

      bypassIndicators:
        preprocessed.bypassIndicators,

      extractionIndicators:
        preprocessed.extractionIndicators,

      secretIndicators:
        preprocessed.secretIndicators,

      executionIndicators:
        preprocessed.executionIndicators,

      delimiterIndicators:
        preprocessed.delimiterIndicators,

      featureCount:
        preprocessed.featureCount,
    },
  };
};

export const getScanHistory =
  async (userId) => {
    return await prisma.promptScan.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };