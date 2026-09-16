import express from "express";
import {
  scanPrompt,
  scanHistory,
} from "../controllers/scanController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, scanPrompt);

router.get("/history", authMiddleware, scanHistory);

export default router;