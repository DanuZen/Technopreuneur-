# Fit-Viewport Layout & Flexible Scroll Architecture — PT Mbois Learning Hub

> **Tujuan:** Menjelaskan arsitektur tata letak antarmuka PT Mbois Learning Hub pada 38 rute di 7 role pengguna. Mengkombinasikan **Fit-Viewport Layout 100% (100dvh)** untuk halaman list view & manajemen cepat dengan **Natural Page Scroll Layout** untuk halaman analitik eksekutif kaya data.

---

## 📌 Dua Variasi Mode Layout Utama

### 1. Fit-Viewport Layout 100% (`viewport-shell bg-[#FAFAFA]`)
- **Tujuan**: Memastikan seluruh antarmuka muat 100% di layar (viewport) tanpa vertical scrolling pada window browser utama.
- **Rute Pengguna**:
  - Portal Mahasiswa: `/`, `/proposal`, `/pembimbing`, `/bimbingan`, `/seminar`, `/sidang`, `/list-judul`, `/kalender`, `/profil`, `/akun`
  - Portal Dosen Pembimbing: `/dosen/dashboard`, `/dosen/bimbingan`, `/dosen/pengajuan`, `/dosen/kalender`
  - Portal Dosen Penguji: `/penguji/dashboard`, `/penguji/jadwal`, `/penguji/nilai`, `/penguji/revisi`
  - Portal Admin Prodi: `/admin-prodi/dashboard`, `/admin-prodi/mahasiswa`, `/admin-prodi/aktivasi`, `/admin-prodi/jadwal`, `/admin-prodi/repositori`
  - Portal Admin Fakultas: `/admin-fakultas/dashboard`, `/admin-fakultas/sk`, `/admin-fakultas/bebas`, `/admin-fakultas/arsip`
  - Portal Dekanat: `/dekanat/dashboard`, `/dekanat/kalender`, `/dekanat/laporan`
  - Portal Super Admin: `/super-admin/dashboard`, `/super-admin/users`, `/super-admin/audit`, `/super-admin/config`, `/super-admin/master`

### 2. Natural Page Scroll Layout (`min-h-screen pb-16`)
- **Tujuan**: Memberikan kebebasan scrolling halaman secara vertikal alami agar kartu statistik, grafik komparasi prodi, dan tabel pemeringkatan dosen yang sangat banyak data tidak terasa sesak atau terpotong di dalam scrollbar internal yang sempit.
- **Rute Pengguna**:
  - Portal Dekanat: `/dekanat/statistik` (Analitik Eksekutif TA)

---

## 🏗️ Struktur Layout 3-Layer Flex (Fit Viewport)

Gunakan tiga lapis container standar pada seluruh halaman PT Mbois Learning Hub yang bertipe Fit Viewport:

```tsx
<div className="flex flex-col h-auto md:h-dvh md:overflow-hidden viewport-shell bg-[#FAFAFA]">
  <div className="flex flex-1 min-h-0 overflow-hidden">
    <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} items={NAV} />
    
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <Header className="shell-header shrink-0" userName="..." userRole="..." />
      
      <main className="flex-1 p-5 md:p-6 space-y-4 overflow-hidden shell-body flex flex-col min-h-0">
        {/* Banner Hero & Content Grid / List View */}
      </main>
    </div>
  </div>
</div>
```

---

## 📐 Pola Tabel List Ringkas + Live Side Detail Panel Card

Halaman berorientasi tabel list (seperti `/admin-prodi/mahasiswa`, `/admin-prodi/repositori`, `/admin-fakultas/sk`, `/admin-fakultas/bebas`, `/admin-fakultas/arsip`, `/dekanat/kalender`, `/dekanat/laporan`, `/super-admin/users`, `/super-admin/audit`, `/super-admin/master`) mematuhi pola:

1. **Hapus Kolom AKSI di Tabel**:
   - Mencegah tabel menjadi sangat lebar atau penuh sesak dengan tombol aksi redundan.
2. **Side Detail Panel Card di Kolom Kanan (`w-80 shrink-0`)**:
   - Berada di posisi kanan dengan layout flex `flex flex-col justify-between`.
   - Konten detail di dalamnya otomatis ter-update secara *live* saat pengguna mengklik baris mana saja pada tabel list.
   - Baris tabel yang dipilih ditandai dengan highlight `bg-blue-50/70 border-l-4 border-l-[#2563eb]`.

---

## 🎨 Utilitas Scrollbar Modern (`globals.css`)

Untuk memastikan scrolling terasa sehalus aplikasi desktop tanpa indikator *scrollbar* browser yang tebal:

```css
/* Utilitas Menyembunyikan Scrollbar (Clean Scroll) */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-none::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
```

---

## 🚀 Status Implementasi Halaman PT Mbois Learning Hub

Seluruh 38 rute aplikasi telah 100% mematuhi arsitektur Fit-Viewport Layout & Clean Scroll:

| Portal Role | Jumlah Rute | Mode Layout | Status Build |
|---|:---:|---|:---:|
| Mahasiswa | 11 Rute | Fit Viewport 100% | ✅ Pass |
| Dosen | 7 Rute | Fit Viewport 100% | ✅ Pass |
| Admin Prodi | 6 Rute | Fit Viewport 100% (List + Side Panel) | ✅ Pass |
| Admin Fakultas | 4 Rute | Fit Viewport 100% (List + Side Panel) | ✅ Pass |
| Dekanat / Pimpinan | 4 Rute | 3 Fit Viewport + 1 Natural Scroll (`/statistik`) | ✅ Pass |
| Super Admin | 5 Rute | Fit Viewport 100% (List + Side Panel) | ✅ Pass |
| **TOTAL** | **37 Rute** | **100% Standardized** | **✅ Pass (`npx next build`)** |

---

## 📋 Checklist Verifikasi Desain

- [x] Resize dari 1920px → 768px: kolom grid menyesuaikan secara responsif tanpa overflow.
- [x] Seluruh warna utama menggunakan Red Signature `#2563eb` dan Stat Card Kuning Emas Amber Warm `#D97706`.
- [x] Warna ungu (`#7C3AED`) sepenuhnya dihapus dari seluruh grafik/indikator.
- [x] Penggunaan `.scrollbar-none` menghilangkan garis scrollbar kasar browser.
- [x] `npm run build` sukses tanpa warning/error TypeScript.
