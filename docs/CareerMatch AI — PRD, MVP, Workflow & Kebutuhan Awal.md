# CareerMatch AI — PRD, MVP, Workflow & Kebutuhan Awal

Nov 10, 2026 · @p

## Ringkasan

CareerMatch AI adalah platform web yang menganalisis CV pencari kerja dengan AI, lalu mengarahkannya ke lowongan yang paling cocok dari platform sendiri maupun sumber eksternal ber-API resmi.

Pengguna mengunggah CV. AI menyusun profil terstruktur, skor, dan saran perbaikan. Sistem lalu menampilkan lowongan terurut kecocokan, lengkap dengan alasan dan skill yang masih kurang. Employer memasang lowongan dan menerima pelamar yang sudah terskor.

Nilai utamanya: pencari kerja tahu kekuatan dan kelemahan CV-nya sekaligus punya arah lamaran; employer menerima pelamar yang lebih relevan. Nama "CareerMatch AI" masih sementara.

## Latar belakang, masalah, dan alasan

**Latar belakang.** Pencarian kerja di Indonesia tersebar di banyak portal, dan setiap pencari kerja menyiapkan CV sendiri tanpa tahu apakah CV itu layak. Portal besar menyediakan banyak lowongan, tetapi pengguna sendiri yang harus menyaring dan menilai mana yang cocok. Di sisi lain, perusahaan kecil sering tidak punya tim rekrutmen untuk menyaring lamaran satu per satu.

**Masalah.** Ada tiga masalah yang saling berkaitan. Pertama, pencari kerja, terutama fresh graduate, tidak mendapat umpan balik atas CV-nya, sehingga tidak tahu mengapa lamarannya tidak dibalas. Kedua, rekomendasi lowongan tidak dipersonalisasi, jadi pengguna membuka banyak portal dan mencocokkan skill-nya secara manual. Ketiga, employer menerima lamaran yang tidak relevan dan harus menyaringnya sendiri.

**Solusi.** CareerMatch AI menjawab setiap masalah dengan satu fitur inti. Untuk umpan balik CV, AI membaca CV yang diunggah, menyusun profil terstruktur, lalu memberi skor 0 sampai 100 dengan rincian per aspek, kekuatan, kelemahan, dan saran perbaikan; pengguna dapat mengoreksi profil itu sebelum dipakai. Untuk rekomendasi yang dipersonalisasi, sistem mencocokkan profil dengan lowongan dalam dua tahap, yaitu pencarian kemiripan vektor lalu penilaian LLM, dan menampilkan skor kecocokan, alasan, serta skill yang masih kurang. Untuk employer, lowongan dipasang langsung di platform dan pelamar tampil terurut skor kecocokan dengan ringkasan AI, sementara lowongan eksternal dari API resmi melengkapi pilihan pengguna dengan tautan ke sumber aslinya.

**Mengapa produk ini.** Analisis CV dengan AI menjawab ketiganya sekaligus: CV diubah menjadi profil terstruktur, dinilai, lalu dicocokkan dengan lowongan lengkap dengan alasan dan skill yang masih kurang. Pencari kerja mendapat arah perbaikan dan lamaran, sedangkan employer menerima pelamar yang sudah terurut kecocokannya. Pendekatan ini baru realistis sekarang karena LLM dan embedding dapat membaca CV berformat bebas dan mencocokkannya berdasarkan makna, bukan sekadar kata kunci, dengan biaya terkendali lewat matching dua tahap.

**Mengapa platform sendiri dan berbasis web.** Portal lokal besar belum membuka API publik resmi, sehingga lowongan dari employer di platform sendiri menjadi sumber yang paling terkendali, dilengkapi API eksternal yang sah dan kerja sama dengan Karirhub Kemnaker. Bentuk web dipilih karena mudah diakses dari ponsel tanpa instalasi dan cepat diuji oleh pengguna awal.

## Masalah & tujuan

MVP menyelesaikan tiga masalah: pencari kerja tidak tahu kualitas CV-nya, pencarian lowongan di banyak portal tidak dipersonalisasi, dan employer kebanjiran lamaran yang tidak relevan.

| ID | Tujuan | Ukuran keberhasilan |
| --- | --- | --- |
| G1 | Pengguna mendapat analisis CV dengan cepat | Kurang dari 60 detik dari unggah sampai hasil |
| G2 | Rekomendasi lowongan terasa relevan | Minimal 60% pengguna menilai 5 rekomendasi teratas relevan |
| G3 | Pengguna benar-benar melamar | Minimal 25% pengguna yang dianalisis melamar atau klik apply |
| G4 | Employer mau memasang lowongan | Minimal 20 employer aktif dalam 2 bulan pilot |

**Di luar tujuan MVP:**

- CV builder (membuat CV dari nol)
- Chat langsung pelamar dan employer
- Pembayaran atau langganan
- Aplikasi mobile native; cukup web responsif

## Pengguna & persona

Produk melayani tiga role; pencari kerja adalah fokus utama MVP.

| Role | Siapa | Kebutuhan utama |
| --- | --- | --- |
| Pencari kerja | Fresh graduate dan profesional muda | Tahu kualitas CV, dapat lowongan cocok, melamar dengan mudah |
| Employer | HRD, pemilik UMKM, rekruter | Pasang lowongan, lihat pelamar terurut kecocokan |
| Admin | Tim internal | Moderasi lowongan dan pengguna, pantau sistem |

**Rina, 22 tahun, lulusan S1 Informatika.** Belum pernah bekerja dan tidak yakin CV-nya layak. Ingin tahu skill apa yang kurang.

**Budi, 35 tahun, pemilik toko online.** Butuh admin gudang dan ingin pelamar yang sudah disaring.

## Ruang lingkup MVP

MVP mencakup alur lengkap pencari kerja dan employer dengan satu sumber lowongan eksternal; integrasi Karirhub dan fitur lanjutan ditunda.

| Role | Masuk MVP |
| --- | --- |
| Pencari kerja | Registrasi dan login (email + Google); upload CV PDF/DOCX maks 5 MB; analisis AI (profil, skor, kekuatan, kelemahan, saran); koreksi profil manual; rekomendasi lowongan dengan skor, alasan, dan gap skill; simpan dan lamar; hapus CV dan akun |
| Employer | Registrasi dan profil perusahaan; CRUD lowongan; daftar pelamar terurut skor; ubah status pelamar |
| Sumber eksternal | Satu adaptor API resmi (mis. Jooble) sebagai uji coba, dengan tautan keluar ke sumber asli |
| Admin | Moderasi lowongan; nonaktifkan pengguna atau lowongan |

**Ditunda setelah MVP:**

- Integrasi Karirhub Kemnaker (menunggu kerja sama dengan Pasker ID)
- Notifikasi email atau WhatsApp untuk lowongan baru
- Simulasi wawancara AI, CV builder, rekomendasi kursus
- Dashboard analitik employer, pembayaran, dan langganan
- Multi-bahasa penuh; MVP berbahasa Indonesia, CV berbahasa Inggris tetap bisa diproses

## PRD: kebutuhan fungsional

MVP memuat 24 kebutuhan wajib (P0) dan 8 kebutuhan tambahan (P1) di enam area.

**Wajib untuk MVP (P0)**

| ID | Area | Kebutuhan |
| --- | --- | --- |
| FR-01 | Akun | Daftar dan login dengan email + password dan Google |
| FR-02 | Akun | Pilih role saat daftar: pencari kerja atau employer |
| FR-04 | Akun | Reset password |
| FR-05 | Akun | Persetujuan eksplisit (consent) pemrosesan data pribadi saat unggah CV pertama |
| FR-10 | CV | Unggah CV PDF/DOCX maks 5 MB dengan validasi tipe dan ukuran |
| FR-11 | CV | Ekstraksi teks; bila kosong (PDF hasil scan), tampilkan pesan yang jelas |
| FR-12 | CV | AI menghasilkan profil terstruktur (format di bagian Model data) |
| FR-13 | CV | AI menghasilkan skor CV 0 sampai 100 dengan rincian per aspek dan saran perbaikan |
| FR-14 | CV | Pengguna dapat mengoreksi profil hasil ekstraksi sebelum dipakai matching |
| FR-16 | CV | Hapus CV (file, teks, profil) secara permanen |
| FR-17 | CV | Batas analisis per pengguna gratis, mis. 5 per bulan |
| FR-20 | Lowongan | Employer membuat, mengubah, dan menutup lowongan |
| FR-21 | Lowongan | Embedding dibuat otomatis untuk lowongan baru |
| FR-22 | Lowongan | Pencarian dan filter (kata kunci, lokasi, tipe kerja) |
| FR-23 | Lowongan | Lowongan eksternal ditarik berkala lewat API, dinormalisasi, dan ditandai sumbernya |
| FR-30 | Matching | Ambil 20 sampai 50 lowongan kandidat lewat kemiripan vektor |
| FR-31 | Matching | LLM menilai kandidat teratas: skor 0 sampai 100, alasan singkat, skill yang kurang |
| FR-32 | Matching | Hasil terurut skor dengan label sumber (internal atau eksternal) |
| FR-34 | Matching | Usia, gender, agama, foto, dan status pernikahan tidak dipakai dalam skor |
| FR-40 | Lamaran | Melamar lowongan internal dengan CV dan profil tersimpan |
| FR-41 | Lamaran | Lowongan eksternal: tombol "Lamar di sumber" membuka tautan asli |
| FR-43 | Lamaran | Employer melihat pelamar terurut skor dengan ringkasan AI |
| FR-44 | Lamaran | Employer mengubah status pelamar |
| FR-50 | Admin | Daftar dan moderasi lowongan (setujui, tolak, nonaktifkan) |

**Tambahan (P1)**

| ID | Area | Kebutuhan |
| --- | --- | --- |
| FR-03 | Akun | Verifikasi email |
| FR-15 | CV | Unggah ulang CV dan bandingkan skor |
| FR-24 | Lowongan | Deduplikasi lowongan (judul + perusahaan + lokasi) |
| FR-25 | Lowongan | Lowongan kedaluwarsa otomatis disembunyikan |
| FR-33 | Matching | Hasil di-cache; dihitung ulang saat profil berubah atau ada lowongan baru yang relevan |
| FR-42 | Lamaran | Pelamar melihat status lamarannya |
| FR-45 | Lamaran | Simpan atau bookmark lowongan |
| FR-51 | Admin | Nonaktifkan akun dan lihat log aktivitas dasar |

## Kebutuhan non-fungsional

Performa, keamanan, dan privasi adalah syarat peluncuran; skala awal cukup untuk sekitar 1.000 pengguna aktif.

| Area | Kebutuhan |
| --- | --- |
| Performa | Analisis CV selesai kurang dari 60 detik; halaman rekomendasi tampil kurang dari 3 detik dari cache |
| Keamanan | HTTPS; file CV di storage privat dengan signed URL kedaluwarsa; hash password (bcrypt atau argon2); rate limiting upload dan login; validasi file |
| Privasi | Kepatuhan UU PDP: consent, kebijakan privasi, hapus data atas permintaan, minimasi data yang dikirim ke LLM |
| Keandalan | Pemrosesan AI asinkron lewat antrean job; retry bila gagal; status proses terlihat di UI |
| Skalabilitas | Cukup untuk sekitar 1.000 pengguna aktif; worker dapat dipisah belakangan |
| Aksesibilitas | Responsif mobile-first, karena mayoritas pencari kerja memakai ponsel |
| Observabilitas | Log terstruktur, pelacakan error (Sentry), pencatatan biaya token per analisis |
| Keadilan AI | Tidak ada atribut sensitif di prompt scoring; hasil disertai penjelasan; pengguna dapat melaporkan hasil keliru |

## Workflow

Pencari kerja dan employer berjalan di dua alur terpisah, sementara pemrosesan AI berjalan di belakang layar lewat antrean job.

**Alur pencari kerja**

&#91;embedded content: alur pencari kerja · 9 langkah, 1 keputusan\]

Bila teks CV tidak terbaca (mis. PDF hasil scan), pengguna diminta mengunggah ulang. Profil hasil AI selalu dikoreksi pengguna sebelum dicocokkan dengan lowongan.

**Alur employer**

&#91;embedded content: alur employer · 7 langkah, 1 keputusan\]

Lowongan yang ditolak admin kembali ke employer untuk direvisi; lowongan yang disetujui otomatis dibuatkan embedding-nya.

**Pipeline AI (asinkron)**

Unggahan CV memicu job di antrean; worker mengekstrak teks, memanggil LLM, dan menyimpan profil. Matching berjalan dua tahap, dan sumber eksternal ditarik secara terjadwal.

&#91;embedded content: pipeline AI · 3 jalur, 14 langkah\]

LLM hanya menilai 20 sampai 50 lowongan teratas dari pencarian vektor, sehingga biaya dan waktu pemrosesan tetap terkendali.

## Arsitektur & tech stack

Satu aplikasi Next.js, database PostgreSQL dengan pgvector, dan satu worker antrean sudah cukup untuk MVP; stack final mengikuti keahlian tim.

&#91;embedded content: arsitektur · 8 komponen\]

Web app hanya menerima permintaan dan mengantrekan pekerjaan berat. Worker yang membaca CV, memanggil LLM, dan menarik lowongan dari API eksternal.

**Pilihan stack (usulan)**

| Lapisan | Pilihan |
| --- | --- |
| Frontend | Next.js + Tailwind CSS, responsif mobile-first |
| Backend | Next.js API routes untuk MVP; bisa dipisah ke NestJS atau Laravel bila tim lebih familiar |
| Database | PostgreSQL + pgvector, satu database untuk data biasa dan vektor |
| Storage | Supabase Storage atau Cloudflare R2, bucket privat dengan signed URL |
| Auth | Supabase Auth atau NextAuth, email dan Google |
| Antrean job | pg-boss atau BullMQ (Redis); pg-boss cukup untuk MVP tanpa Redis |
| AI | LLM untuk ekstraksi, skor, dan penjelasan, plus model embedding; keluaran JSON terstruktur |
| Ekstraksi teks | pdf-parse atau pdfjs untuk PDF, mammoth untuk DOCX; OCR setelah MVP |
| Hosting | Vercel untuk web; Supabase atau Railway untuk database dan worker |
| Monitoring | Sentry dan log terstruktur |

## Model data

Sepuluh tabel inti menyimpan pengguna, CV beserta profil dan embedding-nya, lowongan, hasil matching, dan lamaran.

| Tabel | Kolom utama |
| --- | --- |
| users | id, email, role, name, created\_at, deleted\_at |
| consents | id, user\_id, type, accepted\_at, policy\_version |
| cvs | id, user\_id, file\_path, status, uploaded\_at, deleted\_at |
| cv\_profiles | id, cv\_id, summary, skills, experiences, education, seniority, field, languages, score, score\_breakdown, suggestions, verified\_by\_user, embedding |
| companies | id, owner\_user\_id, name, description, website, verified |
| jobs | id, source, external\_id, company\_id, title, description, skills, location, work\_type, salary\_min, salary\_max, apply\_url, status, posted\_at, expires\_at, embedding |
| matches | id, cv\_profile\_id, job\_id, vector\_score, llm\_score, reasons, missing\_skills, created\_at |
| applications | id, job\_id, user\_id, cv\_id, status, match\_score, created\_at |
| saved\_jobs | user\_id, job\_id, created\_at |
| ai\_usage\_logs | id, user\_id, feature, tokens\_in, tokens\_out, cost, created\_at |

Indeks penting: `jobs(status, expires_at)`, indeks unik `jobs(source, external_id)`, dan indeks vektor (HNSW atau IVFFlat) pada kolom `embedding`.

**Keluaran AI: profil CV**

```json
{
  "summary": "string",
  "skills": ["string"],
  "experiences": [
    { "title": "string", "company": "string", "start": "YYYY-MM", "end": "YYYY-MM|null", "highlights": ["string"] }
  ],
  "education": [
    { "degree": "string", "institution": "string", "year": 2024 }
  ],
  "seniority": "intern|junior|mid|senior|lead",
  "field": "string",
  "languages": ["string"],
  "score": 0,
  "score_breakdown": { "struktur": 0, "kejelasan": 0, "pencapaian_terukur": 0, "relevansi_skill": 0, "kelengkapan": 0 },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"]
}
```

**Keluaran AI: penilaian lowongan**

```json
{
  "job_id": "string",
  "match_score": 0,
  "reasons": ["string"],
  "missing_skills": ["string"],
  "verdict": "sangat_cocok|cocok|cukup|kurang_cocok"
}
```

## Integrasi sumber lowongan

MVP memakai lowongan internal plus satu API eksternal; belum ada portal lokal besar yang membuka API publik resmi, jadi Karirhub dan portal lain ditempuh lewat kerja sama.

| Sumber | Status | Rencana |
| --- | --- | --- |
| Lowongan internal | Dikendalikan sendiri | MVP |
| Jooble API | API gratis dengan API key; data berupa cuplikan dan tautan keluar | MVP sebagai uji coba; cek dulu cakupan lowongan Indonesia |
| Adzuna API | API gratis; cakupan Indonesia belum dipastikan | Opsional; cek daftar negara di dokumentasi resmi |
| Karirhub Kemnaker | Belum ada API publik terdokumentasi yang ditemukan | Ajukan kerja sama ke Pasker ID atau Kemnaker, paralel dengan MVP |
| Portal swasta lokal (KitaLulus, Loker.id, dll.) | Lewat kerja sama bisnis | Setelah MVP |

**Aturan integrasi**

- Tidak melakukan scraping situs yang tidak mengizinkannya.
- Patuhi ketentuan atribusi, batas panggilan, dan larangan penyimpanan di tiap API.
- Setiap lowongan eksternal menampilkan sumber dan tautan asli.
- Semua sumber dipetakan lewat adaptor ke satu format lowongan standar, sehingga menambah sumber baru tidak mengubah sisa sistem.

```ts
interface JobSourceAdapter {
  name: string;
  fetchJobs(query: { keywords?: string; location?: string; page?: number }): Promise<RawJob[]>;
  normalize(raw: RawJob): NormalizedJob;
}
```

## Privasi, keamanan & etika AI

CV berisi data pribadi, jadi consent, minimasi data, dan hak hapus harus selesai sebelum peluncuran beta.

**Privasi (UU PDP)**

- Consent eksplisit sebelum CV diproses; catat versi kebijakan yang disetujui.
- Kebijakan privasi dan syarat ketentuan tersedia sebelum peluncuran.
- Fitur hapus CV dan akun menghapus file, teks, profil, embedding, dan hasil matching.
- Tentukan masa retensi data; usulan: CV dihapus otomatis 12 bulan setelah tidak aktif, dengan pemberitahuan.
- Samarkan nama, email, telepon, dan alamat sebelum teks dikirim ke LLM bila tidak diperlukan untuk analisis.
- Periksa kebijakan penyimpanan dan pelatihan data penyedia LLM; pilih opsi yang tidak memakai data untuk training.

**Keamanan**

- Bucket privat dan signed URL berumur pendek.
- Validasi tipe file sebenarnya, bukan hanya ekstensi, dan batasi ukuran.
- Rate limiting pada upload dan login.
- Lindungi dari prompt injection: isi CV diperlakukan sebagai data, bukan instruksi, dan output AI divalidasi dengan skema JSON.
- Employer hanya melihat CV pelamar yang melamar ke lowongannya.

**Etika dan bias**

- Usia, gender, agama, suku, status pernikahan, dan foto tidak dipakai dalam skor.
- Setiap skor disertai alasan; pengguna dapat melaporkan hasil keliru.
- AI adalah alat bantu; employer tetap yang memutuskan.

## Metrik keberhasilan

Tujuh metrik dipantau sejak beta; targetnya adalah titik awal dan disesuaikan setelah ada data nyata.

| Metrik | Target awal |
| --- | --- |
| Aktivasi: pengguna baru yang menyelesaikan unggah CV | Minimal 60% |
| Waktu analisis (p95) | Kurang dari 60 detik |
| Rekomendasi dinilai relevan (feedback jempol atas) | Minimal 60% |
| Konversi: analisis ke lamaran atau klik apply | Minimal 25% |
| Profil yang dikoreksi pengguna (indikator akurasi ekstraksi) | Kurang dari 30% field diubah |
| Biaya AI per analisis lengkap | Kurang dari Rp 1.500 (dipantau, disesuaikan) |
| Employer aktif (pilot) | Minimal 20 |

## Kebutuhan awal project

Untuk mulai, tim butuh dua sampai tiga orang, beberapa akun layanan, dokumen legal dasar, dan data uji; biaya bulanan awal diperkirakan Rp 150 ribu sampai Rp 1,7 juta.

### Tim dan peran

| Peran | Tanggung jawab |
| --- | --- |
| Fullstack atau backend lead | Auth, database, API, pipeline CV dan matching |
| Frontend atau UI | Halaman pengguna, employer, admin; UX upload dan hasil |
| Product atau operasional (boleh merangkap) | Riset pengguna, pendekatan employer dan mitra, kerja sama data, kebijakan privasi |

### Akun dan layanan

- [ ] Repository GitHub, aturan branch, dan code review
- [ ] Domain dan hosting (Vercel, Railway, atau Supabase)
- [ ] Database PostgreSQL dengan ekstensi pgvector
- [ ] Storage privat untuk CV
- [ ] API key LLM dan model embedding, dengan batas anggaran bulanan
- [ ] API key Jooble (dan Adzuna bila dipakai)
- [ ] Sentry untuk monitoring dan email transaksional (Resend atau Brevo)
- [ ] Papan kerja (Trello, Linear, atau GitHub Projects)

### Dokumen dan legal

- [ ] Kebijakan privasi dan syarat ketentuan, idealnya dikonsultasikan singkat dengan ahli hukum
- [ ] Formulir consent unggah CV
- [ ] Kebijakan moderasi lowongan untuk mencegah lowongan palsu dan penipuan, termasuk yang meminta bayaran dari pelamar
- [ ] Surat permohonan kerja sama ke Pasker ID atau Kemnaker

### Data uji

- [ ] 30 sampai 50 CV contoh (anonim atau sintetis; Indonesia dan Inggris, PDF dan DOCX, berbagai bidang)
- [ ] Lebih dari 100 lowongan contoh (internal buatan dan hasil Jooble)
- [ ] Golden set: 20 CV dinilai manusia terhadap lowongan, untuk menguji kualitas matching

### Estimasi biaya bulanan (kasar, perlu diverifikasi)

| Komponen | Perkiraan |
| --- | --- |
| Hosting, database, storage (tier gratis atau murah) | Rp 0 sampai 500 ribu |
| LLM dan embedding (tergantung volume) | Rp 100 ribu sampai 1 juta |
| Domain, email, monitoring | Rp 50 sampai 200 ribu |
| Total awal | Rp 150 ribu sampai 1,7 juta per bulan |

## Roadmap MVP

MVP dirancang selesai dalam sekitar 6 minggu dan ditutup dengan beta tertutup setelah empat kriteria selesai terpenuhi.

&#91;embedded content: roadmap · 6 minggu, 1 gerbang\]

## Risiko & mitigasi

Risiko terbesar adalah kebocoran data CV, kualitas ekstraksi, dan sulitnya mendapat employer awal.

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Ekstraksi CV salah (format tabel atau kolom, PDF scan) | Profil tidak akurat | Langkah koreksi manual; peringatan untuk PDF scan; OCR setelah MVP |
| Cakupan lowongan Indonesia di API gratis rendah | Rekomendasi sedikit | Dorong lowongan internal; ajukan kerja sama Kemnaker dan portal lokal |
| Biaya LLM membengkak | Anggaran habis | Matching dua tahap, cache, batas analisis, pantau biaya per pengguna |
| Bias atau hasil tidak adil | Reputasi dan risiko hukum | Larang atribut sensitif, jelaskan skor, sediakan jalur pelaporan |
| Kebocoran data CV | Risiko hukum berat | Storage privat, akses berbasis peran, audit, minimasi data |
| Lowongan palsu atau penipuan | Merugikan pengguna | Moderasi admin, verifikasi employer, tombol lapor |
| Prompt injection lewat isi CV | Skor dimanipulasi | Isi CV sebagai data, validasi skema output |
| Sulit mendapat employer awal | Platform sepi | Mulai dari satu niche (mis. IT atau fresh graduate di satu kota); pendekatan manual ke UMKM dan kampus |
| Bergantung pada satu API eksternal | Sumber lowongan putus | Lapisan adaptor dan beberapa sumber |

## Pertanyaan terbuka & langkah berikutnya

Tujuh keputusan perlu disepakati tim sebelum pengembangan dimulai; nomor 1, 2, dan 5 paling mendesak.

**Pertanyaan terbuka**

1. Segmen awal: semua bidang atau satu niche (IT, fresh graduate, UMKM)?
2. Apakah employer wajib diverifikasi sebelum memasang lowongan?
3. Model bisnis nanti: gratis untuk pencari kerja dan berbayar untuk employer, atau fitur premium analisis CV?
4. Berapa lama CV disimpan (masa retensi)?
5. Stack mana yang paling dikuasai tim?
6. Apakah lamaran internal cukup berupa CV dan profil, atau perlu pertanyaan tambahan dari employer?
7. Apakah hasil analisis CV boleh dilihat employer, atau hanya skor kecocokan per lowongan?

**Langkah minggu ini**

- [ ] Tim menyepakati jawaban pertanyaan di atas, minimal nomor 1, 2, dan 5
- [ ] Buat repo dan papan kerja, lalu pecah kebutuhan fungsional menjadi tiket
- [ ] Daftar API key Jooble dan uji cakupan lowongan Indonesia
- [ ] Kumpulkan data uji
- [ ] Kirim surat kerja sama ke Pasker ID atau Kemnaker
- [ ] Rancang wireframe: upload CV, hasil analisis, rekomendasi, form lowongan
