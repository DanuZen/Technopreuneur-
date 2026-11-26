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

export default router;
