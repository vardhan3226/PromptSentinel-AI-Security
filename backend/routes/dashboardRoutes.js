import express from "express";
import {
  dashboardStats,
  dashboardBenchmark,
} from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  dashboardStats
);

router.get(
  "/benchmark",
  authMiddleware,
  dashboardBenchmark
);

export default router;