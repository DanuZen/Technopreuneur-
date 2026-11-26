# Catatan Review & Evaluasi Teknis Rinci Layanan `backend-ai`

Dokumen ini merangkum hasil audit kode baris-demi-baris terhadap layanan **`backend-ai/`** (tanpa mengubah satu pun berkas di dalam `backend-ai/`). Seluruh jembatan penyesuaian sementara sudah ditangani di sisi **`backend-api/`** ([aiService.ts](../backend-api/src/services/aiService.ts)), dan rincian di bawah ditujukan sebagai panduan teknis langsung untuk tim `backend-ai`.

---

## 1. Ringkasan Bagian yang Sudah Sesuai Rencana

- **Ekstraksi Dokumen (`app/ingestion/`)**: Ekstraksi `.pdf` (`pdfplumber`) dan `.docx` (`python-docx`) berjalan stabil lengkap dengan deteksi berkas scan gambar (`is_scanned`), multi-kolom (`has_multi_column`), tabel (`has_table`), batas 10 halaman, dan ukuran maksimal 5 MB.
- **Sanitasi UU PDP (`app/sanitization/sanitizer.py`)**: Baris berlabel atribut sensitif (`DATE_OF_BIRTH`, `GENDER`, `RELIGION`, `MARITAL_STATUS`) dihapus sebelum menyentuh prompt LLM dan tidak pernah bocor ke log.
- **Anti-Halusinasi Kutipan (`app/advice/service.py` & `app/matching/scorer.py`)**: Saran LLM dan alasan kecocokan diverifikasi terhadap teks CV asli (`_filter_unsupported` & `evidence_in_text`), serta kegagalan kuota LLM tidak membatalkan hasil ATS (`advice_status`).
- **Keamanan Internal & Unit Test**: Proteksi `X-Internal-Token` aktif pada seluruh route `/internal/v1/*` dan **142 unit test `pytest`** lulus 100%.

---

## 2. Penjelasan Rinci 9 Catatan untuk Tim `backend-ai`

### Catatan 1: Ekstraksi `profile` JSON Terstruktur Belum Ada di `/internal/v1/cv/analyze`
- **Lokasi Kode**: `backend-ai/app/api/analyze_routes.py` (baris 72-79) & `backend-ai/app/contract/schemas.py` (baris 25-31).
- **Akar Masalah**: `AnalyzeResponse` saat ini hanya mengembalikan `ats`, `advice`, `cv_embedding`, dan `sanitized_text` (string mentah). Belum ada objek `profile` terstruktur (`fullName`, `headline`, `summary`, `education[]`, `skills: { technical, soft, tools }`, `experiences[]`) sebagaimana dirancang pada PRD (`FR-12`) dan dibutuhkan oleh halaman *Hasil Evaluasi*, *Dokumen CV ATS*, *Modal Detail Profil*, serta panel *Seleksi Kandidat Company*.
- **Dampak**: Tanpa ekstraksi terstruktur dari AI, data riwayat pendidikan, organisasi, dan jabatan tidak terpisah rapi per item.
- **Workaround Saat Ini di `backend-api`**: `extractProfileFromText()` pada `aiService.ts` melakukan ekstraksi heuristik berbasis regex dari `sanitized_text`.
- **Solusi yang Disarankan untuk `backend-ai`**: Perluas prompt JSON Gemini pada `app/advice/prompts.py` (atau tambahkan extractor terstruktur) agar sekalian mengembalikan objek `profile` tervalidasi Pydantic dalam 1 panggilan LLM yang sama (hemat kuota RPM).

---

### Catatan 2: Perbedaan Nama 5 Dimensi ATS & Skor `keywords = null` Saat Tanpa JD
- **Lokasi Kode**: `backend-ai/app/ats/schema.py` (baris 11-16) & `backend-ai/app/ats/scorer.py` (baris 102-108).
- **Akar Masalah**:
  1. Nama dimensi di `backend-ai` adalah `readability`, `sections`, `keywords`, `content`, `contact_length`, sedangkan kontrak UI `frontend` memakai `structure`, `clarity`, `measurableImpact`, `skillRelevance`, `completeness`.
  2. Pada `_keyword_dimension()` (`scorer.py` baris 103): ketika pengguna mengunggah CV di menu Evaluasi Umum (tanpa melampirkan `jd_keywords` lowongan tertentu), fungsi langsung mengembalikan `(None, [])`. Selain itu di baris 107 dipakai regex `\b{re.escape(k)}\b` yang **gagal mencocokkan skill berkarakter simbol** seperti `C#` atau `C++` karena `#` dan `+` bukan karakter `\w` (sehingga batas kata `\b` setelah `#` tidak pernah terpenuhi).
- **Dampak**: `skillRelevance` kosong (`null`) pada evaluasi CV umum, dan kata kunci seperti `C#` atau `Next.js` (di akhir kalimat) berisiko tidak terhitung.
- **Workaround Saat Ini di `backend-api`**: `aiService.ts` memetakan kelima nama dimensi dan memberi nilai estimasi berbasis jumlah skill terdeteksi apabila `keywords` bernilai `null`.
- **Solusi yang Disarankan untuk `backend-ai`**:
  - Saat `jd_keywords` kosong, hitung skor kesiapan kata kunci berdasarkan keterdeteksian skill dari `skills.yaml`.
  - Ganti `\b...\b` di `scorer.py` baris 107 dengan *lookaround* `(?<![a-z0-9])...(?![a-z0-9])` seperti yang sudah dipakai dengan benar di `app/matching/keywords.py`.

---

### Catatan 3: Deteksi Bullet di Dimensi `content` Terlalu Ketat pada File DOCX (`NO_BULLET_POINTS`)
- **Lokasi Kode**: `backend-ai/app/ats/scorer.py` (baris 36 & 77-86) & `backend-ai/app/ingestion/docx_extractor.py`.
- **Akar Masalah**: `BULLET_RE` hanya mencari karakter literal `•`, `-`, atau `*` di awal baris (`^\s*[•\-\*]\s+`). Pada dokumen Word (`.docx`) asli yang memakai fitur *Bulleted List* bawaan Microsoft Word (`<w:numPr>`), pustaka `python-docx` membaca `paragraph.text` **tanpa karakter bullet di depannya**. Akibatnya `bullets` dianggap kosong (`[]`) dan skor `content` (`measurableImpact`) langsung jatuh ke **`40`** meskipun kalimat pengalaman kandidat sudah memuat angka persentase/metrik!
- **Dampak**: Terbukti pada uji integrasi langsung, CV `.docx` dengan kalimat *"meningkatkan kecepatan sebesar 38%"* tetap mendapat skor `measurableImpact: 40`.
- **Solusi yang Disarankan untuk `backend-ai`**: Di `docx_extractor.py`, tambahkan prefix `"- "` ketika `paragraph.style.name` mengandung `"List"` atau elemen XML `p._p.pPr.numPr` tidak `None`.

---

### Catatan 4: Belum Ada Field `strengths[]` pada Respons Analisis
- **Lokasi Kode**: `backend-ai/app/ats/schema.py` (baris 56-65) & `backend-ai/app/advice/service.py` (baris 32-37).
- **Akar Masalah**: `backend-ai` hanya mengembalikan `ats.issues[]` (kelemahan/peringatan) dan `advice.suggestions[]` (rekomendasi), tetapi belum menyediakan array `strengths[]` (kekuatan utama CV).
- **Workaround Saat Ini di `backend-api`**: `aiService.ts` menurunkan daftar `strengths` dari `ats.flags` (mis. format 1-kolom bersih, kontak lengkap, section lengkap).
- **Solusi yang Disarankan untuk `backend-ai`**: Tambahkan generator `strengths: list[str]` deterministik di `scorer.py` untuk dimensi yang skornya `>= 80`.

---

### Catatan 5: Belum Ada Endpoint HTTP untuk Embedding Lowongan (`job_embedding`) & Input Onboarding
- **Lokasi Kode**: `backend-ai/app/embedding/gemini_embedder.py` & `backend-ai/app/main.py`.
- **Akar Masalah**:
  1. Class `GeminiEmbedder` (1536 dimensi, `gemini-embedding-001`) sudah dibuat, tetapi hanya dipanggil internal saat upload CV dan **belum memiliki route HTTP** (mis. `POST /internal/v1/embed`). Padahal agar pencarian vektor *Stage 1* (`pgvector <=>`) di PostgreSQL akurat, setiap lowongan baru dan *keywords* profil *Company* wajib di-embed memakai model `gemini-embedding-001` yang sama persis.
  2. Belum ada endpoint untuk menganalisis data JSON kuesioner *Onboarding* secara langsung tanpa berkas fisik.
- **Workaround Saat Ini di `backend-api`**: `docxBuilder.ts` merakit file `.docx` di memori dari isian kuesioner lalu mengirimnya ke `/internal/v1/cv/analyze`.
- **Solusi yang Disarankan untuk `backend-ai`**: Ekspos `POST /internal/v1/embed` (menerima `{ "texts": ["..."] }`, mengembalikan `{ "embeddings": [[...]] }`) dan opsional `POST /internal/v1/cv/analyze-text`.

---

### Catatan 6: Batas `MAX_CANDIDATES = 5` & Cakupan Kamus Statis `skills.yaml` pada `stage2`
- **Lokasi Kode**: `backend-ai/app/api/match_routes.py` (baris 14 & 28) & `backend-ai/app/resources/skills.yaml` (baris 1-49).
- **Akar Masalah**:
  1. `MAX_CANDIDATES = 5` menolak payload berisi lebih dari 5 lowongan dengan HTTP `422`, padahal rancangan *Two-Stage Matching* mengirim 20-50 kandidat dari Stage 1. Karena `match_stage2` di `backend-ai` murni komputasi regex lokal (tanpa memanggil Gemini, sangat cepat `< 10ms`), batas 5 terlalu kecil.
  2. `extract_skills()` hanya mengenali 49 skill yang tertulis di `skills.yaml`. Jika *Company* memasukkan *keywords* atau `requiredSkills` populer di luar daftar itu (misalnya `Figma`, `UI/UX`, `Flutter`, `Laravel`, `PHP`, `Vue`, `Kotlin`, `GraphQL`, `Scrum`), `job_skills` menjadi kosong atau tidak terhitung sehingga skor kecocokan menjadi `0` atau tidak akurat.
- **Workaround Saat Ini di `backend-api`**: `rankJobsWithBackendAi()` memotong daftar lowongan menjadi beberapa panggilan *batch* isi 5 lowongan.
- **Solusi yang Disarankan untuk `backend-ai`**:
  - Naikkan `MAX_CANDIDATES` menjadi `50`.
  - Di `match_routes.py` / `scorer.py`, selain mencocokkan dari `skills.yaml`, izinkan pencocokan langsung terhadap item eksplisit di `cand.skills` (termasuk *keywords* dari profil perusahaan) agar kata kunci kustom dari *Company* selalu ikut dihitung!

---

### Catatan 7: Belum Ada Endpoint Konsultasi Chatbot Interaktif
- **Lokasi Kode**: `backend-ai/app/api/`.
- **Akar Masalah**: Halaman **Hasil Evaluasi** (`/user/dashboard/hasil-evaluasi`) menyediakan antarmuka chatbot agar *jobseeker* bisa bertanya tentang hasil evaluasi CV-nya, namun saat ini percakapan masih ditangani secara lokal di frontend (`cv-evaluation-chat.tsx`) karena belum ada endpoint `POST /internal/v1/cv/chat` di `backend-ai`.
- **Solusi yang Disarankan untuk `backend-ai`**: Tambahkan route `POST /internal/v1/cv/chat` yang menerima ringkasan `ats`, kutipan CV tersanitasi, dan pertanyaan pengguna dengan batasan *system prompt* hanya menjawab konteks evaluasi CV & karir.

---

### Catatan 8: Ketidaksinkronan `.env.example`, Port, Nama Model Default, dan Sumber Eksternal
- **Lokasi Kode**: `backend-ai/.env.example`, `backend-ai/app/config.py` (baris 18-24), & `backend-ai/app/jobs/normalizer.py`.
- **Rincian**:
  1. `backend-ai/.env.example` masih memuat variabel lama (`PORT=8001`, `OPENAI_API_KEY`, `DEFAULT_LLM_MODEL=gpt-4o-mini`, `DATABASE_URL`, `JOOBLE_API_KEY`) dan **belum memuat** `INTERNAL_TOKEN`, `GEMINI_MODEL`, serta `LLM_ALLOW_MOCK` yang dibaca oleh `app/config.py`.
  2. Default `GEMINI_MODEL` di `app/config.py` baris 19 tertulis `"gemini-3.5-flash-lite"`. Perlu diverifikasi terhadap daftar model resmi Google GenAI API `v1beta` (mis. `gemini-2.5-flash` / `gemini-2.5-flash-lite`) agar panggilan saran LLM tidak gagal diam-diam menjadi `advice_status: "unavailable"`.
  3. `app/jobs/normalizer.py` dibuat untuk struktur payload **Arbeitnow**, sedangkan spesifikasi dokumen menyebut **Jooble**, serta fungsi normalizer tersebut belum dipanggil oleh endpoint mana pun.

---

### Catatan 9: Kebersihan Kode & Non-Blocking Async (`Minor Cleanup`)
- **Duplikasi Import/Fungsi**:
  - `app/advice/service.py`: fungsi `_norm` di-import di baris 10 lalu didefinisikan ulang di baris 29.
  - `app/api/ats_routes.py`: `APIRouter, File, Form, HTTPException, UploadFile` di-import dua kali (baris 5 dan 19).
  - `app/matching/scorer.py`: `_compiled_patterns, extract_skills` di-import dua kali (baris 5 dan 7).
- **Blocking Sleep di Route `async`**:
  - Di `app/llm/gemini_provider.py` baris 51 terdapat `time.sleep(10 * (attempt + 1))` sinkron yang dipanggil dari dalam `async def analyze(...)` (`analyze_routes.py`). Jika Gemini mengembalikan `5xx`, seluruh *event loop* Uvicorn akan terhenti selama 10-20 detik. Sebaiknya ubah endpoint menjadi `def analyze(...)` biasa (agar dijalankan FastAPI di *threadpool*) atau gunakan `asyncio.sleep` dengan client async.
- **File Resource Kosong**: `app/resources/heading_aliases.yaml` dan `app/resources/keyword_synonyms.yaml` masih berukuran `0 byte` (kamus masih tertulis *hardcoded* di Python).
