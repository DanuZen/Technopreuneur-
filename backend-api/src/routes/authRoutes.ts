import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb, saveDb, UserRole } from "../store/dataStore";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

function signToken(payload: { userId: string; email: string; role: UserRole }): string {
  const secret = process.env.JWT_SECRET || "super_secret_jwt_key_careermatch_2026";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, pdpConsent, legality } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan kata sandi wajib diisi.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const db = getDb();

    if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({
        message: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda.",
      });
    }

    const mappedRole: UserRole =
      role === "company" || role === "employer"
        ? "employer"
        : role === "admin"
        ? "admin"
        : "jobseeker";

    const userId = `usr-${Date.now()}`;
    const passwordHash = await bcrypt.hash(String(password), 10);
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: mappedRole,
      pdpConsent: Boolean(pdpConsent ?? true),
      hasCompletedCvCheck: mappedRole !== "jobseeker",
      createdAt: now,
    };

    db.users.push(newUser);

    if (mappedRole === "jobseeker") {
      db.profiles.push({
        userId,
        fullName: newUser.name,
        headline: "Pencari Kerja Baru",
        contactEmail: normalizedEmail,
        city: "Indonesia",
        seniorityLevel: "Junior / Fresh Graduate",
        summary: "",
        skills: { technical: [], soft: [], tools: [] },
        experiences: [],
        education: [],
      });
    } else if (mappedRole === "employer") {
      db.companies.push({
        id: `comp-${Date.now()}`,
        ownerUserId: userId,
        companyName: newUser.name,
        industry: legality?.sector || "Teknologi & Industri",
        website: legality?.website || "",
        city: legality?.location || "Indonesia",
        keywords: legality?.keywords || "",
        description: "Mitra perusahaan terdaftar di ekosistem Pasbana AI.",
        nib: legality?.nib || "",
        npwp: legality?.npwp || "",
        legalityDoc:
          legality?.nib && legality?.npwp
            ? "Menunggu Audit NIB & NPWP"
            : "Menunggu Kelengkapan Legalitas",
        pdpCompliance: "Persetujuan UU PDP Tercatat",
        status: "pending",
        note: "Pendaftaran perusahaan baru menunggu audit dan verifikasi oleh Admin.",
        createdAt: now,
      });
    }

    saveDb(db);

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Gagal mendaftarkan akun.",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan kata sandi wajib diisi.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const db = getDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!user) {
      return res.status(401).json({
        message: "Email atau kata sandi tidak sesuai.",
      });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        message: "Email atau kata sandi tidak sesuai.",
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Gagal memproses login.",
    });
  }
});

// GET /api/auth/me
router.get("/me", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const user = db.users.find((u) => u.id === req.user?.userId);
  if (!user) {
    return res.status(404).json({ message: "Pengguna tidak ditemukan." });
  }
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    hasCompletedCvCheck: user.hasCompletedCvCheck,
    createdAt: user.createdAt,
  });
});

export default router;
