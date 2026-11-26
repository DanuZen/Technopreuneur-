import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  CVAnalysisResult,
  QuestionnaireData,
  JobItem,
  MyApplicationItem,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cm_token");
    }
    return null;
  }

  public setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("cm_token", token);
    }
  }

  public removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cm_token");
      localStorage.removeItem("cm_user");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.message ||
        data.error ||
        `Request gagal dengan status ${response.status}`;
      const err = new Error(errorMessage) as Error & { status?: number };
      err.status = response.status;
      throw err;
    }

    return data as T;
  }

  // Auth Endpoints
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    this.setToken(res.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("cm_user", JSON.stringify(res.user));
    }
    return res;
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    this.setToken(res.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("cm_user", JSON.stringify(res.user));
    }
    return res;
  }

  // CV Endpoints (Option A: Upload CV File)
  async uploadCV(file: File): Promise<CVAnalysisResult> {
    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await this.request<CVAnalysisResult>("/cvs/upload", {
        method: "POST",
        body: formData,
      });
      const resultWithFileName: CVAnalysisResult = {
        ...res,
        fileName: res.fileName || file.name,
      };
      this.saveAnalysis(resultWithFileName);
      return resultWithFileName;
    } catch (err) {
      const status = (err as Error & { status?: number })?.status;
      if (status && status >= 400 && status < 500) {
        throw err;
      }
      // Fallback local mock simulation only when backend API is unreachable
      const mockResult: CVAnalysisResult = {
        cvId: `cv-${Date.now()}`,
        fileName: file.name,
        overallScore: 88,
        dimensions: {
          structure: 92,
          clarity: 86,
          measurableImpact: 84,
          skillRelevance: 90,
          completeness: 88,
        },
        strengths: [
          "Format berkas 1-kolom ATS-friendly terbaca jelas tanpa tabel kompleks.",
          "Memuat kata kunci teknis yang kuat di bidang pengembangan perangkat lunak.",
          "Informasi kontak dan riwayat pendidikan formal tersusun rapi.",
        ],
        weaknesses: [
          "Beberapa poin riwayat kerja belum mencantumkan metrik angka peningkatan.",
          "Belum ada tautan portofolio daring atau repositori GitHub aktif.",
        ],
        recommendations: [
          "Tambahkan angka kuantitatif pada pencapaian proyek (contoh: 'Meningkatkan kecepatan load 35%').",
          "Sertakan tautan profil LinkedIn atau portofolio digital yang dapat diakses rekruter.",
        ],
        profile: {
          fullName: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Kandidat Terdaftar",
          headline: "Calon Profesional Muda",
          summary: "Lulusan yang memiliki antusiasme tinggi dalam implementasi teknologi web modern, berorientasi pada pemecahan masalah dan kolaborasi tim.",
          education: [
            {
              institution: "Universitas Negeri Padang",
              degree: "Sarjana (S1)",
              field: "Teknik Informatika",
              graduationYear: "2026",
            },
          ],
          skills: {
            technical: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
            soft: ["Problem Solving", "Komunikasi Tim", "Manajemen Waktu"],
            tools: ["VS Code", "Figma", "Postman"],
          },
          experiences: [
            {
              title: "Frontend Developer (Proyek Mandiri / Kampus)",
              organization: "Laboratorium Komputasi",
              period: "2024 - 2025",
              description: "Mengembangkan antarmuka aplikasi web berbasis Next.js dengan arsitektur komponen modular dan integrasi RESTful API.",
            },
          ],
        },
      };
      this.saveAnalysis(mockResult);
      return mockResult;
    }
  }

  // CV Endpoints (Option B: Submit Questionnaire for users without CV)
  async submitQuestionnaire(
    data: QuestionnaireData
  ): Promise<CVAnalysisResult> {
    try {
      const res = await this.request<CVAnalysisResult>("/cvs/from-questionnaire", {
        method: "POST",
        body: JSON.stringify(data),
      });
      this.saveAnalysis(res);
      return res;
    } catch (err) {
      const status = (err as Error & { status?: number })?.status;
      if (status && status >= 400 && status < 500) {
        throw err;
      }
      // Fallback local ATS generator simulation only when backend is unreachable
      const techSkills = data.technicalSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const softSkills = data.softSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const mockResult: CVAnalysisResult = {
        cvId: `cv-gen-${Date.now()}`,
        overallScore: 89,
        dimensions: {
          structure: 95,
          clarity: 88,
          measurableImpact: 82,
          skillRelevance: 91,
          completeness: 89,
        },
        strengths: [
          "Format resume disusun mengikuti standar tata letak ATS industri 100%.",
          "Riwayat pendidikan dan fokus bidang karir terdefinisi secara spesifik.",
          "Keahlian teknis relevan dengan kebutuhan lowongan kerja terkini.",
        ],
        weaknesses: [
          "Pengalaman proyek masih perlu dilengkapi dengan dokumentasi tautan portofolio.",
        ],
        recommendations: [
          "Tambahkan bukti portofolio visual untuk memperkuat kredibilitas teknis.",
          "Perbanyak pengalaman kepemimpinan atau kepanitiaan yang menonjolkan soft skills.",
        ],
        profile: {
          fullName: data.fullName || "Kandidat CareerMatch",
          headline: data.targetRole || "Fresh Graduate",
          contactEmail: data.email,
          summary: `Lulusan ${data.educationLevel} jurusan ${data.major || "Teknologi"} dari ${data.institution || "Perguruan Tinggi"}, dengan spesialisasi pada posisi ${data.targetRole || "bidang terkait"}. Berkomitmen menerapkan keahlian teknis untuk memberikan dampak nyata pada perusahaan.`,
          education: [
            {
              institution: data.institution || "Perguruan Tinggi Terdaftar",
              degree: data.educationLevel || "S1",
              field: data.major || "Teknologi Informasi",
              graduationYear: data.graduationYear || "2026",
            },
          ],
          skills: {
            technical: techSkills.length > 0 ? techSkills : ["TypeScript", "React", "Tailwind CSS"],
            soft: softSkills.length > 0 ? softSkills : ["Kolaborasi Tim", "Problem Solving"],
            tools: ["Git", "GitHub"],
          },
          experiences: [
            {
              title: `Proyek Utama: ${data.targetRole || "Penerapan Solusi"}`,
              organization: data.institution || "Pengalaman Akademik / Kampus",
              period: `${data.graduationYear || "2025"} - Sekarang`,
              description: data.experienceSummary || "Mengerjakan proyek pengembangan dan implementasi sistem dengan efektivitas kerja tim yang solid.",
            },
          ],
          portfolioProjects: data.portfolioLink
            ? [
                {
                  name: "Portofolio Utama",
                  description: "Tautan portofolio dan repositori proyek",
                  link: data.portfolioLink,
                },
              ]
            : undefined,
        },
      };
      this.saveAnalysis(mockResult);
      return mockResult;
    }
  }

  // Local Storage Helpers for CV Analysis & Session History
  saveAnalysis(result: CVAnalysisResult): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("cm_analysis", JSON.stringify(result));
      const existing = this.getHistory().filter((item) => item.cvId !== result.cvId);
      const updated = [result, ...existing].slice(0, 20);
      localStorage.setItem("cm_history", JSON.stringify(updated));
      window.dispatchEvent(new Event("pasbana:history-updated"));
    }
  }

  getHistory(): CVAnalysisResult[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cm_history");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed as CVAnalysisResult[];
        } catch {
          return [];
        }
      }
    }
    return [];
  }

  getAnalysisById(cvId: string): CVAnalysisResult | null {
    const history = this.getHistory();
    const found = history.find((item) => item.cvId === cvId);
    if (found) return found;
    const current = this.getCurrentAnalysis();
    if (current && current.cvId === cvId) return current;
    return null;
  }

  removeHistory(cvId: string): void {
    if (typeof window !== "undefined") {
      const updated = this.getHistory().filter((item) => item.cvId !== cvId);
      localStorage.setItem("cm_history", JSON.stringify(updated));
      window.dispatchEvent(new Event("pasbana:history-updated"));
    }
  }

  getCurrentAnalysis(): CVAnalysisResult | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cm_analysis");
      if (stored) {
        try {
          return JSON.parse(stored) as CVAnalysisResult;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  clearAnalysis(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cm_analysis");
    }
  }

  async deleteCV(cvId: string): Promise<void> {
    try {
      await this.request<{ success: boolean }>(`/cvs/${encodeURIComponent(cvId)}`, {
        method: "DELETE",
      });
    } catch {
      // Tetap bersihkan data lokal meskipun sesi sedang offline atau memakai riwayat lokal
    } finally {
      this.removeHistory(cvId);
      const current = this.getCurrentAnalysis();
      if (current && current.cvId === cvId) {
        this.clearAnalysis();
      }
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.request<{ success: boolean }>("/users/me", {
        method: "DELETE",
      });
    } catch (err) {
      const status = (err as Error & { status?: number })?.status;
      if (status && status >= 400 && status < 500 && status !== 401 && status !== 404) {
        throw err;
      }
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cm_token");
        localStorage.removeItem("cm_user");
        localStorage.removeItem("cm_analysis");
        localStorage.removeItem("cm_history");
        localStorage.removeItem("pasbana_user_profile_detail");
        localStorage.removeItem("pasbana_saved_jobs");
      }
    }
  }

  getSavedJobIds(): string[] {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("pasbana_saved_jobs");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  toggleSavedJob(jobId: string): string[] {
    if (typeof window !== "undefined") {
      const current = this.getSavedJobIds();
      const updated = current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [jobId, ...current];
      localStorage.setItem("pasbana_saved_jobs", JSON.stringify(updated));
      window.dispatchEvent(new Event("pasbana:saved-jobs-updated"));
      return updated;
    }
    return [];
  }

  // Interactive CV Evaluation Chat (Connected to backend-ai /internal/v1/cv/chat)
  async chatCV(payload: {
    cvId: string;
    question: string;
    overallScore: number;
    dimensions: CVAnalysisResult["dimensions"];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }): Promise<{ answer: string; status?: string }> {
    return this.request<{ answer: string; status?: string }>("/cvs/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Jobs & Recommendations
  async getRecommendedJobs(): Promise<JobItem[]> {
    return this.request<JobItem[]>("/jobs/recommendations");
  }

  async getJobs(params?: {
    keyword?: string;
    location?: string;
    workType?: string;
  }): Promise<JobItem[]> {
    const searchParams = new URLSearchParams();
    if (params?.keyword) searchParams.set("keyword", params.keyword);
    if (params?.location) searchParams.set("location", params.location);
    if (params?.workType) searchParams.set("workType", params.workType);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/jobs?${queryString}` : "/jobs";
    return this.request<JobItem[]>(endpoint);
  }

  async applyJob(jobId: string, coverLetter?: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>("/applications", {
      method: "POST",
      body: JSON.stringify({ jobId, coverLetter }),
    });
  }

  async getMyApplications(): Promise<MyApplicationItem[]> {
    try {
      return await this.request<MyApplicationItem[]>("/applications/me");
    } catch {
      return [];
    }
  }

  // Jobseeker Profile CRUD
  async getProfile<T = Record<string, unknown>>(): Promise<T> {
    return this.request<T>("/profile");
  }

  async updateProfile<T = Record<string, unknown>>(payload: T): Promise<T> {
    return this.request<T>("/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  // Company Endpoints (Employer)
  async getCompanyJobs<T = unknown[]>(): Promise<T> {
    return this.request<T>("/company/jobs");
  }

  async createCompanyJob<T = unknown>(payload: {
    title: string;
    location: string;
    type: string;
  }): Promise<T> {
    return this.request<T>("/company/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async toggleCompanyJob<T = unknown>(jobId: string, active: boolean): Promise<T> {
    return this.request<T>(`/company/jobs/${jobId}`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    });
  }

  async getCompanyApplicants<T = unknown[]>(status?: string): Promise<T> {
    const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
    return this.request<T>(`/company/applicants${query}`);
  }

  async updateCompanyApplicantStatus<T = unknown>(
    applicantId: string,
    status: "reviewed" | "shortlisted" | "rejected"
  ): Promise<T> {
    return this.request<T>(`/company/applicants/${applicantId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async getCompanyProfile<T = Record<string, unknown>>(): Promise<T> {
    return this.request<T>("/company/profile");
  }

  async updateCompanyProfile<T = Record<string, unknown>>(payload: T): Promise<T> {
    return this.request<T>("/company/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  // Admin Endpoints (Aggregate, Partner Audit, Standards, Executive Reports)
  async getAdminOverview<T = Record<string, unknown>>(): Promise<T> {
    return this.request<T>("/admin/overview");
  }

  async getAdminPartners<T = unknown[]>(): Promise<T> {
    return this.request<T>("/admin/partners");
  }

  async auditAdminPartner<T = unknown>(
    partnerId: string,
    payload: { status: "verified" | "pending" | "incomplete"; note?: string }
  ): Promise<T> {
    return this.request<T>(`/admin/partners/${partnerId}/audit`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async getAdminStandards<T = Record<string, unknown>>(): Promise<T> {
    return this.request<T>("/admin/standards");
  }

  async updateAdminStandards<T = Record<string, unknown>>(payload: {
    minAtsScore: number;
    maxCvSizeMb: number;
    slaSeconds: number;
    allowedFormat: "pdf_docx" | "pdf_only";
    blindScreeningRequired: boolean;
    requireFullLegality: boolean;
    retentionDays: string;
  }): Promise<T> {
    return this.request<T>("/admin/standards", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async getAdminReport<T = Record<string, unknown>>(
    period: "bulan" | "kuartal" | "tahun" = "bulan"
  ): Promise<T> {
    return this.request<T>(`/admin/reports?period=${encodeURIComponent(period)}`);
  }
}

export const api = new ApiClient();

