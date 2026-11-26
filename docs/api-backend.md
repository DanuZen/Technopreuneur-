# Dokumentasi Kontrak API & Panduan Tim Backend - Pasbana AI

Dokumen ini menjadi acuan kontrak REST API antara *frontend* Next.js ([api.ts](../frontend/src/lib/api.ts)) dan layanan *backend*.

---

## 1. Konfigurasi Dasar & Autentikasi

- **Base URL**: `http://localhost:5000/api` (dikonfigurasi via `NEXT_PUBLIC_API_URL`).
- **Format Data**: `application/json` (kecuali unggah berkas CV menggunakan `multipart/form-data`).
- **Autentikasi**: JWT Bearer Token pada header:
  ```http
  Authorization: Bearer <token>
  ```
- **Role & RBAC**:
  - `user` (Jobseeker)
  - `company` (Employer / Mitra Perusahaan — wajib status terverifikasi Admin untuk publikasi lowongan)
  - `admin` (Administrator Platform)
- **Format Error Standar**:
  ```json
  {
    "message": "Penjelasan singkat error dalam bahasa Indonesia",
    "code": "VALIDATION_ERROR"
  }
  ```

---

## 2. Auth Endpoints

### 2.1 Login
- **POST** `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "wira@student.unp.ac.id",
    "password": "********"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "usr-101",
      "name": "Wira Fikri",
      "email": "wira@student.unp.ac.id",
      "role": "user"
    }
  }
  ```

### 2.2 Register (Jobseeker & Company)
- **POST** `/auth/register`
- **Request Body**:
  ```json
  {
    "name": "PT Nusantara Inovasi",
    "email": "hr@nusantara.co.id",
    "password": "********",
    "role": "company",
    "pdpConsent": true,
    "legality": {
      "nib": "1234567890123",
      "npwp": "01.234.567.8-901.000",
      "sector": "Teknologi & Cloud",
      "location": "Jakarta Selatan"
    }
  }
  ```
  > Catatan: Untuk `role: "company"`, akun baru masuk status awal `pending` hingga diaudit dan diverifikasi oleh Admin melalui `/admin/partners/:id/audit`.

---

## 3. Jobseeker Endpoints (`role: user`)

### 3.1 Unggah & Evaluasi CV (Opsi A)
- **POST** `/cvs/upload`
- **Content-Type**: `multipart/form-data` (field `cv`: file `.pdf` / `.docx` berbasis teks digital, ukuran maksimal mengikuti `maxCvSizeMb` pada `/admin/standards`).
- **Response `200 OK`**: Mengembalikan `CVAnalysisResult` (`cvId`, `fileName`, `overallScore`, `dimensions`, `strengths`, `weaknesses`, `recommendations`, `profile`).
- **Validasi Backend**: Tolak file hasil scan/gambar non-teks dengan status `422 Unprocessable Entity`.

### 3.2 Susun CV via Kuesioner Onboarding (Opsi B)
- **POST** `/cvs/from-questionnaire`
- **Request Body**: `QuestionnaireData` (`fullName`, `email`, `educationLevel`, `institution`, `major`, `graduationYear`, `targetRole`, `technicalSkills`, `softSkills`, `experienceSummary`, `portfolioLink`).
- **Response `200 OK`**: `CVAnalysisResult`.

### 3.3 Profil Jobseeker (CRUD)
- **GET** `/profile` — Mengambil detail profil terstruktur (`Identitas`, `Keahlian`, `Pengalaman`, `Pendidikan`).
- **PUT** `/profile` — Memperbarui detail profil (`fullName`, `headline`, `city`, `seniorityLevel`, `summary`, `skills`, `experiences`, `education`).

### 3.4 Lowongan & Lamaran
- **GET** `/jobs/recommendations` — Daftar lowongan aktif terurut skor kecocokan AI + `missingSkills` + `matchReasons`.
- **GET** `/jobs?keyword=&location=&workType=` — Pencarian portal lowongan publik.
- **POST** `/applications` — Mengajukan lamaran (`{ "jobId": "job-1", "coverLetter": "..." }`).

---

## 4. Company Endpoints (`role: company`)

> Seluruh endpoint berikut hanya boleh mengakses data milik `company` yang sedang login. Data pelamar wajib menerapkan **Blind Screening UU PDP** (identitas sensitif disamarkan menjadi `codeName`).

### 4.1 Manajemen Lowongan Perusahaan
- **GET** `/company/jobs` — Daftar lowongan milik perusahaan beserta jumlah pelamar.
- **POST** `/company/jobs` — Membuat lowongan baru (`{ "title": "Data Analyst", "location": "Jakarta (Hybrid)", "type": "Full-time" }`). Backend menjalankan validasi standar otomatis dan membuat *embedding* vektor jika aktif.
- **PATCH** `/company/jobs/:id` — Mengaktifkan atau menjeda lowongan (`{ "active": false }`).

### 4.2 Seleksi Kandidat (Blind Screening)
- **GET** `/company/applicants?status=all|submitted|reviewed|shortlisted|rejected`
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "cand-1",
      "codeName": "Kandidat #ATS-884",
      "roleApplied": "Junior Frontend Developer",
      "atsScore": 91,
      "matchReason": "Kuat di React, TypeScript, dan optimasi performa web.",
      "status": "shortlisted"
    }
  ]
  ```
- **PATCH** `/company/applicants/:id/status`
- **Request Body**: `{ "status": "reviewed" | "shortlisted" | "rejected" }`

### 4.3 Profil Perusahaan
- **GET** `/company/profile` — Mengambil profil perusahaan dan status verifikasi Admin.
- **PUT** `/company/profile` — Memperbarui `companyName`, `industry`, `website`, `city`, `keywords` (daftar kata kunci untuk pencocokan skill *jobseeker*), dan `description`.

---

## 5. Admin Endpoints (`role: admin`)

> **Aturan Cakupan Admin**: Backend wajib memastikan role `admin` hanya menerima **jumlah agregat** *jobseeker* & *company* mitra, mengaudit/memverifikasi pendaftaran *company*, menetapkan standarisasi global, dan mengambil laporan ekosistem. Tidak ada endpoint Admin untuk mengubah lowongan atau seleksi kandidat milik *company*.

### 5.1 Ringkasan Agregat & Aktivitas Pipeline AI
- **GET** `/admin/overview`
- **Response `200 OK`**:
  ```json
  {
    "totalJobseekers": 1248,
    "totalPartnerCompanies": 24,
    "pendingCompanyAudits": 2,
    "verifiedCompanyAudits": 1,
    "incompleteCompanyAudits": 0,
    "weeklyPipeline": [
      { "day": "Sen", "fullDay": "Senin", "cv": 145, "pass": 102 }
    ]
  }
  ```

### 5.2 Audit & Verifikasi Pendaftaran Company (FR-50)
- **GET** `/admin/partners` — Daftar pengajuan pendaftaran *company* untuk diaudit (`id`, `company`, `sector`, `location`, `status`, `legalityDoc`, `pdpCompliance`, `note`).
- **PATCH** `/admin/partners/:id/audit`
- **Request Body**:
  ```json
  {
    "status": "verified",
    "note": "Legalitas NIB & NPWP valid serta blind screening aktif."
  }
  ```
  Nilai `status`: `"verified"` | `"pending"` | `"incomplete"`.

### 5.3 Standarisasi Global Platform (FR-51)
- **GET** `/admin/standards` — Membaca parameter standar aktif.
- **PUT** `/admin/standards`
- **Request Body**:
  ```json
  {
    "minAtsScore": 75,
    "maxCvSizeMb": 5,
    "slaSeconds": 60,
    "allowedFormat": "pdf_docx",
    "blindScreeningRequired": true,
    "requireFullLegality": true,
    "retentionDays": "90"
  }
  ```

### 5.4 Laporan Eksekutif Ekosistem
- **GET** `/admin/reports?period=bulan|kuartal|tahun`
- **Response `200 OK`**:
  ```json
  {
    "periodLabel": "November 2026",
    "totalJobseekers": 1248,
    "totalPartnerCompanies": 24,
    "totalPartnerAudits": 27,
    "pdpAnonymizationRate": 100,
    "monthlyBreakdown": [
      { "month": "November 2026", "jobseekers": 1248, "companies": 24, "auditPassRate": "100%" }
    ]
  }
  ```

---

## 6. Implementasi Client di Frontend

Seluruh method pemanggilan endpoint di atas sudah tersedia pada class `ApiClient` di [api.ts](../frontend/src/lib/api.ts), termasuk tipe payload dan *response* TypeScript sehingga tim *backend* dan *frontend* dapat langsung melakukan integrasi bertahap.

