import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import cvRoutes from "./routes/cvRoutes";
import profileRoutes from "./routes/profileRoutes";
import companyRoutes from "./routes/companyRoutes";
import adminRoutes from "./routes/adminRoutes";
import { checkAiHealth } from "./services/aiService";
import { isPostgresAvailable } from "./config/db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin", adminRoutes);

// Health Check (termasuk status konektivitas ke backend-ai & PostgreSQL)
app.get("/health", async (_req: Request, res: Response) => {
  const [aiStatus, pgUp] = await Promise.all([
    checkAiHealth(),
    isPostgresAvailable(),
  ]);

  res.json({
    status: "healthy",
    service: "backend-api",
    storageMode: pgUp ? "postgresql" : "local-json-vault",
    aiService: aiStatus,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[Backend-API] Server running on http://localhost:${PORT}`);
});
