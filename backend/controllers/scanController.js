import {
  analyzePrompt,
  getScanHistory,
} from "../services/scanService.js";

export const scanPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const result = await analyzePrompt(
      prompt,
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