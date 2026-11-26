# Catatan Review & Evaluasi Teknis Layanan `backend-ai`

Dokumen ini merangkum hasil audit menyeluruh terhadap layanan **`backend-ai/`** tanpa mengubah satu pun kode di dalam direktori `backend-ai/`. Seluruh penyesuaian jembatan skema saat ini telah ditangani di lapisan **`backend-api/`** ([aiService.ts](../backend-api/src/services/aiService.ts)), dan poin-poin di bawah menjadi daftar catatan untuk tim pengembang AI.

---

## 1. Bagian yang Sudah Sesuai Rencana & Siap Produksi

1. **Ekstraksi Dokumen Teks Digital (`app/ingestion/`)**:
   - Mendukung `.pdf` (`pdfplumber`) dan `.docx` (`python-docx`) dengan deteksi PDF hasil scan (`is_scanned`), tata letak multi-kolom (`has_multi_column`), tabel (`has_table`), batas 10 halaman, dan batas 5 MB.
2. **Sanitasi Data Sensitif UU PDP (`app/sanitization/sanitizer.py`)**:
   - Menghapus baris berlabel sensitif (`DATE_OF_BIRTH`, `GENDER`, `RELIGION`, `MARITAL_STATUS`) sebelum dikirim ke LLM serta tidak pernah mencatat nilai asli ke dalam laporan atau log.
3. **Penilaian ATS 5 Dimensi Deterministik (`app/ats/`)**:
   - Menghitung skor `0-100` dengan validasi ketat total bobot `1.0` dan daftar `issues` berbahasa Indonesia.
4. **Anti-Halusinasi pada Saran LLM & Pencocokan (`app/advice/service.py` & `app/matching/scorer.py`)**:
   - Fungsi `_filter_unsupported` membuang saran yang mencantumkan kutipan palsu (tidak ada di teks CV).
   - Kegagalan kuota/jaringan LLM pada saran tidak menjatuhkan request HTTP (`advice_status`: `ok` / `quota_exhausted` / `unavailable`).
5. **Keamanan Internal & Pengujian**:
   - Seluruh endpoint `/internal/v1/*` dilindungi header `X-Internal-Token` dan 142 unit test `pytest` lulus 100%.

---

## 2. Daftar Catatan & Ketidaksesuaian pada `backend-ai` (Untuk Tindak Lanjut Tim AI)

### Catatan 1: `/internal/v1/cv/analyze` Belum Mengembalikan JSON `profile` Terstruktur
- **Rencana Awal / PRD (`FR-12` & `workflow.md` Bagian 5.1)**: Layanan AI mengekstrak struktur profil kandidat (`fullName`, `headline`, `summary`, `education[]`, `skills: { technical, soft, tools }`, `experiences[]`) agar pengguna bisa langsung meninjau dan mengeditnya serta untuk pratinjau kandidat di sisi *Company*.
- **Kondisi Saat Ini di `backend-ai`**: `AnalyzeResponse` hanya mengembalikan `ats`, `advice`, `cv_embedding`, dan `sanitized_text` mentah.
- **Penanganan Sementara di `backend-api`**: `aiService.ts` mengekstrak estimasi profil dari `sanitized_text`.
- **Rekomendasi untuk `backend-ai`**: Tambahkan ekstraksi `profile` terstruktur (melalui skema JSON Gemini atau parser terstruktur) pada `AnalyzeResponse`.

### Catatan 2: Perbedaan Nama 5 Dimensi & Nilai `null` pada Dimensi `keywords`
- **Rencana Kontrak Frontend (`CVDimensionScore`)**: Membutuhkan 5 angka wajib (`0-100`): `structure`, `clarity`, `measurableImpact`, `skillRelevance`, dan `completeness`.
- **Kondisi Saat Ini di `backend-ai`**: Memakai nama `readability`, `sections`, `keywords`, `content`, `contact_length`, dan **`keywords.score` bernilai `null`** apabila form `jd_keywords` tidak dikirim saat pengguna mengunggah CV umum.
- **Penanganan Sementara di `backend-api`**: `aiService.ts` memetakan kelima dimensi tersebut dan menghitung skor estimasi relevansi skill apabila `keywords.score` bernilai `null`.
- **Rekomendasi untuk `backend-ai`**: Sediakan skor kesiapan kata kunci umum berbasis kamus `skills.yaml` ketika `jd_keywords` kosong sehingga kelima dimensi selalu berupa integer `0-100`.

### Catatan 3: Belum Ada Daftar Kekuatan CV (`strengths`) pada Respons Analisis
- **Rencana Kontrak Frontend**: Menampilkan tiga bagian umpan balik: `strengths[]`, `weaknesses[]`, dan `recommendations[]`.
- **Kondisi Saat Ini di `backend-ai`**: Hanya mengembalikan `ats.issues[]` (masalah) dan `advice.suggestions[]` (saran), belum ada poin kekuatan (`strengths`).
- **Rekomendasi untuk `backend-ai`**: Tambahkan pembentukan `strengths[]` deterministik pada `ATSCheckResult` atau `CVAdvice` berdasarkan kriteria yang sudah terpenuhi baik oleh kandidat.

### Catatan 4: Belum Ada Endpoint HTTP untuk Embedding Lowongan (`job_embedding`) & Input Kuesioner Onboarding
- **Rencana Arsitektur Dua Tahap**: Stage 1 (`pgvector`) memerlukan `job_embedding` (1536 dimensi) dari model yang sama persis (`gemini-embedding-001`) setiap kali *Company* mempublikasikan lowongan baru atau memperbarui `keywords` perusahaan. Selain itu terdapat alur **Onboarding Kuesioner** bagi pencari kerja yang belum memiliki file PDF/DOCX.
- **Kondisi Saat Ini di `backend-ai`**: Class `GeminiEmbedder` sudah ada di `app/embedding/gemini_embedder.py`, namun belum diekspos sebagai endpoint HTTP (misalnya `POST /internal/v1/embed`). Endpoint analisis juga hanya menerima upload file fisik (`.pdf` / `.docx`).
- **Penanganan Sementara di `backend-api`**: `docxBuilder.ts` menyusun berkas `.docx` standar secara dinamis dari jawaban kuesioner agar tetap bisa dikirim ke `/internal/v1/cv/analyze`.
- **Rekomendasi untuk `backend-ai`**:
  1. Tambahkan endpoint `POST /internal/v1/embed` (menerima array teks lowongan/keyword perusahaan dan mengembalikan vektor 1536d).
  2. Tambahkan endpoint `POST /internal/v1/cv/analyze-text` atau dukungan payload teks terstruktur untuk alur Onboarding.

### Catatan 5: Batas `MAX_CANDIDATES = 5` & Cakupan Kamus `skills.yaml` pada `/internal/v1/match/stage2`
- **Kondisi Saat Ini di `backend-ai`**:
  1. `match_routes.py` membatasi `MAX_CANDIDATES = 5` per request (padahal Stage 1 dirancang mengirim Top 20-50 kandidat lowongan). Saat ini `backend-api` harus memecahnya menjadi beberapa panggilan *batch* per 5 lowongan.
  2. Pencocokan di `app/matching/scorer.py` 100% bergantung pada 49 entri statis di `app/resources/skills.yaml`. Skill populer seperti `Figma`, `UI/UX`, `Flutter`, `Kotlin`, `Swift`, `PHP`, `Laravel`, `Vue`, `GraphQL`, atau `Scrum` belum terdaftar, sehingga lowongan dengan skill tersebut akan memperoleh `match_score: 0`.
- **Rekomendasi untuk `backend-ai`**: Naikkan `MAX_CANDIDATES` menjadi minimal `25-50` (karena `stage2` berjalan lokal tanpa kuota LLM sehingga sangat ringan) dan perluas `skills.yaml` + `skill_labels.yaml` atau tambahkan *fallback token matching* untuk `cand.skills` yang dikirim oleh perusahaan.

### Catatan 6: Belum Ada Endpoint Konsultasi Chatbot Interaktif
- **Kondisi Saat Ini**: Halaman **Hasil Evaluasi** memiliki fitur chatbot konsultasi CV interaktif, tetapi `backend-ai` belum menyediakan endpoint tanya-jawab kontekstual (misalnya `POST /internal/v1/cv/chat` dengan konteks hasil `ats` dan `sanitized_text`).

### Catatan 7: Ketidaksinkronan `.env.example`, Port, Nama Model Default, dan Normalizer Lowongan
1. **Berkas `backend-ai/.env.example` Tertinggal**: Masih mencantumkan variabel lama (`PORT=8001`, `OPENAI_API_KEY`, `DEFAULT_LLM_MODEL=gpt-4o-mini`, `DATABASE_URL`, `JOOBLE_API_KEY`) dan belum mencantumkan variabel yang benar-benar dibaca `app/config.py` (`INTERNAL_TOKEN`, `GEMINI_MODEL`, `LLM_ALLOW_MOCK`).
2. **Nama Model Default `GEMINI_MODEL`**: Di `app/config.py` tertulis default `"gemini-3.5-flash-lite"`. Pastikan nama model sesuai dengan ID model resmi yang aktif pada Google GenAI API `v1beta` (misalnya `gemini-2.5-flash` atau `gemini-2.0-flash`) agar tidak memicu kegagalan generasi saran (`advice_status: "unavailable"`).
3. **Parameter Batas Ukuran Dinamis**: `MAX_FILE_SIZE_BYTES` masih statis `5 MB` di `app/config.py`, sedangkan Admin memiliki fitur pengaturan batas ukuran CV pada menu *Standarisasi Platform* (saat ini divalidasi di `backend-api`).
4. **Normalizer Sumber Eksternal**: `app/jobs/normalizer.py` mengimplementasikan normalizer `arbeitnow` (bukan `jooble` sebagaimana tertulis di PRD) dan belum dihubungkan ke route HTTP mana pun.

### Catatan 8: Kebersihan Kode Internal (`Minor Cleanup`)
- Duplikasi definisi/import `_norm` di `app/advice/service.py` (baris 10 dan 29).
- Duplikasi import `APIRouter, File, Form, HTTPException, UploadFile` di `app/api/ats_routes.py` (baris 5 dan 19).
- Duplikasi import `_compiled_patterns, extract_skills` di `app/matching/scorer.py` (baris 5 dan 7).
- Pemanggilan `time.sleep(10 * (attempt + 1))` sinkron di `GeminiProvider.generate_json` yang dipanggil dari route `async def analyze` sebaiknya dijalankan melalui threadpool (`anyio.to_thread.run_sync`) atau `asyncio.sleep` agar tidak memblokir *event loop* saat terjadi retry `5xx`.
- Berkas `app/resources/heading_aliases.yaml` dan `app/resources/keyword_synonyms.yaml` masih kosong (`0 byte`).
