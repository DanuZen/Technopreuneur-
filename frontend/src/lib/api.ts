import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  CVAnalysisResult,
  QuestionnaireData,
  JobItem,
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
      throw new Error(errorMessage);
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

    return this.request<CVAnalysisResult>("/cvs/upload", {
      method: "POST",
      body: formData,
    });
  }

  // CV Endpoints (Option B: Submit Questionnaire for users without CV)
  async submitQuestionnaire(
    data: QuestionnaireData
  ): Promise<CVAnalysisResult> {
    return this.request<CVAnalysisResult>("/cvs/from-questionnaire", {
      method: "POST",
      body: JSON.stringify(data),
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
}

export const api = new ApiClient();
