# CareerMatch AI — Workflow, Arsitektur & Model Data

Dokumen ini mendefinisikan seluruh alur operasional pengguna, rancangan pipeline kecerdasan buatan (AI asinkron), diagram arsitektur teknis, dan rancangan model data database sistem.

---

## 1. Alur Pengguna (User Journeys)

### 1.1 Alur Pencari Kerja (Job Seeker Flow)

Pencari kerja mengunggah CV, meninjau hasil ekstraksi dan skor evaluasi AI, mengoreksi data profil bila diperlukan, lalu menerima rekomendasi lowongan kerja terpersonalisasi.

```mermaid
flowchart TD
    A([Mulai]) --> B[Registrasi / Login Akun]
    B --> C{Persetujuan Consent PDP?}
    C -- Belum Disetujui --> D[Tampilkan Modal Consent UU PDP]
    D --> E[Pengguna Setuju]
    E --> F[Halaman Unggah CV]
    C -- Sudah Disetujui --> F
    F --> G[Unggah Dokumen CV\nPDF / DOCX maks 5MB]
    G --> H[Validasi Format & Ukuran File]
    H -- Tidak Valid --> I[Munculkan Pesan Error]
    I --> F
    H -- Valid --> J[Simpan File ke Storage Privat\nBuat Task di Job Queue]
    J --> K[Worker: Ekstraksi Teks & Panggil LLM]
    K --> L{Teks Terbaca?}
    L -- Teks Kosong / Scan --> M[Notifikasi: CV Berupa Scan Gambar,\nSilakan Unggah Versi Teks Digital]
    M --> F
    L -- Sukses --> N[Tampilkan Skor CV 0-100\n& Rincian 5 Aspek Analisis]
    N --> O[Tinjau Data Profil Hasil AI]
    O --> P{Perlu Koreksi Manual?}
    P -- Ya --> Q[Formulir Koreksi Profil oleh User]
    Q --> R[Simpan Profil Final & Update Embedding]
    P -- Tidak --> R
    R --> S[Jalankan Engine Matching 2-Tahap]
    S --> T[Tampilkan Daftar Lowongan Terurut Skor]
    T --> U{Pilih Aksi Lowongan}
    U -- Lowongan Internal --> V[Klik 'Lamar Sekarang'\nCV & Profil Dikirim ke Employer]
    U -- Lowongan Eksternal --> W[Klik 'Lamar di Sumber'\nRedirect ke Portal Mitra Asli]
    V --> X([Selesai])
    W --> X
```

---

### 1.2 Alur Pemberi Kerja (Employer Flow)

Employer mendaftarkan profil perusahaan, mempublikasikan lowongan pekerjaan baru, dan meninjau pelamar yang telah diperingkat oleh AI.

```mermaid
flowchart TD
    A([Mulai]) --> B[Registrasi Akun Employer & Isi Profil Perusahaan]
    B --> C[Dashboard Employer]
    C --> D[Buat Lowongan Baru\nJudul, Deskripsi, Kualifikasi, Lokasi, Gaji]
    D --> E[Submit Lowongan]
    E --> F{Moderasi Admin}
    F -- Ditolak / Perlu Revisi --> G[Kirim Notifikasi Revisi ke Employer]
    G --> D
    F -- Disetujui --> H[Status Lowongan Aktif]
    H --> I[Worker: Generate Embedding Vektor Lowongan]
    I --> J[Tersedia di Sistem Pencarian & Matching]
    J --> K[Pelamar Mengajukan Lamaran]
    K --> L[Dashboard Pelamar Lowongan]
    L --> M[Daftar Pelamar Terurut Skor Kecocokan AI]
    M --> N[Tinjau Ringkasan AI & Detail Profil Pelamar]
    N --> O[Ubah Status Pelamar:\nReviewed / Shortlisted / Rejected]
    O --> P([Selesai])
```

---

## 2. Pipeline AI Asinkron (AI Async Processing)

Untuk menjamin performa responsif tanpa memblokir koneksi HTTP pengguna, seluruh komputasi intensif (ekstraksi teks, request LLM, dan kalkulasi vektor) didelegasikan ke antrean latar belakang (*background job queue*).

```mermaid
flowchart LR
    subgraph Jalur1["Jalur 1: Pemrosesan CV"]
        A1[User Upload CV] --> B1[Queue: process-cv]
        B1 --> C1[Worker Ekstraksi Teks]
        C1 --> D1[LLM Parsing & Scoring]
        D1 --> E1[Generate Vektor Profil CV]
        E1 --> F1[(Database: cv_profiles)]
    end

    subgraph Jalur2["Jalur 2: Ingest Lowongan"]
        A2[Loker Baru / Sync API] --> B2[Queue: ingest-job]
        B2 --> C2[Normalisasi Data Lowongan]
        C2 --> D2[Generate Vektor Deskripsi Lowongan]
        D2 --> E2[(Database: jobs)]
    end

    subgraph Jalur3["Jalur 3: Matching 2-Tahap"]
        A3[Trigger Matching Rekomendasi] --> B3[Tahap 1: Pencarian Kemiripan Cosinus pgvector\nAmbil Top 20-50 Lowongan]
        B3 --> C3[Tahap 2: Evaluasi Kontekstual LLM\nSkor 0-100, Alasan, Missing Skills]
        C3 --> D3[(Database: matches / Cache)]
        D3 --> E3[Sajikan Hasil ke UI Pelamar]
    end
```

### Mekanisme Matching Dua Tahap (*Two-Stage Matching*)
1. **Tahap 1 (Vektor Kemiripan - Filter Cepat & Murah):**
   - Menggunakan model *text embedding* (misal: `text-embedding-3-small` atau sekelasnya) berdimensi 1536.
   - Kueri SQL pgvector memanfaatkan indeks HNSW / IVFFlat untuk menyaring puluhan ribu lowongan menjadi 20–50 kandidat teratas dalam waktu $< 100\text{ ms}$.
2. **Tahap 2 (LLM Re-Ranking & Gap Analysis - Akurat & Kontekstual):**
   - Mengirimkan profil terstruktur pelamar bersama 20 kandidat lowongan teratas ke LLM dengan prompt terstandar.
   - LLM memvalidasi pemenuhan syarat spesifik, menentukan kesenjangan keahlian (*missing skills*), serta memberikan skor akhir dan justifikasi objektif.

---

## 3. Arsitektur Sistem & Tech Stack

Platform mengusung arsitektur monolit modular (atau modular micro-service) yang efisien untuk skala MVP hingga ribuan pengguna aktif:

```mermaid
flowchart TD
    Client[Klien Web Mobile / Desktop\nNext.js + Tailwind CSS] <--> |HTTPS / REST API| Gateway[API Server / Next.js API Routes]
    
    Gateway <--> Auth[Auth Service\nSupabase Auth / NextAuth]
    Gateway <--> Storage[Private Object Storage\nSupabase Storage / Cloudflare R2]
    Gateway <--> DB[(PostgreSQL + pgvector)]
    Gateway --> |Push Jobs| Queue[Message / Job Queue\npg-boss / BullMQ]

    subgraph WorkerService["Worker Engine (Background Tasks)"]
        Queue <--> Worker[Background Worker Processor]
        Worker <--> Parser[PDF / DOCX Text Parser]
        Worker <--> LLM[LLM & Embedding Provider API\nOpenAI / Gemini / Anthropic]
        Worker <--> ExtAPI[Job Aggregator API\nJooble API Client]
        Worker <--> DB
        Worker <--> Storage
    end
```

### Detail Pilihan Teknologi (Final Stack Sesuai Peran Tim)
- **Frontend (`frontend/` - Wira Fikri Ramadanu):**
  - Next.js (App Router, TypeScript) + Tailwind CSS + Lucide React + TanStack Query.
  - Mobile-first responsive UI, visualisasi skor radial, formulir koreksi interaktif.
- **Backend API (`backend-api/` - Muhammad Gilang Ramadhan):**
  - Node.js + Express (TypeScript), Prisma ORM / pg node driver.
  - PostgreSQL $\ge 15$ dengan ekstensi `pgvector`.
  - Autentikasi JWT / Sessions, RBAC role middleware, Pre-signed Storage URL handler.
- **Backend AI (`backend-ai/` - Florensius Panca Gati):**
  - Python 3.11+ dengan **FastAPI**, Pydantic v2, Uvicorn.
  - Ekstraksi Dokumen: `pypdf`, `python-docx` / `pdfplumber`.
  - AI Orchestration: LangChain / LiteLLM / Gemini SDK / OpenAI SDK.
  - Vector & Embedding: Embedding 1536-dimensi, hybrid cosine matching engine.
  - Integrasi API Eksternal: Jooble API Ingestion Client.

---

## 4. Model Data & Skema Database

Sistem tersusun atas 10 tabel relasional utama:

```mermaid
erDiagram
    users ||--o{ consents : gives
    users ||--o{ cvs : uploads
    users ||--o{ companies : owns
    users ||--o{ applications : submits
    users ||--o{ saved_jobs : bookmarks
    users ||--o{ ai_usage_logs : generates

    cvs ||--|| cv_profiles : contains
    cv_profiles ||--o{ matches : receives
    jobs ||--o{ matches : compared_with

    companies ||--o{ jobs : posts
    jobs ||--o{ applications : receives
    cvs ||--o{ applications : references

    users {
        uuid id PK
        string email UK
        string password_hash
        string role "jobseeker | employer | admin"
        string full_name
        timestamp created_at
        timestamp deleted_at
    }

    consents {
        uuid id PK
        uuid user_id FK
        string consent_type
        string policy_version
        timestamp accepted_at
    }

    cvs {
        uuid id PK
        uuid user_id FK
        string file_path
        string original_filename
        string file_type
        string status "uploaded | processing | completed | failed"
        timestamp uploaded_at
        timestamp deleted_at
    }

    cv_profiles {
        uuid id PK
        uuid cv_id FK
        text summary
        jsonb skills
        jsonb experiences
        jsonb education
        string seniority
        string target_field
        jsonb languages
        int score
        jsonb score_breakdown
        jsonb strengths
        jsonb weaknesses
        jsonb suggestions
        boolean verified_by_user
        vector embedding "dimensi 1536"
        timestamp created_at
    }

    companies {
        uuid id PK
        uuid owner_user_id FK
        string name
        text description
        string website
        string logo_url
        boolean is_verified
        timestamp created_at
    }

    jobs {
        uuid id PK
        string source "internal | jooble | karirhub"
        string external_id
        uuid company_id FK "nullable jika external"
        string title
        text description
        jsonb skills_required
        string location
        string work_type "remote | hybrid | onsite"
        numeric salary_min
        numeric salary_max
        string apply_url
        string status "draft | pending | active | closed | rejected"
        vector embedding "dimensi 1536"
        timestamp posted_at
        timestamp expires_at
    }

    matches {
        uuid id PK
        uuid cv_profile_id FK
        uuid job_id FK
        float vector_score
        int llm_score
        jsonb reasons
        jsonb missing_skills
        string verdict
        timestamp created_at
    }

    applications {
        uuid id PK
        uuid job_id FK
        uuid user_id FK
        uuid cv_id FK
        string status "submitted | reviewed | shortlisted | rejected"
        int match_score
        timestamp created_at
    }

    saved_jobs {
        uuid user_id FK
        uuid job_id FK
        timestamp created_at
    }

    ai_usage_logs {
        uuid id PK
        uuid user_id FK
        string feature "cv_parse | cv_score | matching"
        int tokens_prompt
        int tokens_completion
        numeric estimated_cost_idr
        timestamp created_at
    }
```

---

## 5. Kontrak Data Output AI (JSON Schemas)

### 5.1 Skema Keluaran Profil CV (`cv_profiles`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CVAnalysisOutput",
  "type": "object",
  "required": [
    "summary",
    "skills",
    "experiences",
    "education",
    "seniority",
    "score",
    "score_breakdown",
    "strengths",
    "weaknesses",
    "suggestions"
  ],
  "properties": {
    "summary": { "type": "string", "description": "Ringkasan profesional 2-3 kalimat" },
    "skills": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Daftar keahlian teknis dan non-teknis"
    },
    "experiences": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "company": { "type": "string" },
          "start": { "type": "string", "example": "2023-01" },
          "end": { "type": ["string", "null"], "example": "2024-06" },
          "highlights": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "education": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "degree": { "type": "string" },
          "institution": { "type": "string" },
          "year": { "type": "integer" }
        }
      }
    },
    "seniority": {
      "type": "string",
      "enum": ["intern", "junior", "mid", "senior", "lead"]
    },
    "field": { "type": "string", "description": "Bidang industri dominan" },
    "languages": { "type": "array", "items": { "type": "string" } },
    "score": { "type": "integer", "minimum": 0, "maximum": 100 },
    "score_breakdown": {
      "type": "object",
      "required": ["struktur", "kejelasan", "pencapaian_terukur", "relevansi_skill", "kelengkapan"],
      "properties": {
        "struktur": { "type": "integer", "minimum": 0, "maximum": 20 },
        "kejelasan": { "type": "integer", "minimum": 0, "maximum": 20 },
        "pencapaian_terukur": { "type": "integer", "minimum": 0, "maximum": 20 },
        "relevansi_skill": { "type": "integer", "minimum": 0, "maximum": 20 },
        "kelengkapan": { "type": "integer", "minimum": 0, "maximum": 20 }
      }
    },
    "strengths": { "type": "array", "items": { "type": "string" } },
    "weaknesses": { "type": "array", "items": { "type": "string" } },
    "suggestions": { "type": "array", "items": { "type": "string" } }
  }
}
```

### 5.2 Skema Keluaran Evaluasi Matching Lowongan (`matches`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "JobMatchEvaluationOutput",
  "type": "object",
  "required": ["job_id", "match_score", "reasons", "missing_skills", "verdict"],
  "properties": {
    "job_id": { "type": "string" },
    "match_score": { "type": "integer", "minimum": 0, "maximum": 100 },
    "reasons": {
      "type": "array",
      "items": { "type": "string" },
      "description": "2-4 poin konkret mengapa profil ini cocok dengan lowongan"
    },
    "missing_skills": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Kualifikasi yang disyaratkan loker tetapi belum ada pada CV"
    },
    "verdict": {
      "type": "string",
      "enum": ["sangat_cocok", "cocok", "cukup", "kurang_cocok"]
    }
  }
}
```

