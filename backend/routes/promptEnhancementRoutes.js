import express from "express";
import {
  enhancePromptController,
} from "../controllers/promptEnhancementController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
============================================================
PROMPT ENHANCEMENT ROUTE
============================================================

POST /api/ai/enhance

Flow:

Prompt
  ↓
Authentication
  ↓
Prompt Enhancement Controller
  ↓
Backend Security Analysis
  ↓
Security Decision
  ↓
Allowed → Prompt Enhancement Service
  ↓
Groq
  ↓
Improved Prompt

High-risk and critical prompts are blocked by the
backend controller before enhancement.
============================================================
*/

router.post(
  "/enhance",
  authMiddleware,
  enhancePromptController
);

export default router;