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

Full endpoint:

POST /api/prompt/enhance

Flow:

Prompt Scanner
      ↓
Security Analysis
      ↓
Allowed Prompt
      ↓
/api/prompt/enhance
      ↓
Authentication
      ↓
Prompt Enhancement Controller
      ↓
Prompt Enhancement Service
      ↓
Groq
      ↓
Improved Prompt
============================================================
*/

router.post(
  "/enhance",
  authMiddleware,
  enhancePromptController
);

export default router;