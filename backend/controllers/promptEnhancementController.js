import { enhancePrompt } from "../services/promptEnhancementService.js";

/*
============================================================
PROMPT ENHANCEMENT CONTROLLER
============================================================

Purpose:
- Receives a prompt from the frontend.
- Calls the Prompt Enhancement Engine.
- Returns the original and improved prompt.
- This controller does NOT perform security analysis.

IMPORTANT:
Security analysis must happen before this controller is
called from the AI Hub workflow.
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

    /*
    --------------------------------------------------------
    ENHANCE PROMPT
    --------------------------------------------------------
    */

    const result = await enhancePrompt(
      prompt.trim()
    );

    /*
    --------------------------------------------------------
    SUCCESS RESPONSE
    --------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

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