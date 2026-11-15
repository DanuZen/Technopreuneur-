# 📱 PT MBOIS - PT Mbois Learning Hub Mobile Design System & UI Benchmark Standard
**Acuan Resmi Standar Responsif & UI/UX Porting Seluruh Role Portal (Dosen, Admin Prodi, Admin Fakultas, Dekanat)**

Dokumen ini berisi rangkuman analisis lengkap dari seluruh aturan, pola komponen, hierarki tipografi, dan penanganan data yang telah diselaraskan dan disetujui 100% pada **Portal Mahasiswa (11 Halaman)**. Dokumen ini menjadi **standar acuan mutlak** untuk mengimplementasikan tampilan responsif pada Portal Dosen, Admin Prodi, Admin Fakultas, dan Dekanat.

---

## 1. 🛡️ Prinsip Utama: Garansi Desktop 100% Utuh (Zero Interference)

- **Aturan Emas**: Perubahan untuk tampilan smartphone (`<768px` atau `<640px`) **TIDAK BOLEH** merubah tampilan desktop (`≥768px`) sedikit pun.
- **Implementasi**: Selalu gunakan Tailwind Breakpoint Modifiers (`md:`, `lg:`, `sm:`) untuk mengisolasi style khusus mobile:
  - Tampilan khusus mobile: `block md:hidden`
  - Tampilan khusus desktop: `hidden md:block`
  - Sizing responsif: `w-full sm:w-auto`, `flex-1 sm:flex-none`
  - Hiding elemen di mobile: `hidden sm:inline-block` atau `hidden sm:flex`

### 1.1 🎨 Aturan Palet Warna Tema (Strict Red & Gold Theme)
- **HANYA GUNAKAN WARNA TEMA RESMI**: **Merah Utama (`#2563eb` / `#B71C1C`)** dan **Emas/Kuning Akses (`#38bdf8` / `amber-500` / `amber-600`)**.
- **DILARANG MENGGUNAKAN WARNA LAIN** (seperti *Ungu*, *Hijau Emerald*, atau *Biru*) pada ikon box, tombol aksi, maupun aksen statistik di seluruh halaman web aplikasi ini.
- Gunakan aksen Netral Slate/Abu-abu (`bg-slate-100`, `bg-slate-200`, `text-slate-700`) untuk elemen pendukung non-utama.

---

## 2. 🖤 Acuan Standar Welcome Banner (`#1A1A1A`)

Setiap halaman utama di atas memiliki Banner Sambutan gelap dengan latar belakang `#1A1A1A`.

```tsx
<div className="bg-[#1A1A1A] rounded-2xl border border-neutral-800 overflow-hidden shrink-0 shadow-sm">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 relative">
    <div className="space-y-1.5 flex-1 min-w-0">
      {/* 1. Top Pill Badge */}
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#2563eb] text-white shadow-xs font-display">
          <Icon className="w-3.5 h-3.5" /> Label Status / Portal
        </span>
      </div>

      {/* 2. Banner H1 Title (Benchmark Kalender: text-xl md:text-2xl) */}
      <h1 className="text-xl md:text-2xl font-black font-display text-white tracking-wide leading-tight">
        Judul Utama Halaman
      </h1>

      {/* 3. Sub-deskripsi Banner */}
      <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl font-medium">
        Penjelasan ringkas alur kerja halaman ini.
      </p>
    </div>

    {/* 4. Banner Action Buttons (Desktop Only atau Responsif Symmetrical) */}
    <div className="hidden md:flex flex-wrap gap-2.5 shrink-0">
      {/* Action Buttons */}
    </div>
  </div>

  {/* 5. Bottom Accent Line Gradien Merah-Emas */}
  <div className="h-0.5 bg-gradient-to-r from-[#2563eb] via-[#38bdf8] to-[#2563eb]" />
</div>
```

---

## 3. 🎯 Acuan Navigasi & Sub-Tab Switcher Mobile

### A. Sleek Mobile Segmented Control (`<1024px` / `<768px`)
Digunakan untuk halaman yang memiliki beberapa sub-view (misal: *Form vs Usulan*, *Thread vs Syarat*, *Katalog Dosen vs Usulan*).

```tsx
<div className="lg:hidden flex p-1 bg-slate-200/80 rounded-xl shrink-0 gap-1 font-display border border-slate-300/60 shadow-2xs overflow-x-auto scrollbar-none whitespace-nowrap">
  <button
    onClick={() => setActiveTab("tab1")}
    className={`flex-1 min-w-[130px] py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
      activeTab === "tab1"
        ? "bg-white text-[#2563eb] shadow-xs font-extrabold"
        : "text-slate-600 hover:text-slate-900"
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    <span>Label Tab 1</span>
  </button>
</div>
```

### B. Sub-Tab Banner Symmetrical 50/50 Width
Digunakan untuk tombol pilihan sub-tab di dalam banner (seperti `1. Sempro` vs `2. Sidang Skripsi`).

```tsx
<div className="flex items-center gap-2 p-1 bg-neutral-900/90 rounded-xl border border-neutral-800 w-full sm:w-auto">
  <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold text-white bg-[#2563eb] shadow-xs">
    <span>1. Opsi A</span>
  </button>
  <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold text-neutral-400 hover:text-white">
    <span>2. Opsi B</span>
  </button>
</div>
```

---

## 4. 🎴 Ketentuan & Bentuk Card Heading di Setiap Kartu

Setiap kartu putih (`White Card Container`) di dalam area konten harus menggunakan aturan header terstandar:

```tsx
<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
  {/* Card Header Row */}
  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
    {/* Left: Icon Box + Title */}
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-sm text-slate-900 font-display truncate">
          Judul Kartu Utama
        </h3>
        <p className="text-[11px] text-slate-500 font-medium truncate">
          Penjelasan singkat fungsi kartu ini
        </p>
      </div>
    </div>

    {/* Right: Conditional Header Action Button */}
    {listData.length > 0 && (
      <button className="px-3 py-1.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#B71C1C] transition-all flex items-center gap-1.5 shrink-0 shadow-xs">
        <PlusCircle className="w-3.5 h-3.5" />
        <span>Tambah</span>
      </button>
    )}
  </div>

  {/* Card Content Body */}
</div>
```

### 💡 Aturan Khusus Header Card:
1. **Penyembunyian Badge Status di Mobile (`hidden sm:inline-block`)**:
   - Badge status seperti `Belum Ada Jadwal`, `Progress 2/3`, `Terjadwal Resmi` disembunyikan di layar HP (`<640px`) agar judul kartu tidak tertekuk menjadi 2-3 baris yang canggung.
2. **Kondisional Action Button (`+ Tambah`)**:
   - Tombol aksi di header kartu (misal: `<PlusCircle /> Tambah`) **HANYA dirender** jika data list tidak kosong (`{list.length > 0 && (...)}`). Jika list kosong, tombol header disembunyikan agar tidak terjadi duplikasi tombol aksi dengan *empty state* di tengah kartu.

---

## 5. 📊 Penanganan Tabel & Data Grid di HP (Mobile View Strategy)

### Strategi A: Card-Based Touch View (`block md:hidden`) — *Sangat Direkomendasikan*
Digunakan untuk data yang memerlukan interaksi cepat di HP (seperti Katalog Dosen, Log Bimbingan, Jadwal Ujian).

- **Desktop (`hidden md:block`)**: Ditampilkan sebagai tabel lengkap 5-6 kolom.
- **Mobile (`block md:hidden`)**: Ditampilkan dalam bentuk kartu serba lega dengan tombol aksi 1-tap yang mudah ditekan jempol.

### Strategi B: Touch-Scrollable Table (`min-w-[650px] overflow-x-auto`)
Digunakan untuk data tabel padat dengan banyak kolom yang harus tetap utuh (seperti Repositori List Judul Skripsi).

```tsx
<div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto scrollbar-none relative">
  <table className="w-full text-left text-xs min-w-[650px]">
    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider font-display border-b border-slate-200/80 sticky top-0 z-10">
      {/* Headers */}
    </thead>
    <tbody className="divide-y divide-slate-100 text-slate-800">
      {/* Rows */}
    </tbody>
  </table>
</div>
```

### Strategi C: Centered Empty State di HP
Apabila data kosong, tampilan *empty state* dibuat sticky dan center sempurna secara vertikal dan horizontal (`py-12 px-4 flex flex-col items-center justify-center text-center`).

---

## 6. 🔒 Standar Pop-Up, Modal, & Profile Drawer

1. **Mobile Touch Scroll Lock (Penguncian Scroll Belakang 100%)**:
   - Mengunci `overflow = "hidden"` dan `touchAction = "none"` pada `document.body`, `document.documentElement`, dan **semua container scroll utama** (`main`, `.shell-body`, `.viewport-shell`) saat modal aktif.
2. **Tab Modal Ringkas 1 Baris**:
   - Menggunakan label ringkas di mobile: `Profil`, `Timeline (0/5)`, `Kata Sandi`.
   - Menggunakan `flex-1 justify-center` agar ketiga tab terbagi 1/3 rata dan berada tepat di tengah.
3. **Kartu Profil Sidebar 1-Tap Clickable**:
   - Seluruh area kartu profil di sidebar (Avatar `DZ`, Nama, NIM) dapat diklik langsung untuk membuka modal profil.
   - Menggunakan ikon panah bersih `<ChevronRight className="w-5 h-5 text-neutral-400" />` tanpa background box.

---

## 🏁 Ringkasan Checkpoint Portal Mahasiswa (11/11 Halaman - Complete ✅)

- [x] `/mahasiswa/dashboard` — ✅ Benchmark Banner & Badge Responsif
- [x] `/mahasiswa/proposal` — ✅ Sleek Mobile Segmented Control Tab Switcher
- [x] `/mahasiswa/pembimbing` — ✅ Card View Dosen di Mobile + Table di Desktop
- [x] `/mahasiswa/bimbingan` — ✅ Conditional `+ Tambah` Header & Status Badge Hiding
- [x] `/mahasiswa/seminar` — ✅ Clean Header Badge & Status Badge Hiding
- [x] `/mahasiswa/sidang` — ✅ Symmetrical 50/50 Banner Sub-Tab Buttons
- [x] `/mahasiswa/list-judul` — ✅ Touch-Scrollable Table & Sticky Centered Empty State
- [x] `/mahasiswa/kalender` — ✅ Abbreviated `Min-Sab` Header, Interactive Selected Day Panel, Acuan H1 Title Benchmark (`text-xl md:text-2xl`)
- [x] `/mahasiswa/profil` — ✅ Responsive Profile Modal with 100% Shell Scroll Lock
- [x] `/mahasiswa/akun` — ✅ Responsive Profile Modal with 100% Shell Scroll Lock
- [x] `/login` — ✅ Responsive Portal Selector & Glassmorphism Card
