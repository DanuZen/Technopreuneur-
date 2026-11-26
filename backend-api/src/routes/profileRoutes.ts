import fs from "fs";
import { Router, Response } from "express";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth";
import { getDb, saveDb } from "../store/dataStore";

const router = Router();

// GET /api/profile
router.get("/", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const userId = req.user?.userId || "";
  let profile = db.profiles.find((p) => p.userId === userId);

  if (!profile) {
    const user = db.users.find((u) => u.id === userId);
    profile = {
      userId,
      fullName: user?.name || "Pengguna Pasbana",
      headline: "Kandidat Profesional Muda",
      contactEmail: user?.email || "",
      city: "Indonesia",
      seniorityLevel: "Junior / Fresh Graduate",
      summary: "",
      skills: { technical: [], soft: [], tools: [] },
      experiences: [],
      education: [],
    };
    db.profiles.push(profile);
    saveDb(db);
  }

  return res.json(profile);
});

// PUT /api/profile
router.put("/", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const userId = req.user?.userId || "";
  const body = req.body || {};

  const idx = db.profiles.findIndex((p) => p.userId === userId);
  const current =
    idx >= 0
      ? db.profiles[idx]
      : {
          userId,
          fullName: "Pengguna Pasbana",
          headline: "",
          contactEmail: req.user?.email || "",
          city: "Indonesia",
          seniorityLevel: "Junior / Fresh Graduate",
          summary: "",
          skills: { technical: [], soft: [], tools: [] },
          experiences: [],
          education: [],
        };

  const updated = {
    ...current,
    fullName: body.fullName ?? current.fullName,
    headline: body.headline ?? current.headline,
    contactEmail: body.contactEmail ?? current.contactEmail,
    city: body.city ?? current.city,
    seniorityLevel: body.seniorityLevel ?? current.seniorityLevel,
    summary: body.summary ?? current.summary,
    skills: body.skills ?? current.skills,
    experiences: body.experiences ?? current.experiences,
    education: body.education ?? current.education,
  };

  if (idx >= 0) {
    db.profiles[idx] = updated;
  } else {
    db.profiles.push(updated);
  }

  const user = db.users.find((u) => u.id === userId);
  if (user && updated.fullName) {
    user.name = updated.fullName;
  }

  saveDb(db);
  return res.json(updated);
});

// DELETE /api/users/me (UU PDP Right to be Forgotten: hapus akun, CV, file fisik, profil, dan lamaran)
router.delete("/me", authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const userId = req.user?.userId || "";
  const userIdx = db.users.findIndex((u) => u.id === userId);
  if (userIdx < 0) {
    return res.status(404).json({ message: "Akun pengguna tidak ditemukan." });
  }

  for (const cv of db.cvs.filter((c) => c.userId === userId)) {
    if (cv.storedFilePath && fs.existsSync(cv.storedFilePath)) {
      fs.unlinkSync(cv.storedFilePath);
    }
  }

  db.cvs = db.cvs.filter((c) => c.userId !== userId);
  db.profiles = db.profiles.filter((p) => p.userId !== userId);
  db.applications = db.applications.filter((a) => a.userId !== userId);
  db.users = db.users.filter((u) => u.id !== userId);
  saveDb(db);

  return res.json({
    success: true,
    message: "Akun, dokumen CV, profil, dan riwayat lamaran berhasil dihapus permanen.",
  });
});

export default router;
