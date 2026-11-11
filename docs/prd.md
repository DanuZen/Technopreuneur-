# CareerMatch AI — Product Requirements Document (PRD)

> **Status:** Draft / Active MVP  
> **Versi:** 1.0.0  
> **Target Release:** Q1-Q2 (MVP 6 Minggu)  
> **Nama Produk (Sementara):** CareerMatch AI  
> **Tim Pengembang:**
> - **Wira Fikri Ramadanu (23343023)** — Frontend Lead (`frontend/`)
> - **Muhammad Gilang Ramadhan (23346013)** — Backend Lead (`backend-api/`)
> - **Florensius Panca Gati (23343006)** — Backend AI Lead (`backend-ai/`)

---

## 1. Executive Summary & Ringkasan Produk

**CareerMatch AI** adalah platform web cerdas yang menganalisis Curriculum Vitae (CV) pencari kerja menggunakan Artificial Intelligence (LLM dan Embedding Vektor), menyusun profil terstruktur, memberikan evaluasi mendalam beserta saran perbaikan, dan mencocokkannya ke lowongan kerja paling relevan dari pangkalan lowongan internal maupun mitra penyedia API eksternal resmi.

### Nilai Utama (Value Proposition)
- **Bagi Pencari Kerja (Job Seeker):** Mengetahui kekuatan dan kelemahan CV, mendapatkan gap analysis (skill yang masih kurang), serta menerima rekomendasi lowongan kerja terpersonalisasi yang transparan beserta alasan kecocokan.
- **Bagi Perusahaan (Employer):** Menghemat waktu screening kandidat melalui pemeringkatan pelamar otomatis berbasis skor kecocokan semantik dan ringkasan AI, tanpa bias atribut sensitif.

---

## 2. Latar Belakang & Pernyataan Masalah

### 2.1 Latar Belakang
Pencarian kerja di Indonesia saat ini tersebar di berbagai platform tanpa standardisasi. Banyak pelamar (khususnya *fresh graduate*) mengirimkan puluhan hingga ratusan lamaran secara membabi buta tanpa memahami apakah CV mereka telah memenuhi kualifikasi atau layak secara format. Di sisi lain, UMKM dan perusahaan rintisan seringkali tidak memiliki tim Human Capital atau ATS (*Applicant Tracking System*) berbayar untuk menyaring ribuan lamaran yang masuk.

### 2.2 Masalah Inti
1. **Zero Feedback Loop bagi Job Seeker:** Pelamar tidak mendapatkan umpan balik objektif mengenai alasan CV mereka diabaikan atau gagal lolos screening.
2. **Pencarian Lowongan Manual & Tidak Terpersonalisasi:** Rekomendasi di portal umum mayoritas berbasis filter kata kunci mentah (*lexical keyword match*), bukan pemahaman konteks pengalaman atau kompetensi sejati.
3. **Screening Fatigue pada Employer:** Perusahaan menerima volume pelamar tinggi dengan tingkat relevansi rendah, membuang waktu dan biaya rekrutmen.

### 2.3 Solusi CareerMatch AI
- **Dua Pilihan Input Profil Kandidat:**
  1. *Pengguna Ber-CV:* AI mengekstrak teks, menstandarkan profil, dan memberi skor 0–100 lengkap dengan 5 dimensi penilaian serta saran perbaikan.
  2. *Pengguna Tanpa CV:* Sistem menyediakan kuesioner terpandu (*Guided Smart Questionnaire*) mengenai riwayat pendidikan, skill, pengalaman organisasi/magang/proyek, dan minat karir; AI kemudian otomatis merangkai CV terstruktur siap pakai.
- **Human-in-the-Loop Verification:** Pengguna dapat meninjau dan mengoreksi profil hasil ekstraksi/generasi AI sebelum profil digunakan dalam pencocokan lowongan.
- **Two-Stage Matching Engine:** Mengombinasikan pencarian kemiripan vektor (*vector similarity*) pada database lowongan, dilanjutkan dengan evaluasi kontekstual LLM untuk kandidat teratas guna menghasilkan skor kecocokan, alasan, dan daftar *missing skills*.
- **Fair Recruitment:** Skor kecocokan murni dihitung dari kompetensi, pengalaman, dan portofolio teknis—secara ketat mengesampingkan usia, gender, suku, agama, foto profil, dan status pernikahan.

---

## 3. Tujuan Produk & Metrik Keberhasilan (OKRs)

### 3.1 Tujuan MVP
| ID | Tujuan | Metrik Keberhasilan (Target MVP) |
| :--- | :--- | :--- |
| **G1** | Pengguna mendapat analisis CV dengan cepat dan andal | Latensi < 60 detik dari upload hingga visualisasi skor (P95) |
| **G2** | Rekomendasi lowongan dirasakan relevan dan solutif | $\ge 60\%$ pengguna memberi feedback positif (thumbs up) pada Top 5 rekomendasi |
| **G3** | Mendorong konversi tindakan pelamaran kerja | $\ge 25\%$ pengguna yang selesai dianalisis menekan tombol *Apply* atau *Lamar di Sumber* |
| **G4** | Partisipasi aktif employer lokal/UMKM | Minimal 20 employer aktif memasang lowongan dalam 2 bulan masa pilot |

### 3.2 Batasan Ruang Lingkup MVP (Out of Scope)
Hal-hal berikut **TIDAK** masuk dalam lingkup rilis MVP:
- Desainer template grafis/drag-and-drop CV visual (format PDF siap cetak dengan pilihan layout grafis kompleks ditunda pasca-MVP; MVP berfokus pada konten terstruktur teks digital).
- Fitur live chat/inbox langsung antara pelamar dan employer.
- Sistem monetisasi berbayar, paywall, atau langganan payment gateway.
- Aplikasi mobile native (iOS / Android) — MVP difokuskan pada Progressive/Responsive Web Mobile-First.
- OCR untuk PDF berbasis pemindaian gambar (image scan) — MVP fokus pada PDF/DOCX berbasis teks murni.
- Simulasi wawancara kerja AI (*AI mock interview*) dan integrasi kursus edukasi.

---

## 4. Persona Pengguna

```
┌────────────────────────────────────────────────────────┐
│                   TARGET PENGGUNA                      │
├──────────────────────────┬─────────────────────────────┤
│ 1. Rina (22 th)          │ Fresh Graduate S1 TI        │
│    Goal: Cek kualitas CV │ Butuh rekomendasi loker pas │
├──────────────────────────┼─────────────────────────────┤
│ 2. Budi (35 th)          │ Pemilik Bisnis / UMKM       │
│    Goal: Rekrut staf     │ Butuh pelamar terkurasi     │
├──────────────────────────┼─────────────────────────────┤
│ 3. Admin Internal        │ Tim Operasional Platform    │
│    Goal: Moderasi loker  │ Monitor kualitas & anti-spam│
└──────────────────────────┴─────────────────────────────┘
```

1. **Pencari Kerja Utama (*Primary Persona* - Rina, 22 tahun):**
   - **Profil:** Fresh graduate Sarjana Komputer / Manajemen, belum memiliki pengalaman kerja formal panjang.
   - **Pain Point:** Sering ditolak tanpa kabar (*ghosting*), bingung apakah CV-nya ramah ATS, tidak tahu skill apa yang perlu ditambah.
   - **Kebutuhan:** Evaluasi CV instan, tahu kekurangan spesifik, menemukan lowongan entry-level yang benar-benar relevan.

2. **Pemberi Kerja (*Employer Persona* - Budi, 35 tahun):**
   - **Profil:** Pemilik UMKM / Founder startup tahap awal tanpa tim HR khusus.
   - **Pain Point:** Menerima ratusan email lamaran tidak sesuai kriteria, tidak sempat membaca satu per satu.
   - **Kebutuhan:** Memasang lowongan dengan cepat, melihat daftar pelamar yang otomatis diurutkan berdasarkan skor kecocokan tertinggi.

3. **Administrator (*Internal Ops*):**
   - **Profil:** Tim pengelola platform CareerMatch AI.
   - **Kebutuhan:** Dashboard kurasi lowongan internal, pemblokiran lowongan fiktif/berbahaya, monitoring konsumsi kuota token AI.

---

## 5. Kebutuhan Fungsional (Functional Requirements)

### 5.1 Prioritas P0 (Wajib untuk MVP)

| ID | Area | Deskripsi Kebutuhan | Kriteria Penerimaan (Acceptance Criteria) |
| :--- | :--- | :--- | :--- |
| **FR-01** | Akun | Registrasi dan autentikasi | Mendukung pendaftaran via Email/Password dan OAuth Google SSO |
| **FR-02** | Akun | Seleksi Role | User memilih role saat pertama kali daftar: `jobseeker` atau `employer` |
| **FR-04** | Akun | Reset Password | Alur *Forgot Password* dengan pengiriman token tautan aman ke email |
| **FR-05** | Akun & PDP | User Consent eksplisit | Checkbox persetujuan pemrosesan data pribadi (UU PDP) sebelum unggah CV pertama |
| **FR-10** | CV | Upload Dokumen | Mendukung format `.pdf` dan `.docx` dengan batas ukuran maksimal 5 MB |
| **FR-11** | CV | Validasi & Ekstraksi Teks | Validasi tipe MIME file asli; deteksi jika teks kosong (scan) dengan pesan error edukatif |
| **FR-12** | CV | Ekstraksi Profil Terstruktur | AI memetakan CV menjadi JSON (ringkasan, skill, pengalaman, edukasi, bahasa) |
| **FR-13** | CV | Scoring & Feedback AI | AI menghasilkan skor 0–100, breakdown 5 aspek, daftar kekuatan, kelemahan, dan saran perbaikan |
| **FR-14** | CV | Koreksi Profil oleh Pengguna | Pengguna dapat mengedit data profil hasil ekstraksi sebelum digunakan oleh sistem matching |
| **FR-16** | CV | Penghapusan Data Permanen | Pengguna dapat menghapus dokumen CV, teks mentah, profil, dan embedding kapan saja |
| **FR-17** | CV | Rate Limiting Analisis | Batas analisis CV akun gratis (misal: kuota 5 kali analisis per bulan) |
| **FR-18** | CV & Form | Kuesioner Pembuatan CV (User Tanpa CV) | Form interaktif terpandu (pendidikan, skill, pengalaman/organisasi/proyek, minat karir); AI otomatis menghasilkan profil & resume terstruktur |
| **FR-20** | Lowongan | Manajemen Lowongan Employer | Employer dapat membuat (Create), mengubah (Update), dan menutup (Close) lowongan |
| **FR-21** | Lowongan | Otomasi Embedding Lowongan | Sistem otomatis men-generate embedding vektor saat lowongan baru dipublikasikan |
| **FR-22** | Lowongan | Pencarian & Filter | Job seeker dapat memfilter lowongan berdasarkan kata kunci, lokasi, tipe kerja (*remote/on-site*) |
| **FR-23** | Lowongan | Ingestion API Eksternal | Sistem menarik lowongan eksternal via API resmi (misal: Jooble), menormalisasi skema, dan mencantumkan sumber |
| **FR-30** | Matching | Stage 1: Vector Search | Mengambil Top 20–50 kandidat lowongan teratas menggunakan kemiripan cosinus pgvector |
| **FR-31** | Matching | Stage 2: LLM Scoring | LLM mengevaluasi kandidat teratas: skor 0–100, narasi alasan kecocokan, dan *missing skills* |
| **FR-32** | Matching | Tampilan Hasil Terurut | Daftar rekomendasi disajikan urut skor tertinggi lengkap dengan badge sumber (*Internal / Eksternal*) |
| **FR-34** | Matching | AI Fairness Enforcement | Atribut sensitif (foto, gender, umur, agama, status nikah) disanitasi sebelum prompt scoring |
| **FR-40** | Lamaran | Quick Apply Internal | Job seeker dapat melamar lowongan internal platform dengan 1 klik menggunakan profil aktif |
| **FR-41** | Lamaran | External Redirect | Lowongan eksternal menyediakan tombol *Lamar di Sumber Asli* yang membuka tab baru ke URL mitra |
| **FR-43** | Lamaran | Review Pelamar Employer | Employer melihat pelamar yang masuk terurut skor kecocokan tertinggi dan ringkasan AI |
| **FR-44** | Lamaran | Update Status Lamaran | Employer dapat memperbarui status pelamar (`submitted`, `reviewed`, `shortlisted`, `rejected`) |
| **FR-50** | Admin | Moderasi Konten Lowongan | Admin dapat meninjau, menyetujui, menolak, atau menonaktifkan lowongan yang melanggar |

### 5.2 Prioritas P1 (Fitur Tambahan Pasca-P0)

| ID | Area | Deskripsi Kebutuhan |
| :--- | :--- | :--- |
| **FR-03** | Akun | Verifikasi alamat email wajib sebelum dapat melamar |
| **FR-15** | CV | Riwayat unggahan ulang CV dengan fitur komparasi skor antar-versi |
| **FR-24** | Lowongan | Deduplikasi otomatis lowongan (pencocokan judul, perusahaan, dan lokasi) |
| **FR-25** | Lowongan | Auto-archive/hide untuk lowongan yang telah melewati `expires_at` |
| **FR-33** | Matching | Caching hasil rekomendasi; re-compute saat profil diubah atau ada lowongan signifikan |
| **FR-42** | Lamaran | Pelacak status lamaran di sisi pencari kerja (*Applied Jobs Dashboard*) |
| **FR-45** | Lamaran | Fitur simpan/bookmark lowongan untuk dibaca nanti (*Saved Jobs*) |
| **FR-51** | Admin | Fitur suspend user dan audit log aktivitas sistem |

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 6.1 Performa
- Analisis CV lengkap (ekstraksi teks, LLM parsing, scoring) harus selesai dalam waktu **$< 60$ detik** pada jaringan normal.
- Pemuatan halaman rekomendasi lowongan yang telah ter-cache harus di bawah **3 detik**.
- Latensi kueri vektor pada database postgres (pgvector) di bawah **200 ms** untuk 50.000 vektor data lowongan.

### 6.2 Keamanan & Proteksi Data
- Komunikasi wajib terenkripsi menggunakan protokol **HTTPS / TLS 1.3**.
- File dokumen CV disimpan dalam bucket cloud privat (Supabase Storage / Cloudflare R2) yang hanya bisa diakses via **Pre-signed URL berdurasi singkat (misal: 15–30 menit)**.
- Password dienkripsi menggunakan algoritma hashing modern (**bcrypt** atau **Argon2id**).
- Mekanisme **Rate Limiting** ketat pada endpoint upload CV dan autentikasi login guna mencegah abuse/DDoS.
- **Prompt Injection Defense:** Input teks dari CV dibungkus murni sebagai data pasif di dalam delimiters ketat, bukan instruksi yang dapat dieksekusi LLM. Format balikan diwajibkan berupa structured JSON valid.

### 6.3 Kepatuhan Privasi (UU Perlindungan Data Pribadi / PDP)
- Persetujuan eksplisit (*opt-in consent*) wajib diperoleh sebelum file CV diproses atau disimpan.
- Hak untuk dilupakan (*Right to be Forgotten*): Tombol hapus akun/CV wajib menghapus file biner, teks terekstraksi, vektor embedding, dan relasi profil di database secara menyeluruh.
- Pembersihan data sensitif (PII sanitization): Nomor telepon, alamat detail, dan NIK disensor sebelum diteruskan ke model LLM eksternal pihak ketiga jika tidak esensial.
- Pemilihan vendor LLM yang memiliki komitmen legal *zero data retention for training* pada API komersial.

### 6.4 Keandalan & Skalabilitas (Reliability)
- Arsitektur pengolahan AI menggunakan pola *asynchronous job queue* (pg-boss / BullMQ) agar request web tidak mengalami *HTTP timeout 504*.
- Mekanisme *retry exponential backoff* (maksimal 3 kali percobaan) untuk kegagalan komunikasi API LLM eksternal.
- Kapasitas awal ditargetkan mampu menangani beban **1.000 pengguna aktif bulanan (MAU)** dengan arsitektur modular yang siap dipisahkan antara backend API dan AI worker service.

---

## 7. Integrasi Eksternal & Adaptor Lowongan

Untuk mengatasi kelangkaan lowongan internal di fase awal MVP, sistem memanfaatkan satu adaptor API lowongan kerja resmi (Jooble API).

### Kontrak Adaptor Standar (`JobSourceAdapter`)
```typescript
export interface RawJob {
  id: string;
  title: string;
  company: string;
  location: string;
  snippet?: string;
  url: string;
  updated_at?: string;
  salary?: string;
}

export interface NormalizedJob {
  source: 'internal' | 'jooble' | 'karirhub';
  externalId: string;
  title: string;
  companyName: string;
  description: string;
  skills: string[];
  location: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  applyUrl: string;
  postedAt: Date;
}

export interface JobSourceAdapter {
  name: string;
  fetchJobs(query: { keywords?: string; location?: string; page?: number }): Promise<RawJob[]>;
  normalize(raw: RawJob): NormalizedJob;
}
```

### Prinsip Etika Integrasi:
1. **No Web Scraping:** Tidak melakukan scraping ilegal pada portal kerja lokal yang melarang crawling dalam `robots.txt` atau ToS mereka.
2. **Atribusi Jelas:** Menampilkan nama penyedia sumber asli beserta tautan aktif langsung ke portal penyedia.
3. **Peluang Kemitraan:** Menyiapkan proposal integrasi resmi ke Karirhub Kemnaker (Pasker ID) untuk dihubungkan pasca-MVP.

---

## 8. Pertimbangan Etika & Bias AI

1. **Blind Scoring:** Pemeringkatan profil kandidat secara absolut tidak mengikutsertakan parameter demografi (gender, foto, ras, agama, usia, status perkawinan).
2. **Explainable AI (XAI):** Setiap skor kecocokan wajib menyertakan daftar *reasons* (mengapa cocok) dan *missing_skills* (apa yang belum terpenuhi).
3. **Koreksi Manusia:** Hasil parsing AI bukan vonis mutlak; pengguna diberikan wewenang penuh untuk merevisi profil sebelum masuk ke kalkulasi rekomendasi.

