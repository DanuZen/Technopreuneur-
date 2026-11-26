import { Router, Response } from "express";
import {
  authenticateJWT,
  AuthenticatedRequest,
  requireRole,
} from "../middlewares/auth";
import { getDb, saveDb } from "../store/dataStore";
import { rankJobsWithBackendAi } from "../services/aiService";

const router = Router();

// POST /api/applications
router.post("/", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const userId = req.user?.userId || "";
  const { jobId, coverLetter } = req.body || {};

  if (!jobId) {
    return res.status(400).json({ message: "ID lowongan wajib disertakan." });
  }

  const job = db.jobs.find((j) => j.id === jobId);
  if (!job || !job.active) {
    return res.status(404).json({ message: "Lowongan tidak ditemukan atau sudah ditutup." });
  }

  const duplicate = db.applications.find(
    (a) => a.jobId === jobId && a.userId === userId
  );
  if (duplicate) {
    return res.json({ success: true, application: duplicate });
  }

  const latestCv = db.cvs.find((c) => c.userId === userId);
  const profile = db.profiles.find((p) => p.userId === userId);
  const company = db.companies.find((c) => c.id === job.companyId);

  let matchScore = latestCv?.overallScore || 82;
  let matchReason = "Profil dan keahlian sesuai dengan kebutuhan posisi.";

  if (latestCv?.cvTextExcerpt) {
    const ranked = await rankJobsWithBackendAi(
      latestCv.cvTextExcerpt,
      [job],
      new Map([[job.companyId, company?.keywords || ""]])
    );
    if (ranked[0]) {
      matchScore = ranked[0].matchScore || matchScore;
      matchReason = ranked[0].matchReason?.[0] || matchReason;
    }
  }

  const codeNumber = 700 + ((db.applications.length * 37 + 41) % 290);
  const eduItem = profile?.education?.[0];
  const expItem = profile?.experiences?.[0];

  const newApp = {
    id: `app-${Date.now()}`,
    jobId: job.id,
    userId,
    cvId: latestCv?.cvId,
    codeName: `Kandidat #ATS-${codeNumber}`,
    roleApplied: job.title,
    atsScore: matchScore,
    matchReason,
    coverLetter: coverLetter || undefined,
    status: "submitted" as const,
    candidateSummary: {
      headline: profile?.headline || "Kandidat Terdaftar",
      education: eduItem
        ? `${eduItem.degree} ${eduItem.field} - ${eduItem.institution} (${eduItem.graduationYear})`
        : "Pendidikan Tersimpan di Sistem",
      skills: profile?.skills?.technical || [],
      experienceHighlight:
        expItem?.description || "Pengalaman proyek tersimpan di sistem.",
      cvSource: latestCv?.source || ("upload" as const),
    },
    createdAt: new Date().toISOString(),
  };

  db.applications.unshift(newApp);
  saveDb(db);

  return res.status(201).json({ success: true, application: newApp });
});

// GET /api/applications/me
router.get("/me", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const list = db.applications.filter((a) => a.userId === req.user?.userId);
  return res.json(list);
});

// GET /api/applications/job/:jobId
router.get(
  "/job/:jobId",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const list = db.applications
      .filter((a) => a.jobId === req.params.jobId)
      .sort((a, b) => b.atsScore - a.atsScore);
    return res.json({ applicants: list });
  }
);

export default router;
