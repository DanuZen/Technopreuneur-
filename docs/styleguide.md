# CareerMatch AI: Design System & Style Guide

Panduan desain visual, komponen antarmuka (UI), prinsip aksesibilitas, dan standar komunikasi (*tone of voice*) untuk platform **CareerMatch AI**.

---

## 1. Identitas Brand & Prinsip Desain

### 1.1 Brand Identity
- **Nama Produk (Sementara):** CareerMatch AI
- **Esensi Produk:** *Clarity in Career, Precision in Hiring.*
- **Karakter Visual:** Modern, bersih, terpercaya, humanis, dan berorientasi data tanpa kesan kaku atau mengintimidasi.

### 1.2 Prinsip Desain Utama
1. **Clarity over Cleverness:** Informasi penting (skor CV, alasan kecocokan, gap skill) disajikan lugas dan dapat dipindai (*scannable*) dalam hitungan detik.
2. **Mobile-First & Touch-Friendly:** Lebih dari 70% pencari kerja di Indonesia mengakses melalui smartphone; seluruh kontrol antarmuka dirancang nyaman untuk jari tangan (minimal touch area $44 \times 44\text{ px}$).
3. **Empathetic & Actionable:** Evaluasi CV tidak boleh membuat pengguna berkecil hati; setiap kritik kelemahan **wajib** disertai saran perbaikan konkret.
4. **Anti-Slop Copywriting:** Menghindari jargon AI generik (*"supercharge your career"*, *"unleash potential"*, *"delve into"*). Bahasa yang dipakai adalah bahasa Indonesia sehari-hari yang profesional, hangat, dan to-the-point.

---

## 2. Palet Warna (Color System)

Sistem warna resmi CareerMatch AI berakar pada tiga pilar warna identitas dengan rasio kontras tinggi (WCAG AA/AAA):

### 2.1 Brand Core Colors
| Peran Warna | Hex Code | Token Tailwind | Karakter & Penggunaan |
| :--- | :--- | :--- | :--- |
| **Primary** | `#0f2c56` | `primary`, `brand-primary` | Deep Navy: Tombol aksi utama, header navigasi, display typography, border kontras |
| **Secondary** | `#ce2731` | `secondary`, `brand-secondary` | Crimson Red: Aksen visual, sorotan status, CTA perhatian tinggi, badge penanda |
| **Third (Surface)** | `#fefefd` | `surface-0`, `brand-third` | Warm Soft White: Latar belakang kanvas, kartu putih lembut, kontras teks optimal |

### 2.2 Brand & Neutral Palette
| Token | Hex (Light) | Hex (Dark) | Kegunaan |
| :--- | :--- | :--- | :--- |
| `primary` | `#0f2c56` | `#8eb3d6` | Warna utama identitas brand dan teks judul |
| `primary-hover` | `#163861` | `#bad0e6` | State hover tombol primary |
| `secondary` | `#ce2731` | `#f57579` | Warna aksen sekunder dan highlight aktif |
| `secondary-hover` | `#b01e27` | `#faa9ab` | State hover elemen secondary |
| `surface-0` | `#fefefd` | `#081b37` | Background kanvas dasar halaman |
| `surface-50` | `#f8f9fa` | `#0f2c56` | Background kartu, section alternate, input form |
| `surface-100` | `#f1f3f5` | `#163861` | Border kartu, garis pembatas (divider) |
| `text-primary`| `#0f2c56` | `#fefefd` | Teks judul utama, teks isi penting |
| `text-secondary`| `#475569` | `#dbe5f2` | Subtitle, deskripsi panjang, label metadata |
| `text-muted` | `#94a3b8` | `#8eb3d6` | Placeholder form, tanggal relatif, teks disclaimer |

### 2.3 Semantic & Scoring Colors
Digunakan khusus untuk indikator visual skor CV dan tingkat kecocokan lowongan:

| Kategori | Range Skor | Hex Warna | Token Tailwind | Konteks Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Sangat Cocok / Unggul** | 80 - 100 | `#10B981` | `emerald-500` | Badge skor tinggi, kelebihan CV, skill terpenuhi |
| **Cocok / Cukup** | 60 - 79 | `#F59E0B` | `amber-500` | Skor moderat, saran perbaikan minor |
| **Perlu Peningkatan / Gap** | 0 - 59 | `#ce2731` | `secondary` | Missing skills, kelemahan format CV, status penolakan |
| **Info / Netral** | - | `#0f2c56` | `primary` | Badge sumber lowongan resmi |

---

## 3. Tipografi (Typography)

Menggunakan keluarga font sans-serif modern yang nyaman dibaca pada layar kecil, dipadukan dengan font monospace untuk skor angka dan cuplikan data teknis.

- **Primary Font Family:** `Inter`, `Plus Jakarta Sans`, atau sistem sans-serif native (`system-ui, -apple-system, sans-serif`).
- **Monospace Font Family:** `JetBrains Mono`, `Fira Code`, atau monospace native.

### Skala Tipografi
| Tingkat | Ukuran (px / rem) | Weight | Line Height | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | 32px / 2.0rem | Bold (700) | 1.25 | Judul landing page, heading utama dashboard |
| **Heading / H2** | 24px / 1.5rem | Semi-Bold (600) | 1.3 | Judul kartu analisis, judul detail lowongan |
| **Subheading / H3** | 18px / 1.125rem | Semi-Bold (600) | 1.4 | Judul section sub-komponen, nama perusahaan |
| **Body Large** | 16px / 1.0rem | Regular (400) | 1.5 | Paragraf pengantar, ringkasan profil |
| **Body Base** | 14px / 0.875rem | Regular / Medium | 1.5 | Teks default, detail deskripsi lowongan |
| **Caption / Small**| 12px / 0.75rem | Medium (500) | 1.4 | Badge pill, timestamp, error hint |
| **Numeric Score** | 28px - 40px | Bold (700, Mono) | 1.0 | Angka skor nilai CV dan skor kecocokan |

---

## 4. Komponen Kunci UI (Design Patterns)

### 4.1 Kotak Unggah CV (File Dropzone)
Komponen sentral di halaman awal pencari kerja:
- **Default State:** Area bergaris putus-putus (`border-dashed border-2 border-slate-300`), icon dokumen awan, instruksi jelas: *"Tarik file CV Anda ke sini atau klik untuk memilih file"*.
- **Validation Note:** Label teks kecil: *"Mendukung PDF & DOCX hingga 5 MB. Pastikan CV berbasis teks digital (bukan hasil scan foto)."*
- **Drag-Over State:** Background berubah lembut menjadi `primary-50` dengan border `primary-500`.
- **Loading / Uploading State:** Menampilkan nama file, ukuran file, progress bar animasi persentase, dan indikator teks status: *"Membaca teks CV..."* $\rightarrow$ *"Menganalisis kompetensi dengan AI..."*.
- **Error / Scan Warning Alert:** Panel peringatan berwarna kuning `amber-50` bertuliskan: *"Dokumen terbaca kosong. CV Anda terdeteksi sebagai scan gambar. Unggah file dokumen teks digital agar AI dapat membaca isinya."*

### 4.2 Kartu Visualisasi Skor CV (Scorecard)
- **Ringkasan Skor:** Lingkaran skor radial (*radial progress ring*) besar menampilkan angka 0-100 dengan warna dinamis (merah/kuning/hijau).
- **Breakdown 5 Dimensi:**
  1. *Struktur Dokumen* (0-20 pt)
  2. *Kejelasan Narasi* (0-20 pt)
  3. *Pencapaian Terukur & Angka* (0-20 pt)
  4. *Relevansi Keahlian* (0-20 pt)
  5. *Kelengkapan Informasi* (0-20 pt)
- Disajikan dalam bentuk horizontal bar meter dengan nilai per aspek.
- **Section Kekuatan & Kelemahan:**
  - *Kekuatan:* Menggunakan icon centang hijau (`CheckCircle2`) dengan kalimat penjelas.
  - *Kelemahan & Saran:* Menggunakan icon lampu kuning (`Lightbulb`) berisikan instruksi tindakan konkret perbaikan.

### 4.3 Kartu Rekomendasi Lowongan (Job Recommendation Card)
Format kartu lowongan yang dirancang mudah dibaca cepat:

```
┌──────────────────────────────────────────────────────────────┐
│  Frontend Engineer (React/Next.js)           [ 88% Cocok ]   │
│  PT Teknologi Bangsa · Jakarta Selatan (Hybrid)              │
│  Rp 8.000.000 - Rp 12.000.000 / bln         [ Sumber: Jooble]│
├──────────────────────────────────────────────────────────────┤
│  Alasan Relevan:                                             │
│  • Pengalaman proyek Next.js Anda cocok dengan kriteria      │
│  • Memiliki portofolio Tailwind CSS & REST API               │
│                                                              │
│  Skill yang Masih Perlu Dipelajari:                          │
│  [ Missing: TypeScript Strict ]  [ Missing: GraphQL ]        │
├──────────────────────────────────────────────────────────────┤
│  [ Simpan Lowongan ]                    [ Lamar di Sumber ↗ ]│
└──────────────────────────────────────────────────────────────┘
```

- **Badge Kecocokan:** Pill pojok kanan atas dengan kontras tajam (hijau untuk $\ge 80\%$, oranye untuk $60-79\%$).
- **Badge Sumber:** Tag kecil penanda: `[Internal]` berwarna biru lembut atau `[Jooble ↗]` dengan icon tautan eksternal.
- **Missing Skills Pill:** Badge kecil berwarna merah muda lembut (`bg-rose-50 text-rose-700 border-rose-200`) agar pengguna langsung sadar aspek yang harus ditingkatkan.
- **CTA:** Tombol utama kontras tinggi di pojok kanan bawah.

---

## 5. Tata Letak & Responsivitas (Layout & Spacing)

- **Grid System:** CSS Grid & Flexbox dengan container maksimal lebar `max-w-6xl` (1152px) terpusat di tengah layar desktop.
- **Spasi Konsisten (Spacing Scale):**
  - Spasi antar elemen mikro: `gap-2` (8px), `gap-3` (12px)
  - Padding kartu standar: `p-4` (16px pada mobile), `p-6` (24px pada desktop)
  - Spasi antar section utama: `py-8` hingga `py-12` (32px sampai 48px)
- **Komponen Mobile:**
  - Modal dialog pada mobile beralih fungsi menjadi *Bottom Sheet* / drawer yang bisa digeser dengan mudah menggunakan jempol.
  - Tabel data pelamar pada layar sempit diubah menjadi list kartu (*card stack*) untuk mencegah scrolling horizontal yang merepotkan.

---

## 6. Standar Aksesibilitas (A11y) & Panduan Bahasa

### 6.1 Aksesibilitas
1. **Focus Ring:** Seluruh elemen interaktif (tombol, input, link) memiliki outline fokus keyboard yang jelas (`focus-visible:ring-2 focus-visible:ring-primary-500`).
2. **Screen Reader Support:** Gambar dan icon dekoratif menggunakan `aria-hidden="true"`, sedangkan icon yang memiliki fungsi (seperti tombol hapus) wajib memiliki `aria-label` deskriptif.
3. **Contrast Compliance:** Rasio kontras teks utama terhadap background minimal $4.5 : 1$ untuk ukuran teks standar dan minimal $3 : 1$ untuk teks tebal/besar.

### 6.2 Panduan Bahasa & Copywriting (Tone of Voice)
- **Gunakan Kata Kerja Langsung:** Gunakan *"Unggah CV"* bukan *"Silakan Anda melakukan pengunggahan berkas kurikulum vitae Anda"*.
- **Transparan Mengenai AI:** Informasikan secara terbuka bahwa skor dihasilkan oleh model AI sebagai rekomendasi pembimbing, bukan keputusan final mutlak.
- **Hindari Kata Menghakimi:** Alih-alih menulis *"CV Anda buruk dan tidak terstruktur"*, gunakan *"Struktur CV dapat ditingkatkan: tambahkan metrik hasil pada riwayat pengalaman Anda"*.

