"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  GraduationCap,
  Briefcase,
  Award,
  FileSpreadsheet,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import { QuestionnaireData, CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

const TECHNICAL_SKILL_CATALOG: Array<{ label: string; keywords: string[] }> = [
  { label: "Next.js", keywords: ["next", "nextjs", "next.js", "nest", "react"] },
  { label: "NestJS", keywords: ["nest", "nestjs", "nest.js", "node"] },
  { label: "React", keywords: ["react", "reactjs", "react.js", "reac"] },
  { label: "TypeScript", keywords: ["typescript", "ts", "typescrip"] },
  { label: "JavaScript", keywords: ["javascript", "js", "javascrip", "es6"] },
  { label: "Tailwind CSS", keywords: ["tailwind", "tailwindcss", "css"] },
  { label: "Node.js", keywords: ["node", "nodejs", "node.js"] },
  { label: "Express.js", keywords: ["express", "expressjs", "express.js"] },
  { label: "Python", keywords: ["python", "py", "phyton"] },
  { label: "FastAPI", keywords: ["fastapi", "fast api", "python"] },
  { label: "Django", keywords: ["django", "python"] },
  { label: "Flask", keywords: ["flask", "python"] },
  { label: "PHP", keywords: ["php"] },
  { label: "Laravel", keywords: ["laravel", "php"] },
  { label: "Golang", keywords: ["go", "golang"] },
  { label: "Java", keywords: ["java", "spring"] },
  { label: "Spring Boot", keywords: ["spring", "springboot", "java"] },
  { label: "C#", keywords: ["c#", "csharp", "dotnet", ".net"] },
  { label: "C++", keywords: ["c++", "cpp"] },
  { label: "Kotlin", keywords: ["kotlin", "android"] },
  { label: "Swift", keywords: ["swift", "ios"] },
  { label: "Flutter", keywords: ["flutter", "fluter", "dart"] },
  { label: "React Native", keywords: ["react native", "rn", "mobile"] },
  { label: "Vue.js", keywords: ["vue", "vuejs", "vue.js"] },
  { label: "Angular", keywords: ["angular", "angularjs"] },
  { label: "HTML/CSS", keywords: ["html", "css", "html5", "css3"] },
  { label: "PostgreSQL", keywords: ["postgres", "postgresql", "pg", "sql"] },
  { label: "MySQL", keywords: ["mysql", "sql"] },
  { label: "MongoDB", keywords: ["mongo", "mongodb", "nosql"] },
  { label: "Redis", keywords: ["redis", "cache"] },
  { label: "Supabase", keywords: ["supabase", "postgres"] },
  { label: "Firebase", keywords: ["firebase", "firestore"] },
  { label: "Prisma", keywords: ["prisma", "orm"] },
  { label: "GraphQL", keywords: ["graphql", "gql"] },
  { label: "REST API", keywords: ["rest", "rest api", "restful", "api"] },
  { label: "Docker", keywords: ["docker", "container"] },
  { label: "Kubernetes", keywords: ["kubernetes", "k8s"] },
  { label: "Git", keywords: ["git", "version control"] },
  { label: "GitHub", keywords: ["github", "git"] },
  { label: "Linux", keywords: ["linux", "ubuntu", "bash"] },
  { label: "AWS", keywords: ["aws", "amazon web services", "cloud"] },
  { label: "Google Cloud", keywords: ["gcp", "google cloud", "cloud"] },
  { label: "Figma", keywords: ["figma", "ui", "ux", "desain"] },
  { label: "UI/UX Design", keywords: ["ui", "ux", "ui/ux", "design", "wireframe"] },
  { label: "Canva", keywords: ["canva", "desain"] },
  { label: "Machine Learning", keywords: ["ml", "machine learning", "ai"] },
  { label: "Data Analysis", keywords: ["data", "analisis data", "data analysis", "analytics"] },
  { label: "Pandas", keywords: ["pandas", "numpy", "python"] },
  { label: "Power BI", keywords: ["powerbi", "power bi", "bi"] },
  { label: "Tableau", keywords: ["tableau", "visualisasi"] },
  { label: "Microsoft Excel", keywords: ["excel", "ms excel", "spreadsheet"] },
  { label: "Jest", keywords: ["jest", "testing", "unit test"] },
  { label: "Cypress", keywords: ["cypress", "e2e", "testing"] },
  { label: "Digital Marketing", keywords: ["marketing", "digital marketing", "ads"] },
  { label: "SEO", keywords: ["seo", "search engine"] },
  { label: "Copywriting", keywords: ["copywriting", "content", "writing"] },
  { label: "Scrum / Agile", keywords: ["scrum", "agile", "kanban"] },
];

const SOFT_SKILL_CATALOG: string[] = [
  "Problem Solving",
  "Komunikasi Tim",
  "Kepemimpinan",
  "Manajemen Proyek",
  "Manajemen Waktu",
  "Berpikir Analitis",
  "Berpikir Kritis",
  "Kolaborasi Tim",
  "Adaptabilitas",
  "Public Speaking",
  "Negosiasi",
  "Layanan Pelanggan",
];

function isOneEditAway(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let diffs = 0;
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      diffs++;
      if (diffs > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else {
        i++;
        j++;
      }
    } else {
      i++;
      j++;
    }
  }
  return true;
}

function getTechnicalRecommendations(
  activeDraft: string,
  committedTags: string[]
): {
  activeToken: string;
  suggestions: string[];
} {
  const activeToken = activeDraft.trim().toLowerCase();
  const committed = new Set(committedTags.map((t) => t.trim().toLowerCase()));

  const available = TECHNICAL_SKILL_CATALOG.filter(
    (item) =>
      !committed.has(item.label.toLowerCase()) &&
      item.label.toLowerCase() !== activeToken
  );

  if (!activeToken) {
    return {
      activeToken: "",
      suggestions: available.slice(0, 8).map((i) => i.label),
    };
  }

  const scored: Array<{ label: string; priority: number }> = [];
  for (const item of available) {
    const lbl = item.label.toLowerCase();
    if (lbl.startsWith(activeToken)) {
      scored.push({ label: item.label, priority: 1 });
    } else if (item.keywords.some((k) => k.startsWith(activeToken))) {
      scored.push({ label: item.label, priority: 2 });
    } else if (lbl.includes(activeToken) || item.keywords.some((k) => k.includes(activeToken))) {
      scored.push({ label: item.label, priority: 3 });
    } else if (
      activeToken.length >= 3 &&
      (isOneEditAway(activeToken, lbl.slice(0, activeToken.length)) ||
        item.keywords.some((k) => isOneEditAway(activeToken, k.slice(0, activeToken.length))))
    ) {
      scored.push({ label: item.label, priority: 4 });
    }
  }

  scored.sort((a, b) => a.priority - b.priority);
  return {
    activeToken,
    suggestions: scored.slice(0, 8).map((s) => s.label),
  };
}

function normalizeTechnicalSkillLabel(raw: string): string {
  const cleaned = raw.trim();
  if (!cleaned) return "";
  const lower = cleaned.toLowerCase();
  const stripped = lower.replace(/[.\s/-]+/g, "");
  const exact = TECHNICAL_SKILL_CATALOG.find(
    (item) =>
      item.label.toLowerCase() === lower ||
      item.label.toLowerCase().replace(/[.\s/-]+/g, "") === stripped ||
      item.keywords[0]?.toLowerCase() === lower
  );
  return exact ? exact.label : cleaned;
}

interface AtsOnboardingWizardProps {
  onComplete: (result: CVAnalysisResult) => void;
  onStepChange?: (step: number) => void;
}

export function AtsOnboardingWizard({
  onComplete,
  onStepChange,
}: AtsOnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuestionnaireData>({
    fullName: "",
    email: "",
    phone: "",
    educationLevel: "S1",
    institution: "",
    major: "",
    graduationYear: new Date().getFullYear().toString(),
    targetRole: "",
    technicalSkills: "",
    softSkills: "",
    experienceSummary: "",
    portfolioLink: "",
  });

  const [techTags, setTechTags] = useState<string[]>([]);
  const [techDraft, setTechDraft] = useState("");
  const [softTags, setSoftTags] = useState<string[]>([]);
  const [softDraft, setSoftDraft] = useState("");

  const updateField = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const syncTechnicalField = (nextTags: string[], nextDraft: string) => {
    setTechTags(nextTags);
    setTechDraft(nextDraft);
    const all = [
      ...nextTags,
      ...(nextDraft.trim() ? [normalizeTechnicalSkillLabel(nextDraft)] : []),
    ];
    updateField("technicalSkills", all.join(", "));
  };

  const addTechTag = (rawSkill: string) => {
    const normalized = normalizeTechnicalSkillLabel(rawSkill);
    if (!normalized) return;
    const exists = techTags.some(
      (t) => t.toLowerCase() === normalized.toLowerCase()
    );
    const nextTags = exists ? techTags : [...techTags, normalized];
    syncTechnicalField(nextTags, "");
  };

  const removeTechTag = (indexToRemove: number) => {
    const nextTags = techTags.filter((_, idx) => idx !== indexToRemove);
    syncTechnicalField(nextTags, techDraft);
  };

  const syncSoftField = (nextTags: string[], nextDraft: string) => {
    setSoftTags(nextTags);
    setSoftDraft(nextDraft);
    const all = [...nextTags, ...(nextDraft.trim() ? [nextDraft.trim()] : [])];
    updateField("softSkills", all.join(", "));
  };

  const addSoftTag = (rawSkill: string) => {
    const cleaned = rawSkill.trim();
    if (!cleaned) return;
    const exists = softTags.some(
      (t) => t.toLowerCase() === cleaned.toLowerCase()
    );
    const nextTags = exists ? softTags : [...softTags, cleaned];
    syncSoftField(nextTags, "");
  };

  const removeSoftTag = (indexToRemove: number) => {
    const nextTags = softTags.filter((_, idx) => idx !== indexToRemove);
    syncSoftField(nextTags, softDraft);
  };

  const changeStep = (nextStep: number) => {
    setStep(nextStep);
    onStepChange?.(nextStep);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim()) {
        setError("Nama lengkap dan alamat email wajib diisi untuk kontak standar ATS.");
        return;
      }
    } else if (step === 2) {
      if (!formData.institution.trim()) {
        setError("Nama institusi pendidikan wajib diisi.");
        return;
      }
    } else if (step === 3) {
      if (!formData.targetRole.trim()) {
        setError("Tentukan target posisi pekerjaan yang Anda minati.");
        return;
      }
    } else if (step === 4) {
      if (!formData.technicalSkills.trim()) {
        setError("Masukkan keahlian teknis atau tools yang Anda kuasai.");
        return;
      }
    }
    changeStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    changeStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.submitQuestionnaire(formData);
      onComplete(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat CV dari kuesioner. Periksa kembali koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & ATS Standards Progress Bar */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ce2731]">
              Onboarding Mandiri Standar ATS
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f2c56] mt-0.5 font-heading">
              Lengkapi Data Profil CV Anda
            </h2>
          </div>
          <span className="text-xs text-white font-extrabold bg-[#0f2c56] px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            Langkah {step} dari 5
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#ce2731] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-[#ce2731] text-white text-xs font-semibold rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: IDENTITAS & KONTAK */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 text-[#0f2c56] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
              <User className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3>Identitas &amp; Kontak Resmi (ATS Header)</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Format ATS mensyaratkan kontak yang jelas di bagian paling atas resume tanpa tabel tersembunyi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Contoh: Wira Fikri Ramadanu"
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Alamat Email Aktif *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Tautan LinkedIn atau Portofolio (Opsional)
              </label>
              <input
                type="url"
                value={formData.portfolioLink || ""}
                onChange={(e) => updateField("portfolioLink", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PENDIDIKAN TERAKHIR */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 text-[#0f2c56] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3>Riwayat Pendidikan Formal</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sistem ATS membaca jenjang, nama institusi resmi, program studi, dan tahun kelulusan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Jenjang Pendidikan *
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) =>
                  updateField(
                    "educationLevel",
                    e.target.value as QuestionnaireData["educationLevel"]
                  )
                }
                aria-label="Jenjang Pendidikan"
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56] cursor-pointer"
              >
                <option value="SMK">SMK / SMA</option>
                <option value="D3">Diploma (D3)</option>
                <option value="S1">Sarjana (S1 / D4)</option>
                <option value="S2">Magister (S2)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Nama Kampus / Sekolah *
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder="Contoh: Universitas Negeri Padang"
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Jurusan / Program Studi
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => updateField("major", e.target.value)}
                placeholder="Contoh: Teknik Informatika / Sistem Informasi"
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
                Tahun Kelulusan (atau Perkiraan)
              </label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => updateField("graduationYear", e.target.value)}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: TARGET POSISI KERJA */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 text-[#0f2c56] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3>Target Posisi &amp; Fokus Bidang Karir</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menentukan headline profesional pada resume ATS dan memandu sistem pencocokan mencari lowongan yang sejalan.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
              Posisi Kerja yang Dituju *
            </label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => updateField("targetRole", e.target.value)}
              placeholder="Contoh: Junior Frontend Developer / UI Engineer"
              className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Gunakan nama peran standar industri untuk meningkatkan skor kecocokan kata kunci.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: KEAHLIAN TEKNIS & TOOLS */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 text-[#0f2c56] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3>Keahlian Teknis &amp; Alat Kerja (Skills Section)</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bagian terpenting dalam penyaringan ATS. Ketik keahlian lalu tekan <strong>Enter</strong> (atau klik rekomendasi) agar kata kunci terbungkus menjadi tag keahlian.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
              Keahlian Teknis / Bahasa Pemrograman / Software *
            </label>
            <div className="w-full min-h-[54px] px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl flex flex-wrap items-center gap-2 focus-within:border-[#0f2c56] focus-within:bg-white transition-colors">
              {techTags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0f2c56] text-white text-xs font-bold"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTechTag(idx)}
                    aria-label={`Hapus ${tag}`}
                    className="w-4 h-4 rounded-full bg-white/15 hover:bg-[#ce2731] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={techDraft}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes(",")) {
                    const segments = val.split(",");
                    const toCommit = segments
                      .slice(0, -1)
                      .map((s) => normalizeTechnicalSkillLabel(s))
                      .filter(Boolean);
                    const remaining = segments[segments.length - 1] || "";
                    const nextTags = [...techTags];
                    for (const item of toCommit) {
                      if (!nextTags.some((t) => t.toLowerCase() === item.toLowerCase())) {
                        nextTags.push(item);
                      }
                    }
                    syncTechnicalField(nextTags, remaining);
                  } else {
                    syncTechnicalField(techTags, val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    if (techDraft.trim()) {
                      addTechTag(techDraft);
                    }
                  } else if (
                    e.key === "Backspace" &&
                    !techDraft &&
                    techTags.length > 0
                  ) {
                    removeTechTag(techTags.length - 1);
                  }
                }}
                placeholder={
                  techTags.length === 0
                    ? "Ketik skill (misal: Next.js) lalu tekan Enter..."
                    : "Tambah skill lain lalu tekan Enter..."
                }
                className="flex-1 min-w-[180px] py-1 text-sm bg-transparent text-[#0f2c56] font-medium focus:outline-none"
              />
            </div>
            {(() => {
              const { activeToken, suggestions } = getTechnicalRecommendations(
                techDraft,
                techTags
              );
              return (
                <div className="mt-2 p-3 rounded-xl bg-[#f4f7fb] border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0f2c56]">
                      <Sparkles className="w-3.5 h-3.5 text-[#ce2731]" />
                      {activeToken
                        ? `Rekomendasi untuk "${activeToken}":`
                        : "Rekomendasi Keahlian Standar ATS (Klik untuk menambah):"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Tekan Enter untuk membungkus kata
                    </span>
                  </div>
                  {suggestions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => addTechTag(sug)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white border border-slate-200 hover:border-[#0f2c56] text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500">
                      Tekan <strong>Enter</strong> untuk membungkus kata kunci yang sedang diketik menjadi tag.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
              Keterampilan Non-Teknis (Soft Skills)
            </label>
            <div className="w-full min-h-[48px] px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded-xl flex flex-wrap items-center gap-2 focus-within:border-[#0f2c56] focus-within:bg-white transition-colors">
              {softTags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0f2c56] text-white text-xs font-bold"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeSoftTag(idx)}
                    aria-label={`Hapus ${tag}`}
                    className="w-4 h-4 rounded-full bg-white/15 hover:bg-[#ce2731] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={softDraft}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes(",")) {
                    const segments = val.split(",");
                    const toCommit = segments
                      .slice(0, -1)
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const remaining = segments[segments.length - 1] || "";
                    const nextTags = [...softTags];
                    for (const item of toCommit) {
                      if (!nextTags.some((t) => t.toLowerCase() === item.toLowerCase())) {
                        nextTags.push(item);
                      }
                    }
                    syncSoftField(nextTags, remaining);
                  } else {
                    syncSoftField(softTags, val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    if (softDraft.trim()) {
                      addSoftTag(softDraft);
                    }
                  } else if (
                    e.key === "Backspace" &&
                    !softDraft &&
                    softTags.length > 0
                  ) {
                    removeSoftTag(softTags.length - 1);
                  }
                }}
                placeholder={
                  softTags.length === 0
                    ? "Ketik soft skill (misal: Problem Solving) lalu tekan Enter..."
                    : "Tambah soft skill lain lalu tekan Enter..."
                }
                className="flex-1 min-w-[180px] py-1 text-sm bg-transparent text-[#0f2c56] font-medium focus:outline-none"
              />
            </div>
            {(() => {
              const activeSoft = softDraft.trim().toLowerCase();
              const committedSoft = new Set(
                softTags.map((t) => t.trim().toLowerCase())
              );
              const filteredSoft = SOFT_SKILL_CATALOG.filter(
                (s) =>
                  !committedSoft.has(s.toLowerCase()) &&
                  s.toLowerCase() !== activeSoft &&
                  (!activeSoft || s.toLowerCase().includes(activeSoft))
              ).slice(0, 6);

              if (filteredSoft.length === 0) return null;
              return (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">
                    Saran Soft Skill:
                  </span>
                  {filteredSoft.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => addSoftTag(sug)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f4f7fb] hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white border border-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* STEP 5: PENGALAMAN & PROYEK */}
      {step === 5 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 text-[#0f2c56] font-extrabold text-base">
            <div className="w-8 h-8 rounded-lg bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3>Pengalaman Nyata: Proyek Kuliah, Magang atau Organisasi</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ceritakan proyek terbaik yang pernah Anda kerjakan. Sistem kami akan memformatnya menjadi poin-poin kata kerja aktif terukur standar ATS.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5">
              Deskripsi Pengalaman / Proyek
            </label>
            <textarea
              rows={4}
              value={formData.experienceSummary}
              onChange={(e) => updateField("experienceSummary", e.target.value)}
              placeholder="Contoh: Memimpin tim 4 orang dalam merancang aplikasi antrean web tugas akhir kampus dengan Next.js. Mengoptimasi query database sehingga respon halaman meningkat 40%."
              className="w-full px-3.5 py-2.5 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl text-[#0f2c56] font-medium focus:outline-none focus:border-[#0f2c56]"
            />
          </div>

          <div className="p-4 bg-[#0f2c56] rounded-2xl text-xs text-white space-y-1">
            <p className="font-extrabold text-white">Format Resume ATS Siap Dibuat:</p>
            <p className="text-white/85 leading-relaxed">
              Setelah tombol ditekan, profil Anda langsung dikonversi menjadi dokumen CV digital 1-kolom berstandar ATS dan dashboard karir Anda terbuka otomatis.
            </p>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-200">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-bold text-[#0f2c56] hover:text-white bg-slate-100 hover:bg-[#0f2c56] rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Lanjut</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Menyusun CV Standar ATS...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Buat CV Standar ATS &amp; Masuk Dashboard</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
