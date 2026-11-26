# Catatan Review & Implementasi Peningkatan Layanan `backend-ai`

Dokumen ini merangkum 9 temuan teknis pada layanan **`backend-ai/`** beserta status implementasi peningkatannya agar selaras penuh dengan arsitektur **Pasbana (CareerMatch AI)**, **`backend-api/`** (`:5000`), dan **`frontend/`** (`:3000`).

> **Status Terkini**: Seluruh **9 catatan peningkatan** telah diimplementasikan langsung di `backend-ai/`, dihubungkan ke `backend-api/` serta antarmuka `frontend/`, dan terverifikasi lulus seluruh pengujian unit `pytest` serta pemeriksaan tipe TypeScript (`tsc`).

---

## Ringkasan Status Implementasi 9 Catatan

| No | Fokus Peningkatan | Berkas Utama `backend-ai` | Status |
| :--- | :--- | :--- | :--- |
| 1 | Ekstraksi `profile` JSON terstruktur pada respons analisis | `app/profile/extractor.py`, `app/contract/schemas.py`, `app/api/analyze_routes.py` | Selesai |
| 2 | Skor kesiapan kata kunci umum (`general_skill_score`) & perbaikan regex skill simbol (`C#`) | `app/ats/schema.py`, `app/ats/scorer.py` | Selesai |
| 3 | Deteksi gaya *List Bullet* bawaan Microsoft Word pada `.docx` | `app/ingestion/docx_extractor.py`, `app/ats/scorer.py` | Selesai |
| 4 | Penyediaan array `strengths[]` deterministik dari dimensi ATS unggul | `app/ats/schema.py`, `app/ats/scorer.py`, `app/contract/schemas.py` | Selesai |
| 5 | Endpoint HTTP `POST /internal/v1/embed` & `POST /internal/v1/cv/analyze-text` | `app/api/embed_routes.py`, `app/api/analyze_routes.py`, `app/main.py` | Selesai |
| 6 | Kenaikan `MAX_CANDIDATES = 50`, kamus 68 skill, & pencocokan `keywords` kustom perusahaan | `app/api/match_routes.py`, `app/matching/scorer.py`, `app/resources/skills.yaml` | Selesai |
| 7 | Endpoint konsultasi chatbot interaktif `POST /internal/v1/cv/chat` | `app/api/chat_routes.py`, `app/main.py` | Selesai |
| 8 | Sinkronisasi `.env.example`, fallback model Gemini `404`, & normalizer Jooble | `.env.example`, `app/llm/gemini_provider.py`, `app/jobs/normalizer.py` | Selesai |
| 9 | Pembersihan duplikasi import/fungsi, non-blocking threadpool, & pengisian file resource YAML | `app/api/ats_routes.py`, `app/advice/service.py`, `app/resources/*.yaml` | Selesai |

---

## Rincian Teknis Implementasi per Catatan

### 1. Ekstraksi `profile` JSON Terstruktur di `/internal/v1/cv/analyze` & `/analyze-text`
- **Masalah Awal**: `AnalyzeResponse` hanya mengembalikan `sanitized_text` mentah tanpa struktur `fullName`, `headline`, `contactEmail`, `summary`, `skills` (`technical`, `soft`, `tools`), `experiences`, dan `education`.
- **Implementasi**:
  - Dibuat modul `app/profile/extractor.py` (`extract_structured_profile`) yang mengelompokkan keahlian ke kategori `technical`, `tools`, dan `soft` menggunakan kamus kanonik `skills.yaml` + `skill_labels.yaml`, serta memisahkan bagian pendidikan, ringkasan, dan pengalaman kerja.
  - Ditambahkan field `profile: dict | None = None` pada `AnalyzeResponse` (`app/contract/schemas.py`) dan dikonsumsi langsung oleh `backend-api/src/services/aiService.ts`.

### 2. Skor Kesiapan Skill Umum (`general_skill_score`) & Regex Kata Kunci Simbol (`C#`, `C++`)
- **Masalah Awal**: Ketika pengguna melakukan evaluasi CV umum tanpa `jd_keywords`, skor dimensi `keywords` bernilai `null`. Selain itu pola `\b...\b` gagal mencocokkan kata kunci berakhiran simbol seperti `C#`.
- **Implementasi**:
  - Di `app/ats/scorer.py`, pola pencocokan kata kunci diperbaiki menjadi `(?<![a-z0-9+#]){re.escape(k)}(?![a-z0-9+#])` sehingga `C#` dan `C++` terbaca akurat.
  - Ditambahkan perhitungan `general_skill_score` pada `ATSCheckResult` berdasarkan keragaman skill kanonik yang terdeteksi di CV tanpa merusak kontrak `keywords.score = None` saat tanpa JD.

### 3. Deteksi Bullet Microsoft Word pada Ekstraksi `.docx`
- **Masalah Awal**: Paragraf berformat *List Bullet* bawaan Word kehilangan karakter bullet saat dibaca `python-docx`, menyebabkan skor `content` (`measurableImpact`) jatuh ke `40` (`NO_BULLET_POINTS`).
- **Implementasi**:
  - `app/ingestion/docx_extractor.py` kini mendeteksi seluruh nama style mengandung `"list"` maupun elemen XML `numPr` dan menyematkan prefix `"- "` secara otomatis.
  - `BULLET_RE` di `app/ats/scorer.py` diperluas untuk mengenali variasi karakter bullet Unicode dan penomoran daftar.

### 4. Generator `strengths[]` Deterministik
- **Masalah Awal**: Respons `backend-ai` hanya memuat daftar `issues` (kelemahan) dan `suggestions` (saran), belum memuat daftar kekuatan utama CV.
- **Implementasi**: `_build_strengths()` di `app/ats/scorer.py` menyusun daftar kekuatan objektif berdasarkan struktur 1-kolom bebas tabel, kelengkapan informasi kontak, kelengkapan seksi utama, pencapaian kuantitatif, dan kekayaan kata kunci kompetensi.

### 5. Endpoint `POST /internal/v1/embed` & `POST /internal/v1/cv/analyze-text`
- **Implementasi**:
  - `POST /internal/v1/embed` (`app/api/embed_routes.py`): Menyediakan vektor `gemini-embedding-001` berdimensi `1536` (dengan sanitasi UU PDP otomatis) bagi `backend-api` ketika perusahaan membuat lowongan baru sehingga *Two-Stage Matching* memadukan kemiripan vektor (Stage 1) dan verifikasi kata kunci kutipan (Stage 2).
  - `POST /internal/v1/cv/analyze-text` (`app/api/analyze_routes.py`): Memungkinkan analisis langsung dari teks kuesioner *Onboarding CV* tanpa harus mem-parsing ulang berkas fisik.

### 6. Kapasitas `MAX_CANDIDATES = 50`, Kamus 68 Skill, & Kata Kunci Kustom Perusahaan
- **Implementasi**:
  - `MAX_CANDIDATES` pada `POST /internal/v1/match/stage2` dinaikkan dari `5` menjadi `50`.
  - `skills.yaml` dan `skill_labels.yaml` diperluas selaras dari 49 menjadi **68 keahlian lintas bidang** (termasuk `Vue.js`, `PHP`, `Laravel`, `Flutter`, `Kotlin`, `Swift`, `GraphQL`, `Prisma`, `Supabase`, `Firebase`, `Figma`, `UI/UX Design`, `Canva`, `Scrum`, `Digital Marketing`, `SEO`, `Copywriting`).
  - `match_cv_to_job(..., explicit_skills=cand.skills)` di `app/matching/scorer.py` kini mencocokkan dan memverifikasi bukti kutipan untuk *keywords* spesifik perusahaan meskipun belum terdaftar di `skills.yaml`.

### 7. Konsultasi Chatbot Evaluasi CV (`POST /internal/v1/cv/chat`)
- **Implementasi**:
  - Dibuat `app/api/chat_routes.py` dengan sanitasi teks UU PDP, pembatasan topik khusus konsultasi CV/karir berbahasa Indonesia, validasi skema JSON, serta *fallback* deterministik instan apabila kuota LLM habis.
  - Dihubungkan ke `POST /api/cvs/chat` di `backend-api` dan komponen `CvEvaluationChat` (`frontend/src/components/evaluate/cv-evaluation-chat.tsx`).

### 8. Sinkronisasi `.env.example`, Fallback Model Gemini, & Normalizer Jooble
- **Implementasi**:
  - `backend-ai/.env.example` diperbarui sesuai variabel aktual (`GEMINI_API_KEY`, `GEMINI_MODEL`, `INTERNAL_TOKEN`, `LLM_ALLOW_MOCK`).
  - `GeminiProvider` di `app/llm/gemini_provider.py` memiliki mekanisme fallback otomatis ke `gemini-2.5-flash` / `gemini-2.0-flash` apabila nama model pada environment mengembalikan HTTP `404`.
  - `app/jobs/normalizer.py` kini mendukung payload agregator **Jooble** (`normalize_jooble`) di samping kompatibilitas **Arbeitnow**.

### 9. Pembersihan Kode, Non-Blocking Threadpool, & Pengisian Resource YAML
- **Implementasi**:
  - Duplikasi import dan definisi fungsi di `ats_routes.py`, `matching/scorer.py`, dan `advice/service.py` telah dibersihkan.
  - Eksekusi ekstraksi dokumen, LLM, dan embedding di dalam route `async` kini dijalankan melalui `run_in_threadpool` agar tidak memblokir *event loop* Uvicorn.
  - `heading_aliases.yaml` dan `keyword_synonyms.yaml` telah diisi lengkap dan dimuat oleh modul skorer.
