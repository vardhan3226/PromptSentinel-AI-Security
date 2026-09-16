import prisma from "../lib/prisma.js";

import preprocessPrompt from "./promptPreprocessor.js";

import { detectAttack } from "./detectionEngine.js";

import { calculateRisk } from "./riskCalculator.js";

import { calculateConfidence } from "./confidenceCalculator.js";

import { generateRecommendation } from "./recommendationEngine.js";

import {
  analyzeWithGroq,
} from "./groqService.js";

/*
|--------------------------------------------------------------------------
| Threat Priority
|--------------------------------------------------------------------------
*/

const threatPriority = {
  SAFE: 0,

  LOW: 1,

  MEDIUM: 2,

  HIGH: 3,

  CRITICAL: 4,
};

/*
|--------------------------------------------------------------------------
| Valid Threat Levels
|--------------------------------------------------------------------------
*/

const VALID_THREAT_LEVELS = [
  "SAFE",

  "LOW",

  "MEDIUM",

  "HIGH",

  "CRITICAL",
];

/*
|--------------------------------------------------------------------------
| Normalize Threat Level
|--------------------------------------------------------------------------
*/

function normalizeThreatLevel(
  level
) {
  if (
    typeof level !== "string"
  ) {
    return "SAFE";
  }

  const normalized =
    level
      .trim()
      .toUpperCase();

  return VALID_THREAT_LEVELS.includes(
    normalized
  )
    ? normalized
    : "SAFE";
}

/*
|--------------------------------------------------------------------------
| Normalize Score
|--------------------------------------------------------------------------
*/

function normalizeScore(
  value,
  fallback = 0
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(number)
    )
  );
}

/*
|--------------------------------------------------------------------------
| Get Threat Level From Risk Score
|--------------------------------------------------------------------------
*/

function getThreatLevelFromScore(
  score
) {
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

/*
|--------------------------------------------------------------------------
| Get Minimum Score For Threat Level
|--------------------------------------------------------------------------
*/

function getMinimumScoreForThreat(
  threatLevel
) {
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

/*
|--------------------------------------------------------------------------
| Get Security Action
|--------------------------------------------------------------------------
*/

function getSecurityAction(
  threatLevel
) {
  switch (threatLevel) {

    case "SAFE":

      return {
        action: "ALLOW",

        message:
          "Prompt appears safe.",
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

        message:
          "High-risk prompt detected.",
      };


    case "CRITICAL":

      return {
        action:
          "BLOCK_AND_ALERT",

        message:
          "Critical security threat detected.",
      };


    default:

      return {
        action: "REVIEW",

        message:
          "Manual security review required.",
      };
  }
}

/*
|--------------------------------------------------------------------------
| Normalize Attack Types
|--------------------------------------------------------------------------
*/

function normalizeAttackTypes(
  attackType
) {
  if (
    typeof attackType !== "string"
  ) {
    return [];
  }

  if (
    attackType.trim() ===
    "Safe Prompt"
  ) {
    return [];
  }

  return attackType
    .split(",")
    .map(
      (item) =>
        item.trim()
    )
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| Combine Unique Values
|--------------------------------------------------------------------------
*/

function combineUnique(
  ...arrays
) {
  return [
    ...new Set(
      arrays
        .flat()
        .filter(
          Boolean
        )
        .map(
          (item) =>
            typeof item ===
            "string"
              ? item.trim()
              : item
        )
        .filter(Boolean)
    ),
  ];
}

/*
|--------------------------------------------------------------------------
| RESULT FUSION ENGINE
|--------------------------------------------------------------------------
*/

function fuseResults(
  localResult,
  aiResult
) {

  /*
  ------------------------------------------------------------------------
  | AI UNAVAILABLE
  ------------------------------------------------------------------------
  */

  if (!aiResult) {

    const threatLevel =
      normalizeThreatLevel(
        localResult.threatLevel
      );

    const riskScore =
      normalizeScore(
        localResult.riskScore
      );

    return {

      threatLevel,

      riskScore,

      confidence:
        normalizeScore(
          localResult.confidence
        ),

      engineUsed:
        "LOCAL_ENGINE",

      enginesAgree:
        null,

      aiInfluenced:
        false,
    };
  }

  /*
  ------------------------------------------------------------------------
  | Normalize AI
  ------------------------------------------------------------------------
  */

  const localThreat =
    normalizeThreatLevel(
      localResult.threatLevel
    );

  const aiThreat =
    normalizeThreatLevel(
      aiResult.threatLevel
    );

  const localRisk =
    normalizeScore(
      localResult.riskScore
    );

  const aiRisk =
    normalizeScore(
      aiResult.riskScore
    );

  const localConfidence =
    normalizeScore(
      localResult.confidence
    );

  const aiConfidence =
    normalizeScore(
      aiResult.confidence
    );

  /*
  ------------------------------------------------------------------------
  | Engine Agreement
  ------------------------------------------------------------------------
  */

  const enginesAgree =
    localThreat === aiThreat;

  /*
  ------------------------------------------------------------------------
  | Weighted Risk Score
  |
  | Local engine = 60%
  | Groq AI = 40%
  |
  | Local remains primary.
  ------------------------------------------------------------------------
  */

  let fusedRiskScore =
    Math.round(
      (
        localRisk * 0.6
      ) +
      (
        aiRisk * 0.4
      )
    );

  /*
  ------------------------------------------------------------------------
  | Strongest Threat
  ------------------------------------------------------------------------
  */

  const strongestThreat =
    threatPriority[
      aiThreat
    ] >
    threatPriority[
      localThreat
    ]
      ? aiThreat
      : localThreat;

  /*
  ------------------------------------------------------------------------
  | Keep Risk Score Consistent With Threat
  ------------------------------------------------------------------------
  */

  const minimumScore =
    getMinimumScoreForThreat(
      strongestThreat
    );

  fusedRiskScore =
    Math.max(
      fusedRiskScore,
      minimumScore
    );

  fusedRiskScore =
    Math.min(
      100,
      fusedRiskScore
    );

  /*
  ------------------------------------------------------------------------
  | Final Threat From Score
  ------------------------------------------------------------------------
  */

  let finalThreatLevel =
    getThreatLevelFromScore(
      fusedRiskScore
    );

  /*
  ------------------------------------------------------------------------
  | Never reduce below strongest detected threat
  ------------------------------------------------------------------------
  */

  if (
    threatPriority[
      strongestThreat
    ] >
    threatPriority[
      finalThreatLevel
    ]
  ) {
    finalThreatLevel =
      strongestThreat;

    fusedRiskScore =
      Math.max(
        fusedRiskScore,
        getMinimumScoreForThreat(
          strongestThreat
        )
      );
  }

  /*
  ------------------------------------------------------------------------
  | Confidence Fusion
  ------------------------------------------------------------------------
  */

  let finalConfidence;

  if (enginesAgree) {

    finalConfidence =
      Math.min(
        98,
        Math.round(
          (
            localConfidence +
            aiConfidence
          ) / 2
        ) + 5
      );

  } else {

    /*
    ----------------------------------------------------------------------
    | Disagreement reduces confidence
    ----------------------------------------------------------------------
    */

    finalConfidence =
      Math.min(
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

    threatLevel:
      finalThreatLevel,

    riskScore:
      fusedRiskScore,

    confidence:
      finalConfidence,

    engineUsed:
      "LOCAL_ENGINE + GROQ_AI",

    enginesAgree,

    aiInfluenced:
      true,
  };
}

/*
|--------------------------------------------------------------------------
| MAIN PROMPT ANALYSIS
|--------------------------------------------------------------------------
*/

export const analyzePrompt =
  async (
    prompt,
    userId
  ) => {

    const workflow = [];

    /*
    ------------------------------------------------------------------------
    | STEP 1
    | Validate Prompt
    ------------------------------------------------------------------------
    */

    if (
      !prompt ||
      typeof prompt !==
        "string" ||
      !prompt.trim()
    ) {
      throw new Error(
        "Valid prompt is required."
      );
    }

    workflow.push({
      step: 1,

      name:
        "Input Validation",

      status:
        "COMPLETED",

      description:
        "Prompt validated successfully.",
    });

    /*
    ------------------------------------------------------------------------
    | STEP 2
    | Preprocess Prompt
    ------------------------------------------------------------------------
    */

    const preprocessed =
      preprocessPrompt(
        prompt
      );

    workflow.push({
      step: 2,

      name:
        "Prompt Preprocessing",

      status:
        "COMPLETED",

      description:
        "Prompt features and indicators extracted.",
    });

    /*
    ------------------------------------------------------------------------
    | STEP 3
    | Local Detection
    ------------------------------------------------------------------------
    */

    const detection =
      detectAttack(
        preprocessed
      );

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
      step: 3,

      name:
        "Local Security Analysis",

      status:
        "COMPLETED",

      description:
        "Rule-based security detection completed.",

      result: {
        threatLevel:
          localResult.threatLevel,

        riskScore:
          localResult.riskScore,
      },
    });

    /*
    ------------------------------------------------------------------------
    | STEP 4
    | AI ANALYSIS
    ------------------------------------------------------------------------
    */

    let aiResult = null;

    try {

      aiResult =
        await analyzeWithGroq(
          prompt
        );

      if (aiResult) {

        workflow.push({
          step: 4,

          name:
            "Groq AI Security Analysis",

          status:
            "COMPLETED",

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
          step: 4,

          name:
            "Groq AI Security Analysis",

          status:
            "FALLBACK",

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
        step: 4,

        name:
          "Groq AI Security Analysis",

        status:
          "FALLBACK",

        description:
          "AI analysis failed. Local engine used as fallback.",
      });
    }

    /*
    ------------------------------------------------------------------------
    | STEP 5
    | Result Fusion
    ------------------------------------------------------------------------
    */

    const fusionResult =
      fuseResults(
        localResult,
        aiResult
      );

    workflow.push({
      step: 5,

      name:
        "Security Result Fusion",

      status:
        "COMPLETED",

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

    /*
    ------------------------------------------------------------------------
    | STEP 6
    | Combine Attack Types
    ------------------------------------------------------------------------
    */

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

    const detectedAttacks =
      combineUnique(
        localAttackTypes,
        aiAttackTypes
      );

    const finalAttackType =
      detectedAttacks.length > 0
        ? detectedAttacks.join(
            ", "
          )
        : "Safe Prompt";

    /*
    ------------------------------------------------------------------------
    | STEP 7
    | Combine Detection Evidence
    ------------------------------------------------------------------------
    */

    const aiKeywords =
      aiResult &&
      Array.isArray(
        aiResult.matchedKeywords
      )
        ? aiResult.matchedKeywords
        : [];

    const combinedMatchedPatterns =
      combineUnique(
        localResult.matchedPatterns,
        aiKeywords
      );

    /*
    ------------------------------------------------------------------------
    | STEP 8
    | Generate Recommendation
    ------------------------------------------------------------------------
    */

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

    /*
    ------------------------------------------------------------------------
    | Final recommendation remains deterministic.
    ------------------------------------------------------------------------
    */

    const recommendation =
      localRecommendation;

    /*
    ------------------------------------------------------------------------
    | STEP 9
    | Detection Reason
    ------------------------------------------------------------------------
    */

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
      aiResult?.detectionReason
    ) {

      detectionReasons.push(
        `AI analysis: ${aiResult.detectionReason.trim()}`
      );
    }

    const detectionReason =
      detectionReasons.length > 0
        ? detectionReasons.join(
            " "
          )
        : "No malicious indicators were detected.";

    /*
    ------------------------------------------------------------------------
    | STEP 10
    | Security Action
    ------------------------------------------------------------------------
    */

    const securityAction =
      getSecurityAction(
        fusionResult.threatLevel
      );

    workflow.push({
      step: 6,

      name:
        "Final Security Decision",

      status:
        "COMPLETED",

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

    /*
    ------------------------------------------------------------------------
    | STEP 11
    | Save Scan
    ------------------------------------------------------------------------
    */

    const scan =
      await prisma.promptScan.create({

        data: {

          prompt,

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

    /*
    ------------------------------------------------------------------------
    | RETURN COMPLETE ANALYSIS
    ------------------------------------------------------------------------
    */

    return {

      /*
      ----------------------------------------------------------------------
      | Scan Information
      ----------------------------------------------------------------------
      */

      id:
        scan.id,

      prompt:
        scan.prompt,

      createdAt:
        scan.createdAt,

      /*
      ----------------------------------------------------------------------
      | Final Security Result
      ----------------------------------------------------------------------
      */

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

      /*
      ----------------------------------------------------------------------
      | Backward Compatibility
      ----------------------------------------------------------------------
      */

      attackType:
        finalAttackType,

      threatLevel:
        fusionResult.threatLevel,

      confidence:
        fusionResult.confidence,

      riskScore:
        fusionResult.riskScore,

      recommendation,

      /*
      ----------------------------------------------------------------------
      | Workflow
      ----------------------------------------------------------------------
      */

      workflow,

      /*
      ----------------------------------------------------------------------
      | Local Analysis
      ----------------------------------------------------------------------
      */

      localAnalysis:
        localResult,

      /*
      ----------------------------------------------------------------------
      | AI Analysis
      ----------------------------------------------------------------------
      */

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

      /*
      ----------------------------------------------------------------------
      | Fusion Information
      ----------------------------------------------------------------------
      */

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

      /*
      ----------------------------------------------------------------------
      | Detection Evidence
      ----------------------------------------------------------------------
      */

      matchedPatterns:
        combinedMatchedPatterns,

      matchedKeywords:
        aiKeywords,

      detectedAttacks,

      detectionReason,

      /*
      ----------------------------------------------------------------------
      | Recommendations
      ----------------------------------------------------------------------
      */

      localRecommendation,

      aiRecommendation,

      /*
      ----------------------------------------------------------------------
      | Preprocessing Information
      ----------------------------------------------------------------------
      */

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

/*
|--------------------------------------------------------------------------
| SCAN HISTORY
|--------------------------------------------------------------------------
*/

export const getScanHistory =
  async (
    userId
  ) => {

    return await prisma.promptScan.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });
  };