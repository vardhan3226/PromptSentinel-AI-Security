import express from "express";

import {
  scanPrompt,
  scanHistory,
  scanRobustness,
} from "../controllers/scanController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  scanPrompt
);

router.get(
  "/history",
  authMiddleware,
  scanHistory
);

router.post(
  "/robustness",
  authMiddleware,
  scanRobustness
);

export default router;