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
import {
  analyzeCvWithBackendAi,
  analyzeTextWithBackendAi,
  chatCvWithBackendAi,
} from "../services/aiService";
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
        source: "upload",
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

function getRoleBenchmarkSkills(targetRoleRaw: string): string[] {
  const role = targetRoleRaw.toLowerCase();
  if (
    role.includes("frontend") ||
    role.includes("front-end") ||
    role.includes("ui engineer") ||
    role.includes("web")
  ) {
    return [
      "HTML/CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Git",
      "REST API",
    ];
  }
  if (role.includes("backend") || role.includes("back-end") || role.includes("api")) {
    return [
      "Node.js",
      "TypeScript",
      "Express.js",
      "PostgreSQL",
      "REST API",
      "Docker",
      "Git",
      "Redis",
    ];
  }
  if (role.includes("fullstack") || role.includes("full-stack") || role.includes("software")) {
    return [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "REST API",
      "Git",
      "Docker",
    ];
  }
  if (role.includes("data") || role.includes("analyst") || role.includes("ai") || role.includes("ml")) {
    return [
      "Python",
      "SQL",
      "PostgreSQL",
      "Data Analysis",
      "Pandas",
      "Power BI",
      "Tableau",
      "Microsoft Excel",
    ];
  }
  if (role.includes("ui") || role.includes("ux") || role.includes("design") || role.includes("product")) {
    return [
      "Figma",
      "UI/UX Design",
      "Wireframing",
      "Prototyping",
      "Design System",
      "User Research",
    ];
  }
  if (role.includes("mobile") || role.includes("android") || role.includes("ios") || role.includes("flutter")) {
    return [
      "Flutter",
      "React Native",
      "Kotlin",
      "REST API",
      "Git",
      "Firebase",
    ];
  }
  if (role.includes("marketing") || role.includes("content") || role.includes("seo") || role.includes("social")) {
    return [
      "Digital Marketing",
      "SEO",
      "Copywriting",
      "Google Analytics",
      "Canva",
      "Content Strategy",
    ];
  }
  return [
    "Komunikasi Profesional",
    "Analisis Data",
    "Microsoft Excel",
    "Manajemen Proyek",
    "Git",
    "Problem Solving",
  ];
}

// POST /api/cvs/from-questionnaire (Bangun .docx standar ATS -> evaluasi substansi berbasis Target Posisi)
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

      const rawExperience = String(data.experienceSummary || "").trim();
      const experienceLines = (
        rawExperience ||
        "Mengerjakan proyek akademik dan pengembangan kompetensi sesuai bidang studi."
      )
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => (/^[•\-\*]/.test(l) ? l : `- ${l}`));

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
        ...experienceLines,
        "Keahlian",
        `Keahlian Teknis: ${data.technicalSkills || "-"}`,
        `Soft Skills: ${data.softSkills || "-"}`,
      ];

      const docxBuffer = buildDocxFromLines(lines);
      const cvId = `cv-gen-${Date.now()}`;
      const savedPath = path.join(UPLOADS_DIR, `${cvId}.docx`);
      fs.writeFileSync(savedPath, docxBuffer);

      const techSkills = String(data.technicalSkills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const softSkills = String(data.softSkills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const targetRole = String(data.targetRole || "Profesional Muda").trim();
      const roleBenchmarks = getRoleBenchmarkSkills(targetRole);

      const mapped = await analyzeTextWithBackendAi({
        text: lines.join("\n"),
        jdKeywords: roleBenchmarks,
        fallbackName: data.fullName || dbUser?.name || "Kandidat Pasbana",
        fallbackEmail: data.email || dbUser?.email || "kandidat@pasbana.ai",
      });

      // Hitung 5 Dimensi Substansi khusus Onboarding ("Belum Punya CV") secara realistis:
      // 1. Kesesuaian Target Posisi (structure slot)
      const lowerUserSkills = techSkills.map((s) => s.toLowerCase());
      const matchedBenchmarks = roleBenchmarks.filter((b) =>
        lowerUserSkills.some(
          (u) =>
            u.includes(b.toLowerCase()) ||
            b.toLowerCase().includes(u) ||
            (b.toLowerCase() === "html/css" && (u.includes("html") || u.includes("css")))
        )
      );
      const missingBenchmarks = roleBenchmarks.filter(
        (b) => !matchedBenchmarks.includes(b)
      );
      const skillCountScore = Math.min(100, 42 + techSkills.length * 11);
      const benchmarkRatioScore =
        roleBenchmarks.length > 0
          ? Math.min(
              100,
              Math.round((matchedBenchmarks.length / Math.min(5, roleBenchmarks.length)) * 100)
            )
          : 75;
      const roleAlignmentScore = Math.max(
        48,
        Math.min(98, Math.round(skillCountScore * 0.45 + Math.max(benchmarkRatioScore, mapped.dimensions.skillRelevance) * 0.55))
      );

      // 2. Kedalaman Narasi Pengalaman (clarity slot)
      const expWords = rawExperience
        ? rawExperience.split(/\s+/).filter(Boolean).length
        : 0;
      const expBulletCount = rawExperience
        ? rawExperience
            .split(/\r?\n|[.;]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 8).length
        : 0;
      let narrativeDepthScore = 52;
      if (expWords >= 45 && expBulletCount >= 2) {
        narrativeDepthScore = 92;
      } else if (expWords >= 28) {
        narrativeDepthScore = 84;
      } else if (expWords >= 15) {
        narrativeDepthScore = 73;
      } else if (expWords >= 6) {
        narrativeDepthScore = 62;
      }

      // 3. Bukti Dampak & Angka (measurableImpact slot)
      const hasNumericImpact =
        /\d+\s*(%|persen|x|\+|orang|pengguna|user|peserta|klien|proyek|aplikasi|fitur|tim|bulan|minggu|hari|detik|ms|juta|ribu|ipk)/i.test(
          rawExperience
        ) || /\b\d{2,}\b/.test(rawExperience);
      const impactScore = hasNumericImpact
        ? Math.max(84, mapped.dimensions.measurableImpact)
        : Math.min(66, Math.max(52, Math.round(mapped.dimensions.measurableImpact * 0.68)));

      // 4. Kekuatan Kata Kerja Aksi (skillRelevance slot)
      const actionVerbMatches =
        rawExperience.match(
          /\b(mengembangkan|merancang|membangun|mengoptimalkan|memimpin|mengelola|menganalisis|menyusun|meningkatkan|mengimplementasikan|membuat|mengintegrasikan|berkolaborasi|menyelesaikan|built|developed|designed|optimized|led|created|implemented)\b/gi
        ) || [];
      const actionVerbScore = Math.min(
        96,
        Math.max(
          56,
          Math.round(
            mapped.dimensions.clarity * 0.55 +
              Math.min(100, 54 + actionVerbMatches.length * 16) * 0.45
          )
        )
      );

      // 5. Kredibilitas & Portofolio (completeness slot)
      let credibilityScore = 56;
      if (String(data.phone || "").trim().length >= 8) credibilityScore += 10;
      if (String(data.portfolioLink || "").trim().length >= 8) credibilityScore += 16;
      if (softSkills.length >= 2) credibilityScore += 9;
      else if (softSkills.length === 1) credibilityScore += 5;
      if (techSkills.length >= 4) credibilityScore += 9;
      else if (techSkills.length >= 2) credibilityScore += 5;
      credibilityScore = Math.min(98, credibilityScore);

      const onboardingDimensions = {
        structure: roleAlignmentScore,
        clarity: narrativeDepthScore,
        measurableImpact: impactScore,
        skillRelevance: actionVerbScore,
        completeness: credibilityScore,
      };

      const onboardingOverallScore = Math.round(
        (onboardingDimensions.structure +
          onboardingDimensions.clarity +
          onboardingDimensions.measurableImpact +
          onboardingDimensions.skillRelevance +
          onboardingDimensions.completeness) /
          5
      );

      const onboardingStrengths: string[] = [
        "Dokumen CV telah disusun otomatis dengan tata letak 1-kolom standar ATS Pasbana (100% bebas masalah keterbacaan format).",
      ];
      if (matchedBenchmarks.length > 0) {
        onboardingStrengths.push(
          `Memuat keahlian inti yang relevan untuk posisi ${targetRole}: ${matchedBenchmarks.join(", ")}.`
        );
      } else if (techSkills.length > 0) {
        onboardingStrengths.push(
          `Telah mencantumkan kompetensi teknis dasar (${techSkills.slice(0, 4).join(", ")}) pada bagian keahlian.`
        );
      }
      if (hasNumericImpact) {
        onboardingStrengths.push(
          "Deskripsi pengalaman/proyek sudah menyertakan bukti angka atau skala pencapaian konkret."
        );
      } else if (String(data.portfolioLink || "").trim()) {
        onboardingStrengths.push(
          "Menyertakan tautan portofolio atau profil profesional untuk memperkuat verifikasi perekrut."
        );
      } else {
        onboardingStrengths.push(
          `Profil akademik ${data.educationLevel || "S1"} ${data.major || ""} dari ${data.institution || "Perguruan Tinggi"} tertulis jelas sesuai urutan kronologis.`
        );
      }

      const onboardingRecommendations: string[] = [];
      if (missingBenchmarks.length > 0 && techSkills.length < 5) {
        onboardingRecommendations.push(
          `Untuk posisi ${targetRole}, tambahkan keahlian standar industri yang sering dicari ATS seperti: ${missingBenchmarks.slice(0, 4).join(", ")}.`
        );
      }
      if (expWords < 25) {
        onboardingRecommendations.push(
          "Perdalam narasi pengalaman atau proyek menjadi minimal 2 sampai 3 kalimat rincian (jelaskan peran Anda, teknologi yang dipakai, dan hasil akhirnya)."
        );
      }
      if (!hasNumericImpact) {
        onboardingRecommendations.push(
          "Tambahkan metrik angka pada cerita pengalaman/proyek (contoh: 'Mengembangkan aplikasi web untuk 150+ pengguna' atau 'Mempercepat proses laporan 35%')."
        );
      }
      if (!String(data.portfolioLink || "").trim()) {
        onboardingRecommendations.push(
          "Sertakan tautan LinkedIn, GitHub, atau portofolio proyek agar skor Kredibilitas & Portofolio meningkat."
        );
      }
      if (softSkills.length < 2) {
        onboardingRecommendations.push(
          "Tambahkan minimal 2 sampai 3 Soft Skills pendukung (seperti Problem Solving atau Komunikasi Tim) untuk menyeimbangkan profil."
        );
      }
      if (onboardingRecommendations.length === 0) {
        onboardingRecommendations.push(
          `Pertahankan kelengkapan profil dan sesuaikan penekanan proyek utama dengan deskripsi lowongan ${targetRole} yang dilamar.`
        );
      }

      const structuredProfile = {
        userId,
        fullName: data.fullName || mapped.profile.fullName,
        headline: targetRole || mapped.profile.headline,
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
            title: `Proyek & Pengalaman: ${targetRole || "Kandidat"}`,
            organization: data.institution || "Pengalaman Akademik / Magang",
            period: `${data.graduationYear || "2025"} - Sekarang`,
            description:
              rawExperience ||
              "Mengerjakan proyek akademik dan pengembangan kompetensi sesuai bidang studi.",
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
        overallScore: onboardingOverallScore,
        dimensions: onboardingDimensions,
        strengths: onboardingStrengths,
        weaknesses: mapped.weaknesses,
        recommendations: onboardingRecommendations.slice(0, 4),
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
        source: "onboarding",
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

// POST /api/cvs/chat (Konsultasi Chatbot Evaluasi CV terhubung ke backend-ai /internal/v1/cv/chat)
router.post("/chat", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      cvId,
      question,
      overallScore,
      dimensions,
      strengths,
      weaknesses,
      recommendations,
    } = req.body || {};

    if (!question || !String(question).trim()) {
      return res.status(400).json({ message: "Pertanyaan konsultasi wajib diisi." });
    }

    const db = getDb();
    const optUser = resolveOptionalUser(req);
    const storedCv = cvId
      ? db.cvs.find((c) => c.cvId === cvId)
      : optUser
      ? db.cvs.find((c) => c.userId === optUser.userId)
      : db.cvs[0];

    const resolvedSource: "upload" | "onboarding" =
      storedCv?.source === "onboarding" || String(cvId || "").startsWith("cv-gen-")
        ? "onboarding"
        : "upload";

    const chatRes = await chatCvWithBackendAi({
      question: String(question).trim(),
      source: resolvedSource,
      sanitizedText: storedCv?.cvTextExcerpt || "",
      overallScore:
        typeof overallScore === "number"
          ? overallScore
          : storedCv?.overallScore ?? 80,
      dimensions: dimensions || storedCv?.dimensions || {},
      strengths: Array.isArray(strengths) ? strengths : storedCv?.strengths || [],
      weaknesses: Array.isArray(weaknesses) ? weaknesses : storedCv?.weaknesses || [],
      recommendations: Array.isArray(recommendations)
        ? recommendations
        : storedCv?.recommendations || [],
    });

    return res.json(chatRes);
  } catch (err) {
    return res.status(503).json({
      message:
        err instanceof Error
          ? err.message
          : "Layanan konsultasi AI sedang tidak tersedia.",
    });
  }
});

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
