
import {
  analyzePrompt,
  getScanHistory,
} from "../services/scanService.js";

import testAttackRobustness from "../services/robustnessTestService.js";

// Validate prompt input before processing
const validatePrompt = (prompt) => {
  if (typeof prompt !== "string") {
    return {
      valid: false,
      message: "Prompt must be a string.",
    };
  }

  if (prompt.trim() === "") {
    return {
      valid: false,
      message: "Prompt is required.",
    };
  }

  return {
    valid: true,
    prompt: prompt.trim(),
  };
};

export const scanPrompt = async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    const validation = validatePrompt(prompt);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const result = await analyzePrompt(
      validation.prompt,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Scan Prompt Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const scanHistory = async (req, res) => {
  try {
    const history = await getScanHistory(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(
      "Scan History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const scanRobustness = async (
  req,
  res
) => {
  try {
    const prompt = req.body?.prompt;

    const validation = validatePrompt(prompt);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const result = testAttackRobustness(
      validation.prompt
    );

    return res.status(200).json({
      success: true,
      robustness: result,
    });
  } catch (error) {
    console.error(
      "Robustness Test Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Robustness test failed.",
    });
  }
};