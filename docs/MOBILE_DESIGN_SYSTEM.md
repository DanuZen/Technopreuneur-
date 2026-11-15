# 📱 PT MBOIS - PT Mbois Learning Hub Mobile Design System & UI Consistency Standard

Dokumentasi ini dibuat sebagai standar desain antarmuka mobile (**Mobile Responsive Design System**) untuk seluruh rute dan role di aplikasi **PT MBOIS - PT Mbois Learning Hub (Sistem Informasi Manajemen Perjalanan & Evaluasi Tugas Akhir PT MBOIS)**.

Standar ini dirumuskan berdasarkan audit mendalam, preferensi pengguna, dan penyempurnaan UI pada 2 Portal Utama yang telah diselesaikan:
1. **Portal Mahasiswa** (7 Halaman)
2. **Portal Dosen Terpadu & Penguji** (7 Halaman)

---

## 🎨 1. Core Brand & Design Tokens

### Color Palette (Red & Gold Theme)
- **Primary Red (PT MBOIS - PT Mbois Learning Hub Red)**: `#2563eb` (Gunakan `bg-[#2563eb]`, `text-[#2563eb]`, `border-[#2563eb]`)
- **Secondary Gold/Yellow**: `#38bdf8` (Gunakan `bg-[#38bdf8] text-slate-950 font-black` untuk badge bidang/revisi)
- **Dark Banner Background**: `#1A1A1A` / `bg-neutral-900`
- **Neutral Surface**: `bg-[#F5F5F7]` (Background halaman), `bg-white` (Kartu utama), `bg-slate-50` (Section container)
- **Neutral Border**: `border-slate-200/80` (Standard), `border-slate-300` (Hover/Active)

### Status Badges (Solid Vibrant Colors Only)
- **ACC / Approved / Lulus**: `bg-emerald-600 text-white font-black shadow-2xs`
- **Seminar / Sidang / Important**: `bg-[#2563eb] text-white font-black` atau `bg-blue-600 text-white`
- **Status Pending / Warning**: `bg-[#38bdf8] text-slate-950 font-black`

---

## 📐 2. Komponen UI Standard Per Pola Tampilan

### A. Welcome Banner Command Center
- **Aturan Judul Banner**:
  - Halaman **Dashboard Utama** (`/dashboard`): Gunakan judul **`Selamat Datang`** (tanpa nama pengguna).
  - Halaman **Fitur / Inner Sub-pages** (`/mahasiswa`, `/bimbingan`, `/jadwal`, dll): Gunakan **Judul Deskriptif Halaman** (contoh: `Manajemen Data Mahasiswa`, `Jadwal Pengujian`, `Bimbingan Tugas Akhir`).
- **Sub-judul**: Maksimal 2 baris ringkas yang menjelaskan fungsi halaman.
- **Visual Accent**: Di bagian bawah banner terdapat garis aksen gradasi `h-0.5 bg-gradient-to-r from-[#2563eb] via-[#38bdf8] to-[#2563eb]`.

```tsx
<div className="bg-[#1A1A1A] rounded-2xl border border-neutral-800 overflow-hidden shadow-sm shrink-0">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 md:p-6 relative">
    <div className="space-y-1.5 flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#2563eb] text-white shadow-xs font-display">
          <BadgeIcon className="w-3.5 h-3.5 text-white" /> Label Portal
        </span>
      </div>
      <h1 className="text-xl md:text-2xl font-black font-display text-white tracking-wide leading-tight">
        Selamat Datang
      </h1>
      <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl font-medium">
        Deskripsi ringkas aktivitas utama portal hari ini.
      </p>
    </div>
  </div>
  <div className="h-0.5 bg-gradient-to-r from-[#2563eb] via-[#38bdf8] to-[#2563eb]" />
</div>
```

---

### B. Executive Stat Cards (2-Column Grid di Mobile)
- **Grid Ratio**: 2 Kolom di Mobile, 4 Kolom di Desktop (`grid grid-cols-2 lg:grid-cols-4 gap-3`).
- **Teks Label Stat**: Harus ringkas dan **KAPITAL SHORTHAND** (contoh: `BIMBINGAN`, `PERMOHONAN`, `JADWAL UJIAN`, `REVISI`, `MAHASISWA TA`, `AKTIVASI PENDING`).

```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
  {STATS.map((s) => (
    <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex items-center justify-between space-x-3">
      <div className="space-y-1 min-w-0">
        <p className="text-[11px] font-bold text-slate-500 font-display leading-tight">{s.label}</p>
        <p className="text-2xl sm:text-3xl font-black font-display" style={{ color: s.color }}>{s.value}</p>
        <p className="text-[10px] text-slate-400 font-semibold truncate">{s.sub}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl ${s.bgIcon} text-white flex items-center justify-center shrink-0 shadow-xs`}>
        <s.icon className="w-5 h-5 text-white" />
      </div>
    </div>
  ))}
</div>
```

---

### C. Dropdown Filter Bar Sejajar (Single-Row Filter & Search)
- **Single-Row Constraint**: Search box dan Dropdown Filter harus duduk **sejajar 1 baris mendatar** (`flex items-center justify-between gap-2.5`).
- **Spesifikasi Tombol Dropdown Filter**:
  - Memiliki lebar minimum **`min-w-[125px]`** dengan padding longgar **`px-4 py-2`**.
  - Menggunakan `justify-between` agar ikon filter di kiri dan panah `ChevronDown` di kanan.

```tsx
<div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2.5 shrink-0">
  {/* Search Bar */}
  <div className="relative flex-1 min-w-0">
    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
    <input
      type="text"
      placeholder="Cari nama / NIM..."
      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all font-medium"
    />
  </div>

  {/* Custom Dropdown Filter */}
  <div className="relative shrink-0 font-display">
    <button
      onClick={() => setIsFilterOpen(!isFilterOpen)}
      className="flex items-center justify-between gap-2.5 px-4 py-2 min-w-[125px] rounded-xl border border-slate-200 text-xs bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition-all cursor-pointer whitespace-nowrap font-display shadow-2xs"
    >
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-[#2563eb]" />
        <span>{selectedFilter}</span>
      </div>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
    </button>

    {isFilterOpen && (
      <>
        <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 min-w-[140px] space-y-0.5 font-display animate-in fade-in zoom-in-95 duration-150">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => { setSelectedFilter(f); setIsFilterOpen(false); }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                selectedFilter === f ? "bg-[#2563eb] text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{f}</span>
              {selectedFilter === f && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
  {/* Responsive Action Button (Icon-only on Mobile, Icon+Text on Desktop) */}
  <button
    onClick={handleAction}
    title="Input Data Baru"
    className="px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-[#2563eb] text-white hover:bg-[#B71C1C] transition-all cursor-pointer font-display shadow-xs shrink-0 active:scale-95 flex items-center justify-center gap-1.5"
  >
    <Plus className="w-4 h-4 text-white shrink-0" />
    <span>Tambah</span>
  </button>
</div>
```

---

### D. Kartu Daftar Mahasiswa & Aturan Selected State
- **Aturan Tanpa Outline Merah**: Dilarang menggunakan border merah (`border-[#2563eb]`) atau latar kemerahan (`bg-rose-50`) pada kartu yang aktif/diklik.
- **Gaya Seragam (Uniform Clean Cards)**:
  - Kartu Standar: `className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/60 hover:border-slate-300 transition-all cursor-pointer space-y-2"`
  - Kartu Aktif/Pilihan (jika diperlukan): `className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 shadow-2xs transition-all cursor-pointer space-y-2"`

---

### E. Header Card Detail & Navigasi Mobile 1-Tap `← Kembali`
- **Aturan Mobile Header**:
  - Pada HP (<1024px), sisi kiri header berisi tombol **`← Kembali`** (`lg:hidden`).
  - Judul & Sub-judul kartu disembunyikan di HP (`hidden lg:flex`) agar header tidak tertekan atau terlipat menjadi 4 baris.
  - Sisi kanan header selalu berisi Badge NIM / Status (`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700`).

---

### F. Ukuran Panel Samping Desktop (*Desktop Side Panel Width*)
- **Aturan Lebar Tetap (Fixed Width Standard)**:
  - Panel Samping / Detail (`Side Detail Panel`) di tampilan Desktop MUST berukuran **tetap terkunci (`w-full lg:w-[350px] lg:min-w-[350px] lg:max-w-[350px] shrink-0`)**, sehingga tidak akan pernah melar/berubah lebar saat mengklik baris data dengan judul/nama yang sangat panjang.
  - Elemen teks di dalam panel samping harus dilengkapi `break-words` dan pembungkus `min-w-0` agar tidak mendorong batas kontainer.
  - Kartu Utama / Tabel di sebelah kiri berukuran **fleksibel penuh (`flex-1 min-w-0`)**, mengambil sisa ruang yang ada di layar desktop.

```tsx
<div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 gap-2">
  {/* Mobile Back Button (ONLY on Mobile <1024px) */}
  <button
    onClick={() => setActiveMobileTab("list")}
    className="lg:hidden p-1.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-bold font-display shadow-2xs active:scale-95"
  >
    <ArrowLeft className="w-3.5 h-3.5 text-[#2563eb]" />
    <span>Kembali</span>
  </button>

  {/* Desktop Title & Icon (Hidden on Mobile <1024px) */}
  <div className="hidden lg:flex items-center gap-2.5 min-w-0">
    <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-xs">
      <FileText className="w-4 h-4 text-white" />
    </div>
    <div className="min-w-0">
      <h2 className="font-bold text-sm text-slate-900 font-display">Detail Kartu</h2>
      <p className="text-[10px] text-slate-400 font-medium">Sub-deskripsi kartu detail</p>
    </div>
  </div>

  {/* Badge (Always on Right) */}
  {selectedItem && (
    <span className="text-[10px] sm:text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700 shrink-0">
      {selectedItem.nim}
    </span>
  )}
</div>
```

---

### F. Tombol Keputusan / Aksi (Equal-Width Grid 50%-50%)
- **Teks Tombol Aksi Persingkat**:
  - Tombol Hijau ACC: Gunakan teks **`ACC`** (`<CheckCircle2 className="w-4 h-4 shrink-0 text-white" /> <span>ACC</span>`).
  - Tombol Putih/Merah: Gunakan teks **`Perbaiki`** atau **`Tolak`** (`<X className="w-4 h-4 shrink-0 text-slate-400" /> <span>Tolak</span>`).
- **Tata Letak Grid**: Menggunakan `grid grid-cols-2 gap-2.5` agar berukuran persis sama (50%-50%) dan tidak pernah terpotong/terlipat 2 baris.

```tsx
<div className="grid grid-cols-2 gap-2.5">
  <button
    onClick={handleAcc}
    className="py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5 font-display active:scale-95 shadow-xs whitespace-nowrap"
  >
    <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
    <span>ACC</span>
  </button>

  <button
    onClick={handleReject}
    className="py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-[#2563eb] hover:border-rose-200 transition-all flex items-center justify-center gap-1.5 font-display active:scale-95 shadow-2xs cursor-pointer whitespace-nowrap"
  >
    <X className="w-4 h-4 shrink-0 text-slate-400" />
    <span>Tolak</span>
  </button>
</div>
```

---

### G. Kotak Dokumen PDF / Berkas & Field Catatan
- **Pencegahan Text Overflow**: Kontainer teks nama berkas harus memiliki `min-w-0 flex-1` dan paragraph menggunakan `truncate`.
- **Field Catatan Revisi**:
  - Judul Bagian: **`CATATAN REVISI`** (ringkas, uppercase tracking-widest).
  - Field: Single-line `<input type="text" placeholder="Catatan revisi tambahan..." />` atau compact textarea `rows={2}`.

```tsx
{/* Document File Box */}
<div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
  <div className="flex items-center gap-3 min-w-0 flex-1">
    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
      <FileText className="w-5 h-5 text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold text-slate-900 font-display truncate">{fileName}</p>
      <p className="text-[10.5px] text-blue-700 font-medium truncate">{fileDate}</p>
    </div>
  </div>

  <button className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer font-display shrink-0">
    <Eye className="w-3.5 h-3.5 text-white shrink-0" />
    <span className="whitespace-nowrap">Pratinjau PDF</span>
  </button>
</div>
```

---

### H. Tabel Data Swipeable (Horizontal Scrollable Table)
- **Swipeable Standard**: Tabel yang memiliki banyak kolom harus diberi `min-w-[750px]` (atau `min-w-[650px]`) dan dibungkus dalam container `<div className="flex-1 overflow-x-auto scrollbar-none">`.

```tsx
<div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-none flex flex-col">
  <table className="w-full text-left text-xs border-collapse min-w-[750px]">
    <thead>
      <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] font-display tracking-wider">
        <th className="px-5 py-3">Kolom 1</th>
        <th className="px-5 py-3">Kolom 2</th>
        <th className="px-5 py-3">Kolom 3</th>
        <th className="px-5 py-3">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {/* Table rows */}
    </tbody>
  </table>
</div>
```

---

## 🛡️ 3. Prinsip Utama Garansi Desktop (Desktop Preservation Rule)

Semua modifikasi responsif mobile **WAJIB 100% MENGGUNAKAN BREAKPOINT CONDITIONAL TAILWIND**:
1. Gunakan `lg:hidden` untuk elemen navigasi 1-tap HP / tombol `← Kembali`.
2. Gunakan `hidden lg:flex` / `hidden lg:inline-flex` untuk elemen header desktop & layout 2-kolom.
3. Struktur layout desktop `grid grid-cols-1 lg:grid-cols-12` harus tetap tampil utuh & berdampingan di layar ≥1024px.
4. Setiap pengodean wajib diuji dengan `npx tsc --noEmit` dan `npx next build` sebelum commit.

---

## 📋 4. Checklist Penerapan untuk Role Sisanya

Dokumentasi ini akan digunakan sebagai acuan baku saat pengerjaan rute-rute berikutnya:
- [ ] **Portal Admin Prodi** (6 Halaman)
- [ ] **Portal Admin Fakultas** (4 Halaman)
- [ ] **Portal Dekanat** (4 Halaman)
- [ ] **Portal Super Admin** (5 Halaman)
