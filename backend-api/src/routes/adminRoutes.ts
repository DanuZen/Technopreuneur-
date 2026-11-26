import { Router, Response } from "express";
import {
  authenticateJWT,
  AuthenticatedRequest,
  requireRole,
} from "../middlewares/auth";
import { getDb, saveDb } from "../store/dataStore";

const router = Router();

router.use(authenticateJWT, requireRole(["admin"]));

// GET /api/admin/overview (Hanya data agregat ekosistem + status audit calon mitra)
router.get("/overview", (_req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const realJobseekers = db.users.filter((u) => u.role === "jobseeker").length;
  const verifiedCompanies = db.companies.filter((c) => c.status === "verified").length;
  const pendingAudits = db.companies.filter((c) => c.status === "pending").length;
  const incompleteAudits = db.companies.filter((c) => c.status === "incomplete").length;

  return res.json({
    totalJobseekers: 1247 + realJobseekers,
    totalPartnerCompanies: 23 + verifiedCompanies,
    pendingCompanyAudits: pendingAudits,
    verifiedCompanyAudits: verifiedCompanies,
    incompleteCompanyAudits: incompleteAudits,
    standards: db.standards,
    weeklyPipeline: db.weeklyPipeline,
  });
});

// GET /api/admin/partners (Daftar company untuk audit & verifikasi pendaftaran)
router.get("/partners", (_req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const list = db.companies.map((c) => ({
    id: c.id,
    company: c.companyName,
    sector: c.industry,
    location: c.city,
    status: c.status,
    legalityDoc: c.legalityDoc,
    pdpCompliance: c.pdpCompliance,
    note: c.note,
  }));
  return res.json(list);
});

// PATCH /api/admin/partners/:id/audit
router.patch("/partners/:id/audit", (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const { status, note } = req.body || {};
  if (!["verified", "pending", "incomplete"].includes(status)) {
    return res.status(400).json({ message: "Status keputusan audit tidak valid." });
  }

  const company = db.companies.find((c) => c.id === req.params.id);
  if (!company) {
    return res.status(404).json({ message: "Data perusahaan tidak ditemukan." });
  }

  company.status = status;
  if (status === "verified") {
    company.legalityDoc = "NIB & NPWP Terverifikasi";
    company.pdpCompliance = "Blind Screening Aktif";
    company.note =
      note ||
      "Memenuhi seluruh standar kemitraan Pasbana dan siap mengelola rekrutmen secara mandiri.";
  } else if (status === "incomplete") {
    company.note =
      note ||
      "Belum memenuhi ambang standar legalitas atau kepatuhan UU PDP platform.";
  } else if (note) {
    company.note = note;
  }

  saveDb(db);
  return res.json({
    id: company.id,
    company: company.companyName,
    sector: company.industry,
    location: company.city,
    status: company.status,
    legalityDoc: company.legalityDoc,
    pdpCompliance: company.pdpCompliance,
    note: company.note,
  });
});

// GET /api/admin/standards
router.get("/standards", (_req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  return res.json(db.standards);
});

// PUT /api/admin/standards
router.put("/standards", (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const body = req.body || {};

  db.standards = {
    minAtsScore:
      typeof body.minAtsScore === "number"
        ? body.minAtsScore
        : db.standards.minAtsScore,
    maxCvSizeMb:
      typeof body.maxCvSizeMb === "number"
        ? body.maxCvSizeMb
        : db.standards.maxCvSizeMb,
    slaSeconds:
      typeof body.slaSeconds === "number"
        ? body.slaSeconds
        : db.standards.slaSeconds,
    allowedFormat:
      body.allowedFormat === "pdf_only" ? "pdf_only" : "pdf_docx",
    blindScreeningRequired:
      typeof body.blindScreeningRequired === "boolean"
        ? body.blindScreeningRequired
        : db.standards.blindScreeningRequired,
    requireFullLegality:
      typeof body.requireFullLegality === "boolean"
        ? body.requireFullLegality
        : db.standards.requireFullLegality,
    retentionDays: String(body.retentionDays || db.standards.retentionDays),
  };

  saveDb(db);
  return res.json(db.standards);
});

// GET /api/admin/reports
router.get("/reports", (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const period = String(req.query.period || "bulan");
  const realJobseekers = db.users.filter((u) => u.role === "jobseeker").length;
  const verifiedCompanies = db.companies.filter((c) => c.status === "verified").length;
  const totalJobseekers = 1247 + realJobseekers;
  const totalPartnerCompanies = 23 + verifiedCompanies;

  const periodLabel =
    period === "kuartal"
      ? "Q4 2026 (Okt - Des)"
      : period === "tahun"
      ? "Tahun Penuh 2026"
      : "November 2026";

  return res.json({
    periodLabel,
    totalJobseekers,
    totalPartnerCompanies,
    totalPartnerAudits: db.companies.length + 23,
    pdpAnonymizationRate: db.standards.blindScreeningRequired ? 100 : 85,
    monthlyBreakdown: [
      { month: "Juni 2026", jobseekers: 820, companies: 14, auditPassRate: "93%" },
      { month: "Juli 2026", jobseekers: 910, companies: 16, auditPassRate: "94%" },
      { month: "Agustus 2026", jobseekers: 985, companies: 18, auditPassRate: "95%" },
      { month: "September 2026", jobseekers: 1070, companies: 20, auditPassRate: "96%" },
      { month: "Oktober 2026", jobseekers: 1160, companies: 22, auditPassRate: "98%" },
      {
        month: "November 2026",
        jobseekers: totalJobseekers,
        companies: totalPartnerCompanies,
        auditPassRate: "100%",
      },
    ],
  });
});

export default router;
