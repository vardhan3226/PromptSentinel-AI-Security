import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import promptEnhancementRoutes from "./routes/promptEnhancementRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

/* =========================================================
   CORS CONFIGURATION
   ========================================================= */

const frontendOrigin =
  process.env.FRONTEND_ORIGIN ||
  "http://localhost:5173";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);

/* =========================================================
   REQUEST BODY LIMIT
   Maximum JSON request size: 1 MB
   ========================================================= */

app.use(
  express.json({
    limit: "1mb",
  })
);

/* =========================================================
   API RATE LIMITING
   100 requests per 15 minutes per IP
   ========================================================= */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PromptSentinel Backend is Running 🚀",
  });
});

/* =========================================================
   API ROUTES
   ========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/scan", scanRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/ai", promptEnhancementRoutes);

app.use("/api/dashboard", dashboardRoutes);

/* =========================================================
   404 HANDLER
   ========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  /* -----------------------------------------
     Request body too large
     ----------------------------------------- */

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message:
        "Request body is too large. Maximum allowed size is 1 MB.",
    });
  }

  /* -----------------------------------------
     Invalid JSON
     ----------------------------------------- */

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  /* -----------------------------------------
     Generic server error
     ----------------------------------------- */

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* =========================================================
   SERVER START
   ========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});