import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type UserRole = "jobseeker" | "employer" | "admin";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  pdpConsent: boolean;
  hasCompletedCvCheck: boolean;
  createdAt: string;
}

export interface StoredProfile {
  userId: string;
  fullName: string;
  headline: string;
  contactEmail: string;
  city: string;
  seniorityLevel: string;
  summary: string;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  experiences: Array<{
    title: string;
    organization: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
  }>;
  portfolioProjects?: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
}

export interface StoredCV {
  cvId: string;
  userId: string;
  fileName?: string;
  storedFilePath?: string;
  source: "upload" | "onboarding";
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
  profile: StoredProfile;
  isScannedImageWarning?: boolean;
  cvTextExcerpt: string;
  cvEmbedding?: number[];
  createdAt: string;
}

export interface StoredCompany {
  id: string;
  ownerUserId: string;
  companyName: string;
  industry: string;
  website: string;
  city: string;
  keywords: string;
  description: string;
  nib: string;
  npwp: string;
  legalityDoc: string;
  pdpCompliance: string;
  status: "verified" | "pending" | "incomplete";
  note: string;
  createdAt: string;
}

export interface StoredJob {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  location: string;
  workType: "full-time" | "part-time" | "internship" | "contract" | "remote";
  salaryRange?: string;
  source: "internal" | "jooble";
  externalUrl?: string;
  description: string;
  requiredSkills: string[];
  active: boolean;
  postedAt: string;
  jobEmbedding?: number[];
}

export interface StoredApplication {
  id: string;
  jobId: string;
  userId: string;
  cvId?: string;
  codeName: string;
  roleApplied: string;
  atsScore: number;
  matchReason: string;
  coverLetter?: string;
  status: "submitted" | "reviewed" | "shortlisted" | "rejected";
  candidateSummary?: {
    headline: string;
    education: string;
    skills: string[];
    experienceHighlight: string;
    cvSource: "upload" | "onboarding";
  };
  createdAt: string;
}

export interface AdminStandards {
  minAtsScore: number;
  maxCvSizeMb: number;
  slaSeconds: number;
  allowedFormat: "pdf_docx" | "pdf_only";
  blindScreeningRequired: boolean;
  requireFullLegality: boolean;
  retentionDays: string;
}

export interface DatabaseState {
  users: StoredUser[];
  profiles: StoredProfile[];
  cvs: StoredCV[];
  companies: StoredCompany[];
  jobs: StoredJob[];
  applications: StoredApplication[];
  standards: AdminStandards;
  weeklyPipeline: Array<{
    day: string;
    fullDay: string;
    cv: number;
    pass: number;
  }>;
}

const DATA_DIR = path.resolve(__dirname, "../../data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");

function buildInitialSeed(): DatabaseState {
  const defaultHash = bcrypt.hashSync("pasbana2026", 10);
  const now = new Date().toISOString();

  const wiraProfile: StoredProfile = {
    userId: "usr-1",
    fullName: "Wira Fikri Ramadanu",
    headline: "Junior Frontend & Fullstack Developer",
    contactEmail: "wira@student.unp.ac.id",
    city: "Padang, Indonesia",
    seniorityLevel: "Junior / Fresh Graduate",
    summary:
      "Lulusan S1 Teknik Informatika yang berfokus pada pengembangan aplikasi web modern menggunakan React, Next.js, TypeScript, dan REST API.",
    skills: {
      technical: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "REST API", "PostgreSQL"],
      soft: ["Komunikasi", "Kepemimpinan", "Problem Solving"],
      tools: ["Git", "GitHub", "Docker"],
    },
    experiences: [
      {
        title: "Frontend Lead - Proyek Pasbana AI",
        organization: "Universitas Negeri Padang",
        period: "2025 - 2026",
        description:
          "Membangun antarmuka evaluasi CV interaktif menggunakan Next.js, TypeScript, dan Tailwind CSS hingga meningkatkan kecepatan akses halaman sebesar 38%.",
      },
    ],
    education: [
      {
        institution: "Universitas Negeri Padang",
        degree: "S1",
        field: "Teknik Informatika",
        graduationYear: "2026",
      },
    ],
  };

  return {
    users: [
      {
        id: "usr-1",
        name: "Wira Fikri Ramadanu",
        email: "wira@student.unp.ac.id",
        passwordHash: defaultHash,
        role: "jobseeker",
        pdpConsent: true,
        hasCompletedCvCheck: true,
        createdAt: now,
      },
      {
        id: "usr-2",
        name: "PT Nusantara Inovasi",
        email: "hr@nusantara.co.id",
        passwordHash: defaultHash,
        role: "employer",
        pdpConsent: true,
        hasCompletedCvCheck: true,
        createdAt: now,
      },
      {
        id: "usr-3",
        name: "Admin Pasbana AI",
        email: "admin@pasbana.ai",
        passwordHash: defaultHash,
        role: "admin",
        pdpConsent: true,
        hasCompletedCvCheck: true,
        createdAt: now,
      },
    ],
    profiles: [wiraProfile],
    cvs: [
      {
        cvId: "cv-seed-1",
        userId: "usr-1",
        fileName: "CV-Wira-Fikri-ATS.pdf",
        source: "upload",
        overallScore: 88,
        dimensions: {
          structure: 92,
          clarity: 86,
          measurableImpact: 84,
          skillRelevance: 90,
          completeness: 88,
        },
        strengths: [
          "Format dokumen 1-kolom terbaca bersih oleh parser ATS.",
          "Kata kunci keahlian teknis relevan dengan posisi pengembangan web.",
          "Riwayat pendidikan dan kontak profesional lengkap.",
        ],
        weaknesses: [
          "Tautan portofolio proyek belum dicantumkan secara eksplisit.",
        ],
        recommendations: [
          "Tambahkan metrik pencapaian kuantitatif pada setiap proyek utama.",
          "Cantumkan tautan GitHub atau portofolio aktif di bagian atas CV.",
        ],
        profile: wiraProfile,
        cvTextExcerpt:
          "Wira Fikri Ramadanu wira@student.unp.ac.id Junior Frontend Developer. Menggunakan React, Next.js, TypeScript, Tailwind CSS, Node.js, REST API, PostgreSQL, Git, dan Docker. Membangun antarmuka evaluasi CV interaktif menggunakan Next.js hingga meningkatkan kecepatan akses halaman sebesar 38%.",
        createdAt: now,
      },
    ],
    companies: [
      {
        id: "comp-1",
        ownerUserId: "usr-2",
        companyName: "PT Nusantara Inovasi",
        industry: "Teknologi Informasi & Produk Digital",
        website: "https://nusantara.co.id",
        city: "Jakarta Selatan (Hybrid)",
        keywords: "React, Next.js, TypeScript, Tailwind CSS, Node.js, REST API, PostgreSQL",
        description:
          "Perusahaan teknologi yang berfokus pada pengembangan talenta digital dan solusi perangkat lunak modern di Indonesia.",
        nib: "9120300456781",
        npwp: "01.234.567.8-012.000",
        legalityDoc: "NIB & NPWP Terverifikasi",
        pdpCompliance: "Blind Screening Aktif",
        status: "verified",
        note: "Memenuhi seluruh standar kemitraan Pasbana dan aktif membuka lowongan mandiri.",
        createdAt: now,
      },
      {
        id: "comp-2",
        ownerUserId: "ext-comp-2",
        companyName: "PT Teknologi Nusantara",
        industry: "Software & Cloud",
        website: "https://teknologinusantara.id",
        city: "Jakarta Selatan",
        keywords: "Python, FastAPI, Docker, PostgreSQL, AWS",
        description: "Penyedia infrastruktur cloud dan layanan mikro skala enterprise.",
        nib: "9120300991122",
        npwp: "02.445.112.9-015.000",
        legalityDoc: "Menunggu Verifikasi NIB",
        pdpCompliance: "Persetujuan UU PDP Tercatat",
        status: "pending",
        note: "Pengajuan kemitraan baru menunggu audit dokumen legalitas NIB oleh Admin.",
        createdAt: now,
      },
      {
        id: "comp-3",
        ownerUserId: "ext-comp-3",
        companyName: "Studio Analitik Indonesia",
        industry: "Data & Riset",
        website: "https://studioanalitik.co.id",
        city: "Bandung (Remote)",
        keywords: "Python, SQL, Pandas, Data Analysis, Excel",
        description: "Konsultan analitik data dan otomasi bisnis untuk industri ritel.",
        nib: "9120300887766",
        npwp: "03.118.229.4-401.000",
        legalityDoc: "Menunggu Verifikasi NPWP",
        pdpCompliance: "Persetujuan UU PDP Tercatat",
        status: "pending",
        note: "Dokumen NIB valid, menunggu pencocokan NPWP badan usaha.",
        createdAt: now,
      },
      {
        id: "comp-4",
        ownerUserId: "ext-comp-4",
        companyName: "CV Sentosa Abadi",
        industry: "Operasional & Jasa",
        website: "https://sentosaabadi.id",
        city: "Surabaya",
        keywords: "Administrasi, Microsoft Office, Excel, Komunikasi",
        description: "Layanan dukungan operasional dan manajemen administrasi terpadu.",
        nib: "",
        npwp: "04.221.334.1-605.000",
        legalityDoc: "NIB Belum Diunggah",
        pdpCompliance: "Belum Mengaktifkan Blind Screening",
        status: "incomplete",
        note: "Diminta melengkapi nomor NIB dan persetujuan blind screening UU PDP.",
        createdAt: now,
      },
    ],
    jobs: [
      {
        id: "job-1",
        companyId: "comp-1",
        companyName: "PT Nusantara Inovasi",
        title: "Junior Frontend Developer",
        location: "Jakarta (Hybrid)",
        workType: "full-time",
        salaryRange: "Rp 7.000.000 - Rp 10.000.000",
        source: "internal",
        description:
          "Membangun dan mengoptimalkan aplikasi web modern menggunakan React, Next.js, TypeScript, Tailwind CSS, serta integrasi REST API bersama tim produk.",
        requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST API", "Git"],
        active: true,
        postedAt: now,
      },
      {
        id: "job-2",
        companyId: "comp-1",
        companyName: "PT Nusantara Inovasi",
        title: "Backend Node.js Engineer",
        location: "Bandung (Remote)",
        workType: "full-time",
        salaryRange: "Rp 8.500.000 - Rp 12.000.000",
        source: "internal",
        description:
          "Merancang layanan REST API menggunakan Node.js, Express.js, TypeScript, PostgreSQL, Redis, dan Docker dengan standar keamanan tinggi.",
        requiredSkills: ["Node.js", "Express.js", "TypeScript", "PostgreSQL", "Docker", "REST API"],
        active: true,
        postedAt: now,
      },
      {
        id: "job-3",
        companyId: "comp-1",
        companyName: "PT Nusantara Inovasi",
        title: "Data Analyst Intern",
        location: "Jakarta Selatan (On-site)",
        workType: "internship",
        salaryRange: "Rp 3.500.000 - Rp 4.500.000",
        source: "internal",
        description:
          "Mengolah dataset produk menggunakan Python, SQL, Pandas, dan Microsoft Excel untuk menyusun laporan analisis data mingguan.",
        requiredSkills: ["Python", "SQL", "Pandas", "Data Analysis", "Excel"],
        active: true,
        postedAt: now,
      },
    ],
    applications: [
      {
        id: "app-1",
        jobId: "job-1",
        userId: "usr-1",
        cvId: "cv-seed-1",
        codeName: "Kandidat #ATS-884",
        roleApplied: "Junior Frontend Developer",
        atsScore: 91,
        matchReason:
          "Kuat pada React, Next.js, TypeScript, Tailwind CSS, dan REST API sesuai kebutuhan posisi.",
        status: "shortlisted",
        candidateSummary: {
          headline: "Junior Frontend & Fullstack Developer",
          education: "S1 Teknik Informatika - Universitas Negeri Padang (2026)",
          skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST API", "Git"],
          experienceHighlight:
            "Membangun antarmuka evaluasi CV interaktif menggunakan Next.js hingga meningkatkan kecepatan akses halaman sebesar 38%.",
          cvSource: "upload",
        },
        createdAt: now,
      },
      {
        id: "app-2",
        jobId: "job-2",
        userId: "usr-ext-1",
        codeName: "Kandidat #ATS-792",
        roleApplied: "Backend Node.js Engineer",
        atsScore: 85,
        matchReason:
          "Memiliki pengalaman membangun REST API dengan Node.js, PostgreSQL, dan Docker.",
        status: "reviewed",
        candidateSummary: {
          headline: "Backend Software Engineer",
          education: "S1 Ilmu Komputer (2025)",
          skills: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "REST API"],
          experienceHighlight:
            "Merancang arsitektur REST API dan optimasi query PostgreSQL untuk layanan transaksi harian.",
          cvSource: "onboarding",
        },
        createdAt: now,
      },
      {
        id: "app-3",
        jobId: "job-3",
        userId: "usr-ext-2",
        codeName: "Kandidat #ATS-741",
        roleApplied: "Data Analyst Intern",
        atsScore: 79,
        matchReason:
          "Menguasai SQL, Python, dan Excel untuk pelaporan analisis data operasional.",
        status: "submitted",
        candidateSummary: {
          headline: "Data & Business Analyst Enthusiast",
          education: "S1 Statistika (2026)",
          skills: ["Python", "SQL", "Excel", "Data Analysis"],
          experienceHighlight:
            "Menyusun dashboard evaluasi penjualan bulanan menggunakan SQL dan Python.",
          cvSource: "upload",
        },
        createdAt: now,
      },
    ],
    standards: {
      minAtsScore: 75,
      maxCvSizeMb: 5,
      slaSeconds: 60,
      allowedFormat: "pdf_docx",
      blindScreeningRequired: true,
      requireFullLegality: true,
      retentionDays: "90",
    },
    weeklyPipeline: [
      { day: "Sen", fullDay: "Senin", cv: 145, pass: 102 },
      { day: "Sel", fullDay: "Selasa", cv: 172, pass: 124 },
      { day: "Rab", fullDay: "Rabu", cv: 164, pass: 118 },
      { day: "Kam", fullDay: "Kamis", cv: 210, pass: 158 },
      { day: "Jum", fullDay: "Jumat", cv: 238, pass: 184 },
      { day: "Sab", fullDay: "Sabtu", cv: 190, pass: 142 },
      { day: "Min", fullDay: "Minggu", cv: 129, pass: 85 },
    ],
  };
}

function ensureDirs(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

let cachedDb: DatabaseState | null = null;

export function getDb(): DatabaseState {
  ensureDirs();
  if (cachedDb) return cachedDb;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      cachedDb = JSON.parse(raw) as DatabaseState;
      return cachedDb;
    } catch {
      // recreate if corrupted
    }
  }

  cachedDb = buildInitialSeed();
  saveDb(cachedDb);
  return cachedDb;
}

export function saveDb(state: DatabaseState): void {
  ensureDirs();
  cachedDb = state;
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf8");
}
