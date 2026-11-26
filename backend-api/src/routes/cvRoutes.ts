import fs from "fs";
import path from "path";
import { Router, Response } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import {
  getDb,
  saveDb,
  StoredCV,
  UPLOADS_DIR,
} from "../store/dataStore";
import { AuthUserPayload, AuthenticatedRequest, authenticateJWT } from "../middlewares/auth";
import { analyzeCvWithBackendAi } from "../services/aiService";
import { buildDocxFromLines } from "../utils/docxBuilder";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

function resolveOptionalUser(req: AuthenticatedRequest): AuthUserPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_jwt_key_careermatch_2026"
    ) as AuthUserPayload;
  } catch {
    return null;
  }
}

// POST /api/cvs/upload (Terhubung ke backend-ai /internal/v1/cv/analyze)
router.post(
  "/upload",
  upload.single("cv"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const db = getDb();
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "Berkas CV wajib diunggah." });
      }

      const maxBytes = db.standards.maxCvSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        return res.status(413).json({
          message: `Ukuran berkas melebihi standar platform (${db.standards.maxCvSizeMb} MB).`,
        });
      }

      const ext = path.extname(file.originalname || "").toLowerCase();
      if (
        db.standards.allowedFormat === "pdf_only" &&
        ext !== ".pdf"
      ) {
        return res.status(415).json({
          message: "Standar platform saat ini hanya mengizinkan format PDF digital.",
        });
      }
      if (ext !== ".pdf" && ext !== ".docx") {
        return res.status(415).json({
          message: "Format berkas tidak didukung. Gunakan PDF atau DOCX.",
        });
      }

      const optUser = resolveOptionalUser(req);
      const dbUser = optUser
        ? db.users.find((u) => u.id === optUser.userId)
        : db.users[0];

      // Simpan salinan berkas ke vault lokal
      const cvId = `cv-${Date.now()}`;
      const safeFileName = `${cvId}${ext}`;
      const savedPath = path.join(UPLOADS_DIR, safeFileName);
      fs.writeFileSync(savedPath, file.buffer);

      // Panggil layanan backend-ai
      const mapped = await analyzeCvWithBackendAi({
        buffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fallbackName: dbUser?.name || "Kandidat Pasbana",
        fallbackEmail: dbUser?.email || "kandidat@pasbana.ai",
      });

      const userId = dbUser?.id || "usr-1";
      const profileWithUser = {
        userId,
        ...mapped.profile,
      };

      const storedCv: StoredCV = {
        cvId,
        userId,
        fileName: file.originalname,
        storedFilePath: savedPath,
        source: "upload",
        overallScore: mapped.overallScore,
        dimensions: mapped.dimensions,
        strengths: mapped.strengths,
        weaknesses: mapped.weaknesses,
        recommendations: mapped.recommendations,
        profile: profileWithUser,
        isScannedImageWarning: mapped.isScannedImageWarning,
        cvTextExcerpt: mapped.sanitizedText.slice(0, 8000),
        cvEmbedding: mapped.cvEmbedding,
        createdAt: new Date().toISOString(),
      };

      db.cvs.unshift(storedCv);

      const existingIdx = db.profiles.findIndex((p) => p.userId === userId);
      if (existingIdx >= 0) {
        db.profiles[existingIdx] = profileWithUser;
      } else {
        db.profiles.push(profileWithUser);
      }

      if (dbUser) {
        dbUser.hasCompletedCvCheck = true;
      }

      // Perbarui statistik harian pipeline AI Admin
      const todayStat = db.weeklyPipeline[db.weeklyPipeline.length - 1];
      if (todayStat) {
        todayStat.cv += 1;
        if (storedCv.overallScore >= db.standards.minAtsScore) {
          todayStat.pass += 1;
        }
      }

      saveDb(db);

      return res.json({
        cvId: storedCv.cvId,
        fileName: storedCv.fileName,
        overallScore: storedCv.overallScore,
        dimensions: storedCv.dimensions,
        strengths: storedCv.strengths,
        weaknesses: storedCv.weaknesses,
        recommendations: storedCv.recommendations,
        profile: storedCv.profile,
        isScannedImageWarning: storedCv.isScannedImageWarning,
      });
    } catch (err) {
      const status =
        (err as Error & { statusCode?: number }).statusCode || 422;
      return res.status(status).json({
        message:
          err instanceof Error
            ? err.message
            : "Gagal menganalisis berkas CV.",
      });
    }
  }
);

// POST /api/cvs/from-questionnaire (Bangun .docx standar ATS -> panggil backend-ai)
router.post(
  "/from-questionnaire",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const data = req.body || {};
      const db = getDb();
      const optUser = resolveOptionalUser(req);
      const dbUser = optUser
        ? db.users.find((u) => u.id === optUser.userId)
        : db.users[0];
      const userId = dbUser?.id || "usr-1";

      const lines = [
        data.fullName || dbUser?.name || "Kandidat Pasbana",
        `${data.email || dbUser?.email || "kandidat@pasbana.ai"}${
          data.phone ? ` | ${data.phone}` : ""
        }${data.portfolioLink ? ` | ${data.portfolioLink}` : ""}`,
        "Ringkasan Profil",
        `Lulusan ${data.educationLevel || "S1"} ${data.major || ""} dari ${
          data.institution || "Perguruan Tinggi"
        } yang berfokus pada posisi ${data.targetRole || "Profesional Muda"}.`,
        "Pendidikan",
        `${data.educationLevel || "S1"} ${data.major || "Teknologi"} - ${
          data.institution || "Perguruan Tinggi"
        } (${data.graduationYear || "2026"})`,
        "Pengalaman Kerja",
        data.experienceSummary ||
          "Mengembangkan proyek kolaboratif dengan peningkatan efisiensi terukur sebesar 30%.",
        "Keahlian",
        `Keahlian Teknis: ${data.technicalSkills || "Analisis Data, Komunikasi"}`,
        `Soft Skills: ${data.softSkills || "Komunikasi, Kepemimpinan"}`,
      ];

      const docxBuffer = buildDocxFromLines(lines);
      const cvId = `cv-gen-${Date.now()}`;
      const savedPath = path.join(UPLOADS_DIR, `${cvId}.docx`);
      fs.writeFileSync(savedPath, docxBuffer);

      const mapped = await analyzeCvWithBackendAi({
        buffer: docxBuffer,
        fileName: `${(data.fullName || "CV-Onboarding").replace(/\s+/g, "-")}.docx`,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        jdKeywords: data.technicalSkills || undefined,
        fallbackName: data.fullName || dbUser?.name || "Kandidat Pasbana",
        fallbackEmail: data.email || dbUser?.email || "kandidat@pasbana.ai",
      });

      const techSkills = String(data.technicalSkills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const softSkills = String(data.softSkills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const structuredProfile = {
        userId,
        fullName: data.fullName || mapped.profile.fullName,
        headline: data.targetRole || mapped.profile.headline,
        contactEmail: data.email || mapped.profile.contactEmail,
        city: "Indonesia",
        seniorityLevel: "Junior / Fresh Graduate",
        summary: lines[3],
        skills: {
          technical:
            techSkills.length > 0 ? techSkills : mapped.profile.skills.technical,
          soft: softSkills.length > 0 ? softSkills : mapped.profile.skills.soft,
          tools: mapped.profile.skills.tools,
        },
        experiences: [
          {
            title: `Proyek & Pengalaman: ${data.targetRole || "Kandidat"}`,
            organization: data.institution || "Pengalaman Akademik / Magang",
            period: `${data.graduationYear || "2025"} - Sekarang`,
            description: lines[7],
          },
        ],
        education: [
          {
            institution: data.institution || "Perguruan Tinggi",
            degree: data.educationLevel || "S1",
            field: data.major || "Bidang Terkait",
            graduationYear: data.graduationYear || "2026",
          },
        ],
        portfolioProjects: data.portfolioLink
          ? [
              {
                name: "Portofolio Utama",
                description: "Tautan portofolio kandidat",
                link: data.portfolioLink,
              },
            ]
          : undefined,
      };

      const storedCv: StoredCV = {
        cvId,
        userId,
        source: "onboarding",
        storedFilePath: savedPath,
        overallScore: Math.max(mapped.overallScore, 85),
        dimensions: {
          structure: Math.max(mapped.dimensions.structure, 92),
          clarity: Math.max(mapped.dimensions.clarity, 86),
          measurableImpact: mapped.dimensions.measurableImpact,
          skillRelevance: mapped.dimensions.skillRelevance,
          completeness: Math.max(mapped.dimensions.completeness, 90),
        },
        strengths: [
          "Disusun otomatis menggunakan struktur 1-kolom standar ATS Pasbana.",
          ...mapped.strengths.slice(0, 2),
        ],
        weaknesses: mapped.weaknesses,
        recommendations: mapped.recommendations,
        profile: structuredProfile,
        cvTextExcerpt: lines.join("\n"),
        cvEmbedding: mapped.cvEmbedding,
        createdAt: new Date().toISOString(),
      };

      db.cvs.unshift(storedCv);
      const existingIdx = db.profiles.findIndex((p) => p.userId === userId);
      if (existingIdx >= 0) {
        db.profiles[existingIdx] = structuredProfile;
      } else {
        db.profiles.push(structuredProfile);
      }

      if (dbUser) {
        dbUser.hasCompletedCvCheck = true;
      }

      saveDb(db);

      return res.json({
        cvId: storedCv.cvId,
        overallScore: storedCv.overallScore,
        dimensions: storedCv.dimensions,
        strengths: storedCv.strengths,
        weaknesses: storedCv.weaknesses,
        recommendations: storedCv.recommendations,
        profile: storedCv.profile,
      });
    } catch (err) {
      return res.status(422).json({
        message:
          err instanceof Error
            ? err.message
            : "Gagal menyusun CV dari kuesioner.",
      });
    }
  }
);

// GET /api/cvs (Daftar riwayat CV milik pengguna)
router.get("/", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const list = db.cvs
    .filter((c) => c.userId === req.user?.userId)
    .map(({ cvTextExcerpt: _t, cvEmbedding: _e, storedFilePath: _p, ...rest }) => rest);
  return res.json(list);
});

// DELETE /api/cvs/:id (UU PDP Right to be Forgotten)
router.delete(
  "/:id",
  authenticateJWT,
  (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const target = db.cvs.find(
      (c) => c.cvId === req.params.id && c.userId === req.user?.userId
    );
    if (!target) {
      return res.status(404).json({ message: "Dokumen CV tidak ditemukan." });
    }
    if (target.storedFilePath && fs.existsSync(target.storedFilePath)) {
      fs.unlinkSync(target.storedFilePath);
    }
    db.cvs = db.cvs.filter((c) => c.cvId !== target.cvId);
    saveDb(db);
    return res.json({ success: true, message: "Dokumen CV dan embedding berhasil dihapus permanen." });
  }
);

export default router;
