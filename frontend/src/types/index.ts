export type UserRole = "jobseeker" | "employer" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  pdpConsent: boolean;
}

// 5 Dimensi Evaluasi Kualitas CV
export interface CVDimensionScore {
  structure: number; // 0-100
  clarity: number; // 0-100
  measurableImpact: number; // 0-100
  skillRelevance: number; // 0-100
  completeness: number; // 0-100
}

export interface CVProfileData {
  fullName: string;
  headline?: string;
  contactEmail?: string;
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
  }>;
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
  portfolioProjects?: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
}

export interface CVAnalysisResult {
  cvId: string;
  overallScore: number; // 0-100
  dimensions: CVDimensionScore;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  profile: CVProfileData;
  isScannedImageWarning?: boolean;
}

// Skema Kuesioner untuk Pencari Kerja yang Belum Punya CV
export interface QuestionnaireData {
  fullName: string;
  email: string;
  phone?: string;
  educationLevel: "SMK" | "D3" | "S1" | "S2" | "Lainnya";
  institution: string;
  major: string;
  graduationYear: string;
  targetRole: string; // misal: "Frontend Developer", "Digital Marketer"
  technicalSkills: string; // comma separated or text
  softSkills: string;
  experienceSummary: string; // deskripsi pengalaman magang / organisasi / proyek kuliah
  portfolioLink?: string;
}

// Lowongan Kerja & Hasil Rekomendasi Matching
export interface JobItem {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  workType: "full-time" | "part-time" | "internship" | "contract" | "remote";
  salaryRange?: string;
  source: "internal" | "jooble";
  externalUrl?: string;
  description: string;
  requiredSkills: string[];
  postedAt: string;
  matchScore?: number; // 0-100
  matchReason?: string[];
  missingSkills?: string[];
}
