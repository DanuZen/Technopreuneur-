import { StoredJob, StoredProfile } from "../store/dataStore";

const AI_SERVICE_URL = (
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const AI_INTERNAL_TOKEN =
  process.env.AI_INTERNAL_TOKEN || "dev-local-internal-token";

interface BackendAiDimension {
  name: "readability" | "sections" | "keywords" | "content" | "contact_length";
  score: number | null;
  weight: number;
}

interface BackendAiIssue {
  code: string;
  severity: "info" | "warning" | "critical";
  dimension: string;
  message: string;
}

interface BackendAiAts {
  overall_score: number | null;
  dimensions: BackendAiDimension[];
  flags: {
    is_scanned: boolean;
    is_empty: boolean;
    has_multi_column: boolean;
    has_table: boolean;
    has_image: boolean;
    has_contact_info: boolean;
    page_count: number;
    char_count: number;
  };
  issues: BackendAiIssue[];
  detected_sections: string[];
}

interface BackendAiAnalyzeResponse {
  ats: BackendAiAts;
  advice?: {
    summary: string;
    suggestions: Array<{
      dimension: string;
      priority: string;
      text: string;
      evidence?: string | null;
    }>;
  } | null;
  advice_status?: string;
  advice_message?: string | null;
  cv_embedding?: number[];
  sanitized_text?: string;
}

interface BackendAiStage2Response {
  results: Array<{
    job_id: string;
    match_score: number;
    verdict: "sangat_cocok" | "cocok" | "cukup" | "kurang_cocok";
    reasons: Array<{ text: string; evidence: string }>;
    missing_skills: string[];
    verified: boolean;
  }>;
}

export interface MappedCvAnalysis {
  overallScore: number;
  dimensions: {
    structure: number;
    clarity: number;
    measurableImpact: number;
    skillRelevance: number;
    completeness: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  profile: Omit<StoredProfile, "userId">;
  isScannedImageWarning: boolean;
  sanitizedText: string;
  cvEmbedding?: number[];
}

const KNOWN_TECH_SKILLS = [
  "Python",
  "FastAPI",
  "Flask",
  "Django",
  "Node.js",
  "Express.js",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "HTML/CSS",
  "Java",
  "Golang",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQL",
  "REST API",
  "Machine Learning",
  "Pandas",
  "Data Analysis",
];

const KNOWN_TOOLS = [
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "Linux",
  "AWS",
  "Microsoft Excel",
  "PowerPoint",
  "Figma",
];

const KNOWN_SOFT_SKILLS = [
  "Komunikasi",
  "Kepemimpinan",
  "Manajemen Proyek",
  "Problem Solving",
  "Layanan Pelanggan",
];

function extractProfileFromText(
  text: string,
  fallbackName: string,
  fallbackEmail: string
): Omit<StoredProfile, "userId"> {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const detectedEmail = emailMatch ? emailMatch[0] : fallbackEmail;

  const firstHeadingCandidate =
    lines.find(
      (l) =>
        l.length >= 3 &&
        l.length <= 60 &&
        !l.includes("@") &&
        !/^(pendidikan|pengalaman|keahlian|ringkasan|profil|education|experience|skills)/i.test(
          l
        )
    ) || fallbackName;

  const lower = text.toLowerCase();
  const technical = KNOWN_TECH_SKILLS.filter((s) =>
    lower.includes(s.toLowerCase().replace(".js", ""))
  );
  const tools = KNOWN_TOOLS.filter((s) => lower.includes(s.toLowerCase()));
  const soft = KNOWN_SOFT_SKILLS.filter((s) => lower.includes(s.toLowerCase()));

  const eduLine = lines.find((l) =>
    /(universitas|institut|politeknik|sekolah tinggi|smk|s1|d3|sarjana|teknik|informatika)/i.test(
      l
    )
  );

  const expLine = lines.find(
    (l) =>
      l.length > 35 &&
      /(membangun|mengembangkan|mengelola|merancang|meningkatkan|membuat|menganalisis)/i.test(
        l
      )
  );

  return {
    fullName: firstHeadingCandidate,
    headline:
      technical.length > 0
        ? `Kandidat ${technical.slice(0, 2).join(" & ")}`
        : "Kandidat Profesional Muda",
    contactEmail: detectedEmail,
    city: "Indonesia",
    seniorityLevel: "Junior / Fresh Graduate",
    summary:
      lines.find((l) => l.length >= 60 && l.length <= 320) ||
      "Kandidat yang memiliki kesiapan kompetensi dan struktur dokumen standar ATS.",
    skills: {
      technical: technical.length > 0 ? technical : ["Analisis Data", "Komunikasi Teknis"],
      soft: soft.length > 0 ? soft : ["Komunikasi", "Problem Solving"],
      tools: tools.length > 0 ? tools : ["Microsoft Office", "Git"],
    },
    experiences: [
      {
        title: "Pengalaman Proyek & Organisasi",
        organization: "Riwayat CV Kandidat",
        period: "Terbaru",
        description:
          expLine ||
          "Menjalankan proyek pengembangan dan kolaborasi tim dengan fokus pada hasil terukur.",
      },
    ],
    education: [
      {
        institution: eduLine || "Perguruan Tinggi / Institusi Pendidikan",
        degree: "S1 / Sederajat",
        field: "Bidang Terkait",
        graduationYear: "2026",
      },
    ],
  };
}

export async function checkAiHealth(): Promise<{
  reachable: boolean;
  rulesVersion?: string;
}> {
  try {
    const res = await fetch(`${AI_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { reachable: false };
    const data = (await res.json()) as { status?: string; rules_version?: string };
    return { reachable: data.status === "ok", rulesVersion: data.rules_version };
  } catch {
    return { reachable: false };
  }
}

export async function analyzeCvWithBackendAi(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  jdKeywords?: string;
  fallbackName: string;
  fallbackEmail: string;
}): Promise<MappedCvAnalysis> {
  const buildFormData = () => {
    const form = new FormData();
    const blob = new Blob([new Uint8Array(params.buffer)], {
      type: params.mimeType || "application/octet-stream",
    });
    form.append("file", blob, params.fileName);
    if (params.jdKeywords) {
      form.append("jd_keywords", params.jdKeywords);
    }
    return form;
  };

  let aiData: BackendAiAnalyzeResponse | null = null;

  // 1. Panggil endpoint utama /internal/v1/cv/analyze
  const analyzeRes = await fetch(`${AI_SERVICE_URL}/internal/v1/cv/analyze`, {
    method: "POST",
    headers: {
      "X-Internal-Token": AI_INTERNAL_TOKEN,
    },
    body: buildFormData(),
    signal: AbortSignal.timeout(65000),
  });

  if (analyzeRes.ok) {
    aiData = (await analyzeRes.json()) as BackendAiAnalyzeResponse;
  } else if (analyzeRes.status === 503) {
    // 2. Jika Gemini embedding belum aktif / kuota habis (503), fallback ke /internal/v1/cv/ats-check pada backend-ai
    const atsRes = await fetch(`${AI_SERVICE_URL}/internal/v1/cv/ats-check`, {
      method: "POST",
      headers: {
        "X-Internal-Token": AI_INTERNAL_TOKEN,
      },
      body: buildFormData(),
      signal: AbortSignal.timeout(25000),
    });

    if (!atsRes.ok) {
      const errBody = (await atsRes.json().catch(() => ({}))) as { detail?: string };
      throw new Error(errBody.detail || `Layanan AI gagal (${atsRes.status})`);
    }
    const atsOnly = (await atsRes.json()) as BackendAiAts;
    aiData = {
      ats: atsOnly,
      advice: null,
      advice_status: "unavailable",
      sanitized_text: params.buffer.toString("utf8").replace(/[^\x20-\x7E\n\r]/g, " "),
    };
  } else {
    const errBody = (await analyzeRes.json().catch(() => ({}))) as { detail?: string };
    throw new Error(errBody.detail || `Gagal memproses CV (${analyzeRes.status})`);
  }

  const ats = aiData.ats;
  if (ats.flags?.is_scanned) {
    const err = new Error(
      "Berkas CV terdeteksi sebagai hasil foto/scan gambar non-teks. Unggah PDF atau DOCX berbasis teks digital."
    );
    (err as Error & { statusCode?: number }).statusCode = 422;
    throw err;
  }

  const dimMap = new Map<string, number | null>();
  for (const d of ats.dimensions || []) {
    dimMap.set(d.name, d.score);
  }

  const sanitizedText = aiData.sanitized_text || "";
  const profile = extractProfileFromText(
    sanitizedText,
    params.fallbackName,
    params.fallbackEmail
  );

  const estimatedSkillScore = Math.min(
    96,
    65 + profile.skills.technical.length * 6
  );

  const structure = dimMap.get("readability") ?? 85;
  const completeness = dimMap.get("sections") ?? 85;
  const clarity = dimMap.get("contact_length") ?? 85;
  const measurableImpact = dimMap.get("content") ?? 75;
  const skillRelevance = dimMap.get("keywords") ?? estimatedSkillScore;

  const overallScore =
    ats.overall_score ??
    Math.round(
      (structure + completeness + clarity + measurableImpact + skillRelevance) / 5
    );

  const strengths: string[] = [];
  if (!ats.flags.has_multi_column && !ats.flags.has_table) {
    strengths.push("Format dokumen 1-kolom bersih tanpa tabel kompleks sehingga optimal dibaca ATS.");
  }
  if (ats.flags.has_contact_info) {
    strengths.push("Informasi kontak profesional terdeteksi lengkap di badan dokumen.");
  }
  if (ats.detected_sections.length >= 3) {
    strengths.push(
      `Bagian utama CV terstruktur jelas (${ats.detected_sections.join(", ")}).`
    );
  }
  if (strengths.length === 0) {
    strengths.push("Dokumen teks digital berhasil diekstrak dan siap ditingkatkan.");
  }

  const weaknesses = (ats.issues || []).map((iss) => iss.message);
  const recommendations =
    aiData.advice?.suggestions && aiData.advice.suggestions.length > 0
      ? aiData.advice.suggestions.map((s) => s.text)
      : weaknesses.length > 0
      ? weaknesses.map((w) => `Perbaiki: ${w}`)
      : [
          "Tambahkan metrik angka kuantitatif pada setiap pencapaian pengalaman atau proyek.",
          "Sesuaikan kata kunci keahlian teknis dengan kualifikasi lowongan yang dituju.",
        ];

  return {
    overallScore,
    dimensions: {
      structure,
      clarity,
      measurableImpact,
      skillRelevance,
      completeness,
    },
    strengths,
    weaknesses,
    recommendations,
    profile,
    isScannedImageWarning: Boolean(ats.flags?.is_scanned),
    sanitizedText,
    cvEmbedding: aiData.cv_embedding,
  };
}

export function cosineSimilarity(a?: number[], b?: number[]): number {
  if (!a || !b || a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

export async function rankJobsWithBackendAi(
  cvText: string,
  jobs: StoredJob[],
  companyKeywordsById: Map<string, string>
): Promise<
  Array<
    StoredJob & {
      matchScore: number;
      matchReason: string[];
      missingSkills: string[];
    }
  >
> {
  if (!cvText.trim() || jobs.length === 0) {
    return jobs.map((j) => ({
      ...j,
      matchScore: 75,
      matchReason: ["Sesuai dengan bidang kompetensi umum kandidat."],
      missingSkills: [],
    }));
  }

  const stage2Map = new Map<
    string,
    { matchScore: number; matchReason: string[]; missingSkills: string[] }
  >();

  // Panggil /internal/v1/match/stage2 dalam batch maksimal 5 kandidat sesuai kontrak backend-ai
  const batchSize = 5;
  for (let i = 0; i < jobs.length; i += batchSize) {
    const chunk = jobs.slice(i, i + batchSize);
    const candidates = chunk.map((j) => {
      const compKw = (companyKeywordsById.get(j.companyId) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const mergedSkills = Array.from(new Set([...j.requiredSkills, ...compKw])).slice(
        0,
        50
      );
      return {
        job_id: j.id,
        title: j.title.slice(0, 300),
        description: j.description.slice(0, 20000),
        skills: mergedSkills,
      };
    });

    try {
      const res = await fetch(`${AI_SERVICE_URL}/internal/v1/match/stage2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Token": AI_INTERNAL_TOKEN,
        },
        body: JSON.stringify({
          sanitized_text: cvText.slice(0, 30000),
          candidates,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const body = (await res.json()) as BackendAiStage2Response;
        for (const r of body.results || []) {
          stage2Map.set(r.job_id, {
            matchScore: r.match_score,
            matchReason:
              r.reasons.length > 0
                ? r.reasons.map((rs) => `${rs.text} ("${rs.evidence}")`)
                : ["Profil relevan dengan deskripsi pekerjaan."],
            missingSkills: r.missing_skills,
          });
        }
      }
    } catch {
      // fallback lokal jika backend-ai tidak terjangkau
    }
  }

  return jobs
    .map((job) => {
      const matched = stage2Map.get(job.id);
      if (matched) {
        return { ...job, ...matched };
      }
      const lowerCv = cvText.toLowerCase();
      const hits = job.requiredSkills.filter((s) =>
        lowerCv.includes(s.toLowerCase())
      );
      const miss = job.requiredSkills.filter(
        (s) => !lowerCv.includes(s.toLowerCase())
      );
      const score =
        job.requiredSkills.length > 0
          ? Math.round((hits.length / job.requiredSkills.length) * 100)
          : 70;
      return {
        ...job,
        matchScore: score,
        matchReason:
          hits.length > 0
            ? [`Memiliki keahlian pada ${hits.join(", ")}`]
            : ["Sesuai dengan kualifikasi umum lowongan"],
        missingSkills: miss,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
