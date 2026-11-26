import { Router, Response } from "express";
import {
  authenticateJWT,
  AuthenticatedRequest,
  requireRole,
} from "../middlewares/auth";
import { getDb, saveDb } from "../store/dataStore";

const router = Router();

function getEmployerCompany(userId?: string) {
  const db = getDb();
  return (
    db.companies.find((c) => c.ownerUserId === userId) || db.companies[0]
  );
}

// GET /api/company/jobs
router.get(
  "/jobs",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const company = getEmployerCompany(req.user?.userId);
    const jobs = db.jobs
      .filter((j) => j.companyId === company.id)
      .map((j) => {
        const applicantsCount = db.applications.filter(
          (a) => a.jobId === j.id
        ).length;
        const normalizedType =
          j.workType === "internship"
            ? "Internship"
            : j.workType === "contract"
            ? "Contract"
            : "Full-time";
        return {
          id: j.id,
          title: j.title,
          location: j.location,
          type: normalizedType,
          applicants: applicantsCount,
          active: j.active,
        };
      });
    return res.json(jobs);
  }
);

// POST /api/company/jobs
router.post(
  "/jobs",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const company = getEmployerCompany(req.user?.userId);

    if (company.status !== "verified") {
      return res.status(403).json({
        message: "Perusahaan Anda masih dalam antrean audit dan verifikasi Admin.",
      });
    }

    const { title, location, type, description } = req.body || {};
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Nama posisi lowongan wajib diisi." });
    }

    const rawType = String(type || "Full-time").toLowerCase();
    const workType: "full-time" | "contract" | "internship" =
      rawType === "contract"
        ? "contract"
        : rawType === "internship"
        ? "internship"
        : "full-time";

    const kwSkills = (company.keywords || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newJob = {
      id: `job-${Date.now()}`,
      companyId: company.id,
      companyName: company.companyName,
      title: String(title).trim(),
      location: String(location || company.city || "Indonesia (Remote)").trim(),
      workType,
      source: "internal" as const,
      description:
        description ||
        `Lowongan ${title} di ${company.companyName}. Membutuhkan kompetensi ${
          kwSkills.join(", ") || "relevan"
        }.`,
      requiredSkills: kwSkills.length > 0 ? kwSkills : ["Komunikasi", "Analisis Data"],
      active: true,
      postedAt: new Date().toISOString(),
    };

    db.jobs.unshift(newJob);
    saveDb(db);

    return res.status(201).json({
      id: newJob.id,
      title: newJob.title,
      location: newJob.location,
      type: type || "Full-time",
      applicants: 0,
      active: true,
    });
  }
);

// PATCH /api/company/jobs/:id
router.patch(
  "/jobs/:id",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const company = getEmployerCompany(req.user?.userId);
    const job = db.jobs.find(
      (j) => j.id === req.params.id && j.companyId === company.id
    );
    if (!job) {
      return res.status(404).json({ message: "Lowongan tidak ditemukan." });
    }

    if (typeof req.body?.active === "boolean") {
      job.active = req.body.active;
    } else {
      job.active = !job.active;
    }
    saveDb(db);

    const applicantsCount = db.applications.filter((a) => a.jobId === job.id).length;
    return res.json({
      id: job.id,
      title: job.title,
      location: job.location,
      type:
        job.workType === "internship"
          ? "Internship"
          : job.workType === "contract"
          ? "Contract"
          : "Full-time",
      applicants: applicantsCount,
      active: job.active,
    });
  }
);

// GET /api/company/applicants
router.get(
  "/applicants",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const company = getEmployerCompany(req.user?.userId);
    const companyJobIds = new Set(
      db.jobs.filter((j) => j.companyId === company.id).map((j) => j.id)
    );
    const statusFilter = String(req.query.status || "all").toLowerCase();
    const blindMode = db.standards.blindScreeningRequired;

    let list = db.applications.filter((a) => companyJobIds.has(a.jobId));
    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }

    const mapped = list
      .sort((a, b) => b.atsScore - a.atsScore)
      .map((a) => {
        const user = db.users.find((u) => u.id === a.userId);
        return {
          id: a.id,
          codeName: blindMode ? a.codeName : user?.name || a.codeName,
          roleApplied: a.roleApplied,
          atsScore: a.atsScore,
          matchReason: a.matchReason,
          status: a.status,
          candidateSummary: a.candidateSummary,
        };
      });

    return res.json(mapped);
  }
);

// PATCH /api/company/applicants/:id/status
router.patch(
  "/applicants/:id/status",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const { status } = req.body || {};
    if (!["submitted", "reviewed", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status pelamar tidak valid." });
    }

    const appItem = db.applications.find((a) => a.id === req.params.id);
    if (!appItem) {
      return res.status(404).json({ message: "Data pelamar tidak ditemukan." });
    }

    appItem.status = status;
    saveDb(db);
    return res.json(appItem);
  }
);

// GET /api/company/profile
router.get(
  "/profile",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const company = getEmployerCompany(req.user?.userId);
    return res.json(company);
  }
);

// PUT /api/company/profile
router.put(
  "/profile",
  authenticateJWT,
  requireRole(["employer"]),
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const company = getEmployerCompany(req.user?.userId);
    const { companyName, industry, website, city, keywords, description } =
      req.body || {};

    if (companyName !== undefined) company.companyName = String(companyName).trim();
    if (industry !== undefined) company.industry = String(industry).trim();
    if (website !== undefined) company.website = String(website).trim();
    if (city !== undefined) company.city = String(city).trim();
    if (keywords !== undefined) company.keywords = String(keywords).trim();
    if (description !== undefined) company.description = String(description).trim();

    // Sinkronkan nama perusahaan pada lowongan miliknya
    for (const j of db.jobs) {
      if (j.companyId === company.id) {
        j.companyName = company.companyName;
      }
    }

    saveDb(db);
    return res.json(company);
  }
);

export default router;
