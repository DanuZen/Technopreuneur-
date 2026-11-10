# Frontend Web App — CareerMatch AI

> **Lead Pengembang:** Wira Fikri Ramadanu (NIM: 23343023)  
> **Teknologi:** Next.js (App Router, TypeScript), Tailwind CSS, Lucide React

## Ruang Lingkup Tanggung Jawab
1. Desain antarmuka mobile-first responsif berpedoman pada `docs/styleguide.md`.
2. Halaman Autentikasi (Login, Register dengan role selection, Modal persetujuan UU PDP).
3. Komponen Dropzone Drag-and-Drop file CV (.pdf/.docx, maks 5 MB, deteksi teks scan kosong).
4. Visualisasi skor kualitas CV radial (0–100) dan kartu 5 dimensi breakdown nilai.
5. Halaman koreksi manual profil hasil ekstraksi AI sebelum verifikasi.
6. Feed rekomendasi lowongan kerja berurut skor dengan kartu *missing skills* & alasan kecocokan.
7. Alur pelamaran lowongan internal (*Quick Apply*) dan pengalihan ke sumber eksternal (*Jooble*).
8. Dashboard Employer: Pembuatan lowongan dan peninjauan daftar pelamar terurut skor.

## Cara Menjalankan Aplikasi Lokal

1. Masuk ke direktori:
   ```bash
   cd frontend
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi file environment:
   ```bash
   copy .env.example .env.local
   # Sesuaikan NEXT_PUBLIC_API_URL dan NEXT_PUBLIC_AI_URL
   ```

4. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   ```

5. Buka di browser:
   [http://localhost:3000](http://localhost:3000)

