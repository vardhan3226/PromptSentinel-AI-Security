import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import promptEnhancementRoutes from "./routes/promptEnhancementRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

/*
============================================================
CORS
============================================================
*/

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/*
============================================================
BODY PARSER
============================================================
*/

app.use(express.json());

/*
============================================================
HEALTH CHECK
============================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PromptSentinel Backend is Running 🚀",
  });
});

/*
============================================================
API ROUTES
============================================================
*/

app.use("/api/auth", authRoutes);

app.use("/api/scan", scanRoutes);

/*
AI HUB
/api/ai/chat
*/
app.use("/api/ai", aiRoutes);

/*
PROMPT ENHANCEMENT
/api/ai/enhance
*/
app.use(
  "/api/ai",
  promptEnhancementRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

/*
============================================================
404 HANDLER
============================================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
============================================================
GLOBAL ERROR HANDLER
============================================================
*/

app.use(
  (err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
);

/*
============================================================
SERVER
============================================================
*/

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});