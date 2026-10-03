import { enhancePrompt } from "../services/promptEnhancementService.js";
import { analyzePrompt } from "../services/scanService.js";

/*
============================================================
PROMPT ENHANCEMENT CONTROLLER
============================================================

Purpose:
- Receives a prompt from the frontend.
- Performs backend security analysis first.
- Blocks high-risk and critical prompts.
- Enhances only prompts allowed by the security decision.
- Returns the original and improved prompt.

IMPORTANT:
Security analysis is enforced on the backend.
The frontend must not be trusted to perform this check.
============================================================
*/

export const enhancePromptController = async (
  req,
  res
) => {
  try {
    const { prompt } = req.body;

    /*
    --------------------------------------------------------
    VALIDATION
    --------------------------------------------------------
    */

    if (
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const cleanPrompt =
      prompt.trim();

    /*
    --------------------------------------------------------
    BACKEND SECURITY GATE
    --------------------------------------------------------
    */

    const securityResult =
      await analyzePrompt(
        cleanPrompt,
        req.user.id,
        false
      );

    const securityDecision =
      securityResult?.finalResult;

    const securityAction =
      securityDecision?.action;

    /*
    --------------------------------------------------------
    BLOCK HIGH-RISK / CRITICAL PROMPTS
    --------------------------------------------------------
    */

    if (
      securityAction === "BLOCK" ||
      securityAction === "BLOCK_AND_ALERT"
    ) {
      return res.status(403).json({
        success: false,

        message:
          "Prompt enhancement blocked by PromptSentinel security analysis.",

        security: {
          attackType:
            securityDecision.attackType,

          threatLevel:
            securityDecision.threatLevel,

          riskScore:
            securityDecision.riskScore,

          confidence:
            securityDecision.confidence,

          action:
            securityDecision.action,

          actionMessage:
            securityDecision.actionMessage,

          recommendation:
            securityDecision.recommendation,
        },
      });
    }

    /*
    --------------------------------------------------------
    ENHANCE ONLY AFTER SECURITY APPROVAL
    --------------------------------------------------------
    */

    const result =
      await enhancePrompt(
        cleanPrompt
      );

    /*
    --------------------------------------------------------
    SUCCESS RESPONSE
    --------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      security: {
        threatLevel:
          securityDecision.threatLevel,

        riskScore:
          securityDecision.riskScore,

        confidence:
          securityDecision.confidence,

        action:
          securityDecision.action,
      },

      enhancement: {
        originalPrompt:
          result.originalPrompt,

        improvedPrompt:
          result.improvedPrompt,

        needsImprovement:
          result.needsImprovement,

        qualityScore:
          result.qualityScore,

        changes:
          result.changes,
      },
    });
  } catch (error) {
    console.error(
      "Prompt enhancement controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to enhance prompt.",
    });
  }
};