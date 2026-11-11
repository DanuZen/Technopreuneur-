# CareerMatch AI — Implementation Tasks & Pembagian Tugas Tim

Dokumen ini memuat rincian daftar tugas (*work breakdown structure*), roadmap peluncuran 6 minggu, checklist persiapan infrastruktur, dan pembagian tugas per anggota tim:
- **Wira Fikri Ramadanu (NIM: 23343023)** — *Frontend Lead* (`frontend/`)
- **Muhammad Gilang Ramadhan (NIM: 23346013)** — *Backend Lead* (`backend-api/`)
- **Florensius Panca Gati (NIM: 23343006)** — *Backend AI Lead* (`backend-ai/`)

---

## 1. Fase Riset Teknis (Technical Spikes & Feasibility)

Riset awal difokuskan secara eksklusif pada **riset teknis** untuk memvalidasi kelayakan arsitektur, pustaka, dan performa infrastruktur pada sisi **Backend AI** dan **Backend API**. Frontend tidak dibebani riset non-teknis dan dapat langsung fokus pada pengembangan antarmuka.

### 1.1 Riset Teknis Backend AI (Florensius Panca Gati)
- [ ] **Benchmarking Model LLM Gratis (*Free Tier Feasibility*):**
  - Menguji latensi, kestabilan rate limit, dan kepatuhan skema JSON terstruktur (*Structured Outputs*) Google Gemini API (Free Tier: 15 RPM).
  - Melakukan *prompt engineering spike* untuk ekstraksi 5 dimensi nilai CV dan perakitan resume terstruktur dari jawaban kuesioner.
  - **[PIC: Florensius Panca Gati]**
- [ ] **Eksplorasi Model Vektor & Embedding Teks:**
  - Evaluasi akurasi model embedding 1536-dimensi untuk teks dwibahasa (Bahasa Indonesia & Inggris).
  - Pengujian kueri operator jarak kemiripan kosinus pgvector (`<=>`) pada PostgreSQL.
  - **[PIC: Florensius Panca Gati]**
- [ ] **Spike Parser Dokumen & Deteksi Scan Kosong:**
  - Uji performa pustaka `pypdf` dan `python-docx` terhadap berbagai tata letak CV (1 kolom, 2 kolom, tabel).
  - Implementasi deteksi berkas gambar/scan tanpa layer teks digital untuk mencegah pemrosesan sia-sia.
  - **[PIC: Florensius Panca Gati]**
- [ ] **Eksplorasi Integrasi Jooble Publisher API:**
  - Menguji kueri endpoint resmi Jooble untuk lowongan kerja Indonesia (Jakarta, Surabaya, Bandung, remote).
  - Merancang pemetaan (*mapping*) skema respons Jooble ke skema tabel database `jobs`.
  - **[PIC: Florensius Panca Gati]**

---

### 1.2 Riset Teknis Backend API (Muhammad Gilang Ramadhan)
- [ ] **Eksplorasi Integrasi `pgvector` pada Node.js:**
  - Uji coba driver `pg` / ORM dengan tipe data `vector(1536)` pada PostgreSQL.
  - Benchmarking performa kueri similarity menggunakan indeks HNSW vs IVFFlat pada dataset lowongan kerja.
  - **[PIC: Muhammad Gilang Ramadhan]**
- [ ] **Arsitektur Pipeline Pemrosesan Asinkron Ringan (*In-Memory Worker*):**
  - Merancang antrean tugas asinkron ringan (*in-memory job queue* / EventEmitter) di lingkungan Node.js tanpa mewajibkan Redis berbayar.
  - Menetapkan mekanisme *polling* / webhook internal antara Backend API dan Backend AI FastAPI.
  - **[PIC: Muhammad Gilang Ramadhan]**
- [ ] **Implementasi Sanitasi PII & Kepatuhan Teknis UU PDP:**
  - Pembuatan modul sanitasi regex untuk menyamarkan NIK, nomor telepon, dan email sebelum teks profil dikirim ke LLM eksternal.
  - Pengujian alur pembuatan *Pre-signed URL* penyimpanan file CV (kedaluwarsa 15 menit) dan verifikasi logika hapus permanen (*hard delete*) pada data relasional serta file storage.
  - **[PIC: Muhammad Gilang Ramadhan]**

---

---

## 2. Kebutuhan Fondasi & Persiapan Infrastruktur

### 2.1 Profil Tim & Area Tanggung Jawab Utama
| Anggota Tim | NIM | Peran Utama | Lingkup Tanggung Jawab & Direktori |
| :--- | :--- | :--- | :--- |
| **Wira Fikri Ramadanu** | 23343023 | **Frontend Lead** | Direktori `frontend/`: Next.js (TS), Tailwind CSS, UI/UX flow, upload CV, kuesioner tanpa CV, visualisasi skor & rekomendasi loker |
| **Muhammad Gilang Ramadhan** | 23346013 | **Backend Lead** | Direktori `backend-api/`: Node.js (Express/TypeScript), PostgreSQL pgvector, Auth/RBAC, CRUD loker & lamaran, S3 storage |
| **Florensius Panca Gati** | 23343006 | **Backend AI Lead** | Direktori `backend-ai/`: Python (FastAPI), ekstraksi dokumen, AI CV generator, LLM scoring, vector embedding, matching engine |

---

### 2.2 Persiapan Akun & Layanan Eksternal (PIC Ditugaskan)
- [x] Inisialisasi Git Repository, setup `.gitignore`, dan baseline project **[PIC: Seluruh Tim]**
- [ ] Penyediaan database PostgreSQL dengan ekstensi `pgvector` aktif (Supabase / Neon / Railway) **[PIC: Muhammad Gilang Ramadhan]**
- [ ] Penyediaan bucket privat Object Storage (Supabase Storage / Cloudflare R2 / AWS S3) **[PIC: Muhammad Gilang Ramadhan]**
- [ ] Konfigurasi akun Sentry (error tracking) dan Resend/Brevo (email transaksional) **[PIC: Muhammad Gilang Ramadhan]**
- [ ] Registrasi API Key penyedia model AI (OpenAI / Gemini / Anthropic) dan embedding **[PIC: Florensius Panca Gati]**
- [ ] Pendaftaran API Key Jooble Publisher API untuk agregasi lowongan kerja **[PIC: Florensius Panca Gati]**
- [ ] Setup board manajemen tugas (GitHub Projects / Trello / Linear) **[PIC: Wira Fikri Ramadanu]**

---

### 2.3 Dokumen Legal, Privasi & Kepatuhan UU PDP
- [ ] Draf teks Kebijakan Privasi (*Privacy Policy*) & Syarat Ketentuan (*ToS*) berstandar UU PDP **[PIC: Muhammad Gilang Ramadhan & Wira Fikri Ramadanu]**
- [ ] Draf formulir persetujuan eksplisit (*Consent Form*) saat pertama kali pengguna mengunggah CV **[PIC: Wira Fikri Ramadanu]**
- [ ] Aturan moderasi konten lowongan kerja untuk mencegah loker palsu/penipuan **[PIC: Muhammad Gilang Ramadhan]**
- [ ] Surat permohonan kemitraan data resmi ke Pasker ID / Kemnaker RI **[PIC: Seluruh Tim]**

---

### 2.4 Penyusunan Data Uji (*Test Datasets*)
- [ ] Pengumpulan 30–50 contoh berkas CV anonim/sintetis (.pdf dan .docx, ID & EN) **[PIC: Florensius Panca Gati]**
- [ ] Pengumpulan 100+ sampel data lowongan kerja (internal & hasil Jooble) **[PIC: Florensius Panca Gati]**
- [ ] **Golden Dataset:** 20 CV yang dinilai manual oleh manusia untuk benchmarking akurasi matching AI **[PIC: Seluruh Tim]**

---

### 2.5 Strategi Anggaran & Biaya Operasional (100% Gratis / Zero Budget)
Seluruh infrastruktur dan layanan eksternal MVP dirancang memanfaatkan paket gratis (*Free Tier / Free Community Credits*), sehingga total anggaran operasional adalah **Rp 0 (Sepenuhnya Gratis)**:

| Komponen Layanan | Penyedia Layanan & Skema Gratis | Biaya (IDR) | Penanggung Jawab Monitoring |
| :--- | :--- | :--- | :--- |
| **Web Frontend Hosting** | Vercel Hobby Plan (Gratis untuk Next.js) | **Rp 0** | Wira Fikri Ramadanu |
| **Database & pgvector** | Supabase Free Tier / Neon Postgres Free Tier (Termasuk 500 MB & pgvector) | **Rp 0** | Muhammad Gilang Ramadhan |
| **File Storage CV** | Supabase Storage Free Tier (Kapasitas 1 GB gratis) / Cloudflare R2 Free (10 GB) | **Rp 0** | Muhammad Gilang Ramadhan |
| **Backend API Hosting** | Render / Railway / Koyeb Free Tier | **Rp 0** | Muhammad Gilang Ramadhan |
| **Backend AI Hosting** | Render / Hugging Face Spaces / Lokal Development Free | **Rp 0** | Florensius Panca Gati |
| **Model AI & Embedding** | Google Gemini API (Free Tier: 15 RPM gratis) & Hugging Face Inference API | **Rp 0** | Florensius Panca Gati |
| **Job Aggregator API** | Jooble Publisher API (Akses Publisher Gratis dengan API Key) | **Rp 0** | Florensius Panca Gati |
| **Email Transaksional** | Resend Free Plan (Gratis hingga 3.000 email/bulan) | **Rp 0** | Muhammad Gilang Ramadhan |
| **Monitoring & Error Logging**| Sentry Developer Plan (Gratis hingga 5.000 event error/bulan) | **Rp 0** | Muhammad Gilang Ramadhan |
| **Domain & DNS** | Subdomain gratis Vercel (`*.vercel.app`) / GitHub Pages | **Rp 0** | Wira Fikri Ramadanu |
| **TOTAL BIAYA MVP** | **Zero Budget Strategy (100% Free Tier)** | **Rp 0** | **Seluruh Tim** |

---

## 3. Roadmap MVP & Pembagian Milestones (6 Minggu)

> 🎨 **Diagram Desain Interaktif:** [Buka Versi HTML Interaktif](diagrams/roadmap-mvp.html) · [Buka Berkas Vektor SVG](diagrams/roadmap-mvp.svg)

![Roadmap MVP 6 Minggu](diagrams/roadmap-mvp.svg)

<details>
<summary>Lihat Notasi Kode Gantt (Mermaid Timeline)</summary>

```mermaid
gantt
    title Roadmap Pengembangan MVP CareerMatch AI (6 Minggu)
    dateFormat  YYYY-MM-DD
    section Minggu 1: Setup & Riset Teknis
    Riset Teknis pgvector & DB Setup (Gilang)   :w1_1, 2026-11-10, 4d
    Riset Teknis LLM & Parser CV (Panca)        :w1_2, 2026-11-10, 4d
    Setup UI Theme & Base Scaffold (Wira)       :w1_3, 2026-11-10, 4d
    section Minggu 2: Core CV Engine
    Ekstraksi Teks PDF/DOCX (Panca)             :w2_1, after w1_2, 5d
    Prompt Profiling & Scoring LLM (Panca)      :w2_2, after w2_1, 5d
    Auth JWT, RBAC & Consent API (Gilang)       :w2_3, after w1_1, 5d
    UI Upload Dropzone & Kuesioner (Wira)       :w2_4, after w1_3, 5d
    section Minggu 3: Job & Vektor
    CRUD Lowongan & Search Filter (Gilang)      :w3_1, after w2_3, 4d
    Otomasi Embedding & Jooble Client (Panca)   :w3_2, after w2_2, 5d
    UI Scorecard CV & 5 Dimensi (Wira)          :w3_3, after w2_4, 4d
    section Minggu 4: Matching System
    Matching 2-Tahap Vector + LLM (Panca)       :w4_1, after w3_2, 5d
    UI Koreksi Profil & Feed Rekomendasi (Wira) :w4_2, after w3_3, 5d
    Application & Saved Jobs API (Gilang)       :w4_3, after w3_1, 4d
    section Minggu 5: Employer & Admin
    Dashboard Employer & Review Pelamar (Wira)  :w5_1, after w4_2, 5d
    API Status Pelamar & Moderasi Loker (Gilang):w5_2, after w4_3, 4d
    Sanitasi PII & Proteksi UU PDP (Gilang/Panca):w5_3, after w4_1, 4d
    section Minggu 6: Uji Coba & Launch
    Benchmarking Golden Dataset (Seluruh Tim)   :w6_1, after w5_1, 4d
    Peluncuran Beta Tertutup / Closed Pilot     :milestone, after w6_1, 0d
```

</details>

---

## 4. Checklist Tugas Rinci per Anggota Tim

### 4.1 Wira Fikri Ramadanu (NIM: 23343023) — *Frontend Lead*
> **Direktori Kerja:** `frontend/`  
> **Teknologi:** Next.js (App Router, TypeScript), Tailwind CSS, Lucide Icons, TanStack Query

#### A. Setup & Desain Sistem UI
- [x] Inisialisasi Next.js 14, Tailwind CSS, Lucide React, dan TypeScript config
- [x] Konfigurasi token warna tema (`primary`, `match-high`, `match-medium`, `match-low`) sesuai `docs/styleguide.md`
- [ ] Setup HTTP Client (Axios / Fetch wrapper) dengan penanganan token JWT dan error boundary
- [ ] Implementasi responsivitas mobile-first (touch area minimal $44 \times 44\text{ px}$, drawer/bottom sheet)

#### B. Modul Autentikasi & Akun Pengguna
- [ ] Halaman Pendaftaran (*Register*) dengan opsi seleksi role: `jobseeker` vs `employer`
- [ ] Halaman Masuk (*Login*) dengan email/password dan tombol Google OAuth SSO
- [ ] Modal dialog Persetujuan Consent Pemrosesan Data Pribadi (UU PDP) sebelum unggah CV
- [ ] Halaman Pengaturan Akun: tombol hapus CV dan tombol hapus akun permanen (*Right to be Forgotten*)

#### C. Modul Pencari Kerja (Job Seeker)
- [ ] Komponen Pemilih 2 Pilihan Masuk Awal: "Saya Sudah Punya CV" (Upload) vs "Saya Belum Punya CV" (Kuesioner Terpandu)
- [ ] Komponen Wizard Kuesioner Pertanyaan Terpandu AI (*Multi-step Form Wizard*: Pendidikan, Skill, Pengalaman Organisasi/Magang/Proyek, Minat Karir)
- [ ] Komponen Drag-and-Drop Dropzone berkas CV dengan validasi tipe (.pdf / .docx) dan batas ukuran (5 MB)
- [ ] Indikator progress bar pengunggahan dan visualisasi tahapan status pemrosesan AI secara real-time
- [ ] Alert peringatan dokumen terbaca kosong jika pengguna mengunggah hasil scan foto/gambar
- [ ] Komponen Radial Scorecard untuk skor kualitas CV (0–100) dengan pewarnaan dinamis
- [ ] Komponen visualisasi 5 dimensi evaluasi (Struktur, Kejelasan, Pencapaian Terukur, Relevansi Skill, Kelengkapan)
- [ ] Kartu daftar kekuatan resume, kelemahan resume, dan saran perbaikan konkret
- [ ] Formulir koreksi manual data profil hasil ekstraksi/generasi AI (pengguna dapat mengedit sebelum dikunci)
- [ ] Halaman daftar lowongan kerja rekomendasi yang diurutkan berdasarkan persentase kecocokan
- [ ] Komponen kartu lowongan lengkap dengan badge sumber (*Internal* vs *Jooble ↗*), alasan kecocokan, dan label merah *missing skills*
- [ ] Tombol aksi lamar (*Quick Apply Internal* dan redirect ke portal sumber eksternal)
- [ ] Fitur simpan/bookmark lowongan untuk dibaca nanti (*Saved Jobs*)

#### D. Modul Pemberi Kerja (Employer)
- [ ] Formulir profil perusahaan (nama, logo, deskripsi, website)
- [ ] Formulir pembuatan dan pengeditan lowongan pekerjaan (judul, kriteria skill, rentang gaji, lokasi, work type)
- [ ] Dashboard manajemen daftar lowongan aktif dan status publikasi
- [ ] Halaman daftar pelamar masuk yang diurutkan otomatis berdasarkan skor kecocokan tertinggi
- [ ] Kartu ringkasan AI untuk profil pelamar tanpa menampilkan atribut sensitif (gender/foto/usia)
- [ ] Kontrol pembaruan status pelamar (*Reviewed*, *Shortlisted*, *Rejected*)

#### E. Modul Moderasi Admin
- [ ] Halaman kurasi lowongan baru (tombol Setujui, Tolak, Nonaktifkan lowongan)

---

### 4.2 Muhammad Gilang Ramadhan (NIM: 23346013) — *Backend Lead*
> **Direktori Kerja:** `backend-api/`  
> **Teknologi:** Node.js, Express (TypeScript), PostgreSQL, pgvector, JWT, Helmet, bcryptjs

#### A. Riset Teknis Backend API (pgvector & Pipeline Asinkron)
- [ ] Eksplorasi konektivitas driver `pg` Node.js dengan ekstensi `pgvector` dan perbandingan performa indeks HNSW vs IVFFlat
- [ ] Riset arsitektur antrean asinkron ringan (*in-memory job queue* / EventEmitter) di Node.js untuk pemrosesan CV & matching
- [ ] Uji coba sanitasi regex data pribadi (PII masking: NIK, nomor telepon, email) sebelum teks dikirim ke LLM eksternal
- [ ] Uji coba mekanisme presigned URL upload file privat (kedaluwarsa 15 menit) dan audit trail penghapusan data sesuai UU PDP

#### B. Database & Infrastruktur Penyimpanan
- [ ] Setup koneksi database PostgreSQL dan eksekusi ekstensi `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Pembuatan skrip migrasi untuk 10 tabel inti sesuai `docs/workflow.md`:
  - `users`, `consents`, `cvs`, `cv_profiles`, `companies`, `jobs`, `matches`, `applications`, `saved_jobs`, `ai_usage_logs`
- [ ] Konfigurasi indeks relasional (B-Tree) pada `jobs(status, expires_at)` dan indeks vektor HNSW pada kolom `embedding`
- [ ] Setup koneksi Object Storage (S3 / Cloudflare R2 / Supabase Storage) dengan bucket privat
- [ ] Service generator Pre-signed URL aman (kedaluwarsa 15 menit) untuk upload dan akses file CV

#### C. Keamanan, Autentikasi & Kepatuhan PDP
- [ ] Implementasi hashing kata sandi aman menggunakan `bcryptjs` / `argon2`
- [ ] Endpoint pendaftaran pengguna (`POST /api/auth/register`) dengan validasi role (`jobseeker`, `employer`)
- [ ] Endpoint masuk pengguna (`POST /api/auth/login`) yang menghasilkan token JWT terproteksi
- [ ] Middleware otentikasi JWT dan otorisasi role (*Role-Based Access Control / RBAC*)
- [ ] Middleware proteksi keamanan (*Helmet*, *CORS*, dan *Rate Limiting* pada rute upload & login)
- [ ] Endpoint pencatatan persetujuan persetujuan data pribadi pengguna (`POST /api/consents`)
- [ ] Endpoint penerimaan data kuesioner profil bagi pengguna tanpa CV (`POST /api/cvs/from-questionnaire`)
- [ ] Endpoint penghapusan berkas CV permanen (`DELETE /api/cvs/:id`) yang menghapus data DB dan biner file storage
- [ ] Endpoint penghapusan akun pengguna menyeluruh (`DELETE /api/users/me`)

#### D. API Manajemen Lowongan Kerja (Jobs API)
- [ ] Endpoint pembuatan lowongan kerja oleh employer (`POST /api/jobs`)
- [ ] Endpoint pembacaan daftar lowongan dengan filter kata kunci, lokasi, dan tipe kerja (`GET /api/jobs`)
- [ ] Endpoint detail lowongan (`GET /api/jobs/:id`)
- [ ] Endpoint pembaruan dan penutupan lowongan (`PUT /api/jobs/:id`, `PATCH /api/jobs/:id/close`)
- [ ] Logika deduplikasi lowongan eksternal (mencegah duplikasi judul + perusahaan + lokasi)
- [ ] Scheduled job auto-hide untuk lowongan yang telah kedaluwarsa (`expires_at`)

#### E. API Pengajuan Lamaran & Employer Review
- [ ] Endpoint pengajuan lamaran kerja internal (`POST /api/applications`)
- [ ] Endpoint peninjauan daftar pelamar per lowongan terurut skor kecocokan (`GET /api/applications/job/:jobId`)
- [ ] Endpoint pengubahan status pelamar oleh employer (`PATCH /api/applications/:id/status`)
- [ ] Endpoint daftar lamaran yang diajukan oleh job seeker (`GET /api/applications/me`)
- [ ] Endpoint simpan dan hapus bookmark lowongan (`POST/DELETE /api/saved-jobs/:jobId`)

#### F. API Moderasi Admin
- [ ] Endpoint daftar review lowongan masuk (`GET /api/admin/jobs/pending`)
- [ ] Endpoint persetujuan/penolakan lowongan (`PATCH /api/admin/jobs/:id/moderate`)
- [ ] Endpoint nonaktifkan akun pengguna bermasalah (`PATCH /api/admin/users/:id/suspend`)

---

### 4.3 Florensius Panca Gati (NIM: 23343006) — *Backend AI Lead*
> **Direktori Kerja:** `backend-ai/`  
> **Teknologi:** Python 3.11+, FastAPI, Pydantic v2, PyPDF, python-docx, pgvector, LiteLLM / Gemini SDK / OpenAI SDK

#### A. Riset Teknis Backend AI (LLM, Parser & Embedding)
- [ ] Pengujian model Google Gemini API (Free Tier: 15 RPM) untuk latency, rate limit, dan kestabilan structured JSON
- [ ] Eksperimen ekstraksi teks CV berbagai layout (.pdf / .docx) dan logika deteksi scan foto kosong
- [ ] Perancangan dan pengujian prompt AI CV Generator dari data input kuesioner pertanyaan terpandu
- [ ] Evaluasi model embedding 1536-dimensi dwibahasa dan pengujian operator jarak cosinus `pgvector`
- [ ] Uji coba format kueri dan respons Jooble Publisher API untuk lowongan kerja wilayah Indonesia

#### B. Layanan Ekstraksi Teks Dokumen
- [x] Inisialisasi FastAPI, struktur Pydantic schemas, dan modul ekstraksi awal
- [ ] Modul pembaca berkas PDF menggunakan `pypdf` / `pdfplumber`
- [ ] Modul pembaca berkas DOCX menggunakan `python-docx`
- [ ] Logika deteksi dokumen kosong (mendeteksi jika CV berupa scan foto tanpa layer teks digital)
- [ ] Endpoint ekstraksi dokumen (`POST /api/v1/extract-cv`) dengan balikan JSON teks bersih

#### C. Sanitasi PII & Desain Prompt AI Bebas Bias
- [ ] Fungsi pembersih data sensitif (PII Sanitizer): menyamarkan kontak pribadi, NIK, dan alamat detail sebelum teks dikirim ke LLM
- [ ] Implementasi *AI Blind Scoring*: Menjamin atribut jenis kelamin, agama, suku, status perkawinan, dan usia tidak disertakan dalam prompt evaluasi
- [ ] Desain System Prompt dan validasi skema JSON terstruktur (*Structured Outputs*) untuk model data profil CV (`CVAnalysisOutput`)
- [ ] Prompt AI CV Generator: Merangkai profil, narasi pengalaman, dan keahlian terstruktur dari jawaban kuesioner pengguna menjadi resume digital terstandar
- [ ] Prompt penilaian kualitas CV: menghasilkan skor 0–100 dan pembagian 5 dimensi nilai (struktur, kejelasan, pencapaian terukur, relevansi skill, kelengkapan)
- [ ] Prompt ekstraksi daftar kelebihan resume, kelemahan, dan rekomendasi langkah perbaikan konkret

#### D. Layanan Vektor & Text Embedding
- [ ] Klien model embedding teks 1536-dimensi (`text-embedding-3-small` atau setara)
- [ ] Endpoint pembuatan vektor embedding untuk teks ringkasan kompetensi profil CV (`POST /api/v1/embeddings/profile`)
- [ ] Endpoint pembuatan vektor embedding untuk teks kualifikasi lowongan baru (`POST /api/v1/embeddings/job`)
- [ ] Fungsi eksekusi kueri jarak kemiripan kosinus pgvector (`<=>`) untuk mengambil Top 20–50 lowongan kandidat

#### E. Mesin Pencocokan Dua Tahap (Two-Stage Matching Engine)
- [ ] **Tahap 1 (Vektor Filter):** Mengambil lowongan teratas dari database berdasarkan kedekatan semantik profil kandidat
- [ ] **Tahap 2 (LLM Re-Ranking & Evaluator):**
  - Menganalisis kecocokan profil kandidat terhadap syarat lowongan terpilih
  - Menghitung persentase skor kecocokan (0–100) dan menentukan status *verdict* (`sangat_cocok`, `cocok`, `cukup`, `kurang_cocok`)
  - Menghasilkan daftar poin alasan konkret mengapa kandidat cocok
  - Mendeteksi *missing skills* (keahlian yang disyaratkan loker namun belum dimiliki kandidat)
- [ ] Endpoint eksekusi matching rekomendasi (`POST /api/v1/matching/evaluate`)
- [ ] Mekanisme caching hasil evaluasi matching dan pencatatan kuota pemakaian token gratis (`ai_usage_logs`)

#### F. Adaptor Penarikan Lowongan Eksternal
- [ ] Implementasi antarmuka klien API resmi Jooble (Jooble Publisher API)
- [ ] Modul normalisasi data respons Jooble ke format skema standar lowongan platform
- [ ] Script sinkronisasi periodik (cron job) penarikan lowongan Indonesia dan pembuatan vektor otomatis

---

## 4. Keputusan Kunci & Tindakan Minggu Ini

### 4.1 Keputusan Prioritas Tim
1. **Segmen Pasar Awal:** Memutuskan apakah peluncuran awal berfokus pada satu niche (misal: IT & Software Engineer untuk fresh graduate) atau terbuka untuk seluruh bidang.
2. **Aturan Verifikasi Employer:** Menentukan apakah akun employer wajib diverifikasi dokumen resmi (NIB/surat izin) sebelum diperbolehkan memasang lowongan.
3. **Masa Retensi CV:** Menentukan batas waktu penyimpanan berkas CV pengguna tidak aktif (usulan: 12 bulan sebelum auto-purge dengan email peringatan).

### 4.2 Tindakan Langsung Minggu Ini (Checklist per Anggota)
- [ ] **Wira Fikri Ramadanu:** Mulai menggarap komponen formulir registrasi/login dan komponen Dropzone unggah CV di `frontend/src/app/`.
- [ ] **Muhammad Gilang Ramadhan:** Melakukan setup koneksi database PostgreSQL lokal/cloud dengan ekstensi `pgvector` dan skrip migrasi 10 tabel.
- [ ] **Florensius Panca Gati:** Menyiapkan API key model LLM dan menguji coba endpoint ekstraksi teks PDF/DOCX dengan 5 sampel CV uji coba.
