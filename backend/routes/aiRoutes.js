import express from "express";

import {
  chatWithAI,
  getAIConversations,
} from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/chat",
  authMiddleware,
  chatWithAI
);

router.get(
  "/conversations",
  authMiddleware,
  getAIConversations
);

export default router;