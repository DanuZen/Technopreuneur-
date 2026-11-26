import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getDb, saveDb } from "../store/dataStore";
import {
  authenticateJWT,
  AuthenticatedRequest,
  AuthUserPayload,
  requireRole,
} from "../middlewares/auth";
import {
  embedTextsWithBackendAi,
  rankJobsWithBackendAi,
} from "../services/aiService";

const router = Router();

function getOptionalUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_jwt_key_careermatch_2026"
    ) as AuthUserPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET /api/jobs/recommendations (Pencocokan CV pengguna dengan lowongan aktif via backend-ai stage2)
router.get("/recommendations", async (req: Request, res: Response) => {
  const db = getDb();
  const userId = getOptionalUserId(req) || "usr-1";
  const latestCv = db.cvs.find((c) => c.userId === userId) || db.cvs[0];
  const profile = db.profiles.find((p) => p.userId === userId);

  const verifiedCompanyIds = new Set(
    db.companies.filter((c) => c.status === "verified").map((c) => c.id)
  );
  const companyKeywordsById = new Map(
    db.companies.map((c) => [c.id, c.keywords || ""])
  );

  const activeJobs = db.jobs.filter(
    (j) => j.active && (j.source !== "internal" || verifiedCompanyIds.has(j.companyId))
  );

  const cvText =
    latestCv?.cvTextExcerpt ||
    (profile
      ? [
          profile.fullName,
          profile.headline,
          profile.summary,
          profile.skills.technical.join(", "),
          profile.skills.soft.join(", "),
          profile.skills.tools.join(", "),
        ].join(". ")
      : "");

  const ranked = await rankJobsWithBackendAi(
    cvText,
    activeJobs,
    companyKeywordsById,
    latestCv?.cvEmbedding
  );

  return res.json(ranked);
});

// GET /api/jobs (Pencarian & filter lowongan aktif)
router.get("/", async (req: Request, res: Response) => {
  const db = getDb();
  const keyword = String(req.query.keyword || "").trim().toLowerCase();
  const location = String(req.query.location || "").trim().toLowerCase();
  const workType = String(req.query.workType || "").trim().toLowerCase();

  const verifiedCompanyIds = new Set(
    db.companies.filter((c) => c.status === "verified").map((c) => c.id)
  );
  const companyKeywordsById = new Map(
    db.companies.map((c) => [c.id, c.keywords || ""])
  );

  let filtered = db.jobs.filter(
    (j) => j.active && (j.source !== "internal" || verifiedCompanyIds.has(j.companyId))
  );

  if (keyword) {
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(keyword) ||
        j.companyName.toLowerCase().includes(keyword) ||
        j.description.toLowerCase().includes(keyword) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(keyword))
    );
  }
  if (location) {
    filtered = filtered.filter((j) =>
      j.location.toLowerCase().includes(location)
    );
  }
  if (workType && workType !== "all") {
    filtered = filtered.filter(
      (j) => j.workType.toLowerCase() === workType
    );
  }

  const userId = getOptionalUserId(req) || "usr-1";
  const latestCv = db.cvs.find((c) => c.userId === userId);
  if (latestCv?.cvTextExcerpt) {
    const ranked = await rankJobsWithBackendAi(
      latestCv.cvTextExcerpt,
      filtered,
      companyKeywordsById,
      latestCv.cvEmbedding
    );
    return res.json(ranked);
  }

  return res.json(filtered);
});

// POST /api/jobs (Employer terverifikasi membuat lowongan)
router.post(
  "/",
  authenticateJWT,
  requireRole(["employer"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const company = db.companies.find((c) => c.ownerUserId === req.user?.userId);
    if (!company) {
      return res.status(404).json({ message: "Profil perusahaan tidak ditemukan." });
    }
    if (company.status !== "verified") {
      return res.status(403).json({
        message: "Akun perusahaan Anda masih menunggu audit dan verifikasi Admin.",
      });
    }

    const { title, location, workType, salaryRange, description, requiredSkills } =
      req.body || {};
    if (!title) {
      return res.status(400).json({ message: "Judul posisi lowongan wajib diisi." });
    }

    const companyKw = company.keywords
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newJob = {
      id: `job-${Date.now()}`,
      companyId: company.id,
      companyName: company.companyName,
      title: String(title).trim(),
      location: String(location || company.city || "Indonesia").trim(),
      workType: (workType || "full-time") as
        | "full-time"
        | "part-time"
        | "internship"
        | "contract"
        | "remote",
      salaryRange: salaryRange || undefined,
      source: "internal" as const,
      description:
        description ||
        `Posisi ${title} pada ${company.companyName} (${company.industry}).`,
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : companyKw.slice(0, 6),
      active: true,
      postedAt: new Date().toISOString(),
    };

    const jobSummaryText = `${newJob.title}. ${newJob.description}. Keahlian: ${newJob.requiredSkills.join(", ")}`;
    const vectors = await embedTextsWithBackendAi([jobSummaryText]);
    const enrichedJob = {
      ...newJob,
      ...(vectors && vectors[0] ? { jobEmbedding: vectors[0] } : {}),
    };

    db.jobs.unshift(enrichedJob);
    saveDb(db);

    return res.status(201).json(enrichedJob);
  }
);

export default router;
