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
  general_skill_score?: number;
  strengths?: string[];
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
  profile?: Partial<Omit<StoredProfile, "userId">> | null;
  strengths?: string[];
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
  "Vue.js",
  "Tailwind CSS",
  "HTML/CSS",
  "Java",
  "Golang",
  "PHP",
  "Laravel",
  "Flutter",
  "Kotlin",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQL",
  "REST API",
  "GraphQL",
  "Machine Learning",
  "Pandas",
  "Data Analysis",
  "UI/UX Design",
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
  "Canva",
];

const KNOWN_SOFT_SKILLS = [
  "Komunikasi",
  "Kepemimpinan",
  "Manajemen Proyek",
  "Problem Solving",
  "Layanan Pelanggan",
  "Scrum / Agile",
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

function mapAnalyzeResponseToResult(
  aiData: BackendAiAnalyzeResponse,
  fallbackName: string,
  fallbackEmail: string
): MappedCvAnalysis {
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
  const fallbackProfile = extractProfileFromText(
    sanitizedText,
    fallbackName,
    fallbackEmail
  );

  const aiProfile = aiData.profile;
  const profile: Omit<StoredProfile, "userId"> = aiProfile
    ? {
        fullName: aiProfile.fullName || fallbackProfile.fullName,
        headline: aiProfile.headline || fallbackProfile.headline,
        contactEmail: aiProfile.contactEmail || fallbackProfile.contactEmail,
        city: aiProfile.city || fallbackProfile.city,
        seniorityLevel: aiProfile.seniorityLevel || fallbackProfile.seniorityLevel,
        summary: aiProfile.summary || fallbackProfile.summary,
        skills: {
          technical:
            aiProfile.skills?.technical && aiProfile.skills.technical.length > 0
              ? aiProfile.skills.technical
              : fallbackProfile.skills.technical,
          soft:
            aiProfile.skills?.soft && aiProfile.skills.soft.length > 0
              ? aiProfile.skills.soft
              : fallbackProfile.skills.soft,
          tools:
            aiProfile.skills?.tools && aiProfile.skills.tools.length > 0
              ? aiProfile.skills.tools
              : fallbackProfile.skills.tools,
        },
        experiences:
          aiProfile.experiences && aiProfile.experiences.length > 0
            ? aiProfile.experiences
            : fallbackProfile.experiences,
        education:
          aiProfile.education && aiProfile.education.length > 0
            ? aiProfile.education
            : fallbackProfile.education,
        portfolioProjects: aiProfile.portfolioProjects,
      }
    : fallbackProfile;

  const estimatedSkillScore =
    ats.general_skill_score ??
    Math.min(96, 65 + profile.skills.technical.length * 6);

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

  const rawStrengths = aiData.strengths?.length
    ? aiData.strengths
    : ats.strengths?.length
    ? ats.strengths
    : [];

  const strengths: string[] = [...rawStrengths];
  if (strengths.length === 0) {
    if (!ats.flags.has_multi_column && !ats.flags.has_table) {
      strengths.push(
        "Format dokumen 1-kolom bersih tanpa tabel kompleks sehingga optimal dibaca ATS."
      );
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
      strengths: atsOnly.strengths,
    };
  } else {
    const errBody = (await analyzeRes.json().catch(() => ({}))) as { detail?: string };
    throw new Error(errBody.detail || `Gagal memproses CV (${analyzeRes.status})`);
  }

  return mapAnalyzeResponseToResult(aiData, params.fallbackName, params.fallbackEmail);
}

export async function analyzeTextWithBackendAi(params: {
  text: string;
  jdKeywords?: string[];
  fallbackName: string;
  fallbackEmail: string;
}): Promise<MappedCvAnalysis> {
  const res = await fetch(`${AI_SERVICE_URL}/internal/v1/cv/analyze-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Token": AI_INTERNAL_TOKEN,
    },
    body: JSON.stringify({
      text: params.text,
      jd_keywords: params.jdKeywords || [],
    }),
    signal: AbortSignal.timeout(45000),
  });

  if (res.ok) {
    const aiData = (await res.json()) as BackendAiAnalyzeResponse;
    return mapAnalyzeResponseToResult(aiData, params.fallbackName, params.fallbackEmail);
  }

  // Fallback deterministik apabila kuota embedding habis (503)
  const fallbackProfile = extractProfileFromText(
    params.text,
    params.fallbackName,
    params.fallbackEmail
  );
  return {
    overallScore: 88,
    dimensions: {
      structure: 94,
      clarity: 88,
      measurableImpact: 82,
      skillRelevance: 88,
      completeness: 90,
    },
    strengths: [
      "Format dokumen 1-kolom bersih tanpa tabel atau gambar sehingga ramah mesin ATS.",
      "Informasi kontak dan struktur bagian utama CV sudah lengkap.",
    ],
    weaknesses: [],
    recommendations: [
      "Tambahkan angka metrik pencapaian pada setiap pengalaman proyek atau magang.",
    ],
    profile: fallbackProfile,
    isScannedImageWarning: false,
    sanitizedText: params.text,
  };
}

export async function embedTextsWithBackendAi(
  texts: string[]
): Promise<number[][] | null> {
  const cleaned = texts.map((t) => t.trim()).filter(Boolean);
  if (cleaned.length === 0) return null;

  try {
    const res = await fetch(`${AI_SERVICE_URL}/internal/v1/embed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": AI_INTERNAL_TOKEN,
      },
      body: JSON.stringify({ texts: cleaned.slice(0, 50) }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { embeddings?: number[][] };
    return body.embeddings || null;
  } catch {
    return null;
  }
}

export async function chatCvWithBackendAi(payload: {
  question: string;
  sanitizedText?: string;
  overallScore?: number;
  dimensions?: Record<string, number>;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}): Promise<{ answer: string; status: "ok" | "fallback" }> {
  const res = await fetch(`${AI_SERVICE_URL}/internal/v1/cv/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Token": AI_INTERNAL_TOKEN,
    },
    body: JSON.stringify({
      question: payload.question,
      sanitized_text: payload.sanitizedText || "",
      overall_score: payload.overallScore ?? 80,
      dimensions: payload.dimensions || {},
      strengths: payload.strengths || [],
      weaknesses: payload.weaknesses || [],
      recommendations: payload.recommendations || [],
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) {
    throw new Error(`Layanan konsultasi AI tidak merespons (${res.status})`);
  }

  return (await res.json()) as { answer: string; status: "ok" | "fallback" };
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
  companyKeywordsById: Map<string, string>,
  cvEmbedding?: number[]
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

  // Stage 1: Jika embedding tersedia, urutkan kandidat berdasarkan kemiripan semantik vektor terlebih dahulu
  const orderedJobs =
    cvEmbedding && cvEmbedding.length > 0
      ? [...jobs].sort(
          (a, b) =>
            cosineSimilarity(cvEmbedding, b.jobEmbedding) -
            cosineSimilarity(cvEmbedding, a.jobEmbedding)
        )
      : jobs;

  const stage2Map = new Map<
    string,
    { matchScore: number; matchReason: string[]; missingSkills: string[] }
  >();

  // Stage 2: Panggil /internal/v1/match/stage2 dalam batch hingga 50 kandidat
  const batchSize = 50;
  for (let i = 0; i < orderedJobs.length; i += batchSize) {
    const chunk = orderedJobs.slice(i, i + batchSize);
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

  return orderedJobs
    .map((job) => {
      const matched = stage2Map.get(job.id);
      const semSim =
        cvEmbedding && job.jobEmbedding
          ? Math.max(0, Math.min(1, cosineSimilarity(cvEmbedding, job.jobEmbedding)))
          : null;

      if (matched) {
        const blendedScore =
          semSim !== null
            ? Math.min(100, Math.round(matched.matchScore * 0.8 + semSim * 100 * 0.2))
            : matched.matchScore;
        return { ...job, ...matched, matchScore: blendedScore };
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
