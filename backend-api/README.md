# Backend API — CareerMatch AI

> **Lead Pengembang:** Muhammad Gilang Ramadhan (NIM: 23346013)  
> **Teknologi:** Node.js, Express, TypeScript, PostgreSQL (pgvector), JWT, Helmet

## Ruang Lingkup Tanggung Jawab
1. Perancangan dan migrasi 10 tabel database sesuai `docs/workflow.md`.
2. Setup ekstensi `pgvector` dan indexing (B-Tree & HNSW vektor).
3. Autentikasi pengguna (Email/Password + bcrypt, JWT token, role-based middleware: `jobseeker`, `employer`, `admin`).
4. Endpoint pencatatan persetujuan UU PDP (*Consent API*).
5. Generator Pre-signed URL aman (15 menit) untuk upload berkas CV ke object storage.
6. CRUD Lowongan pekerjaan untuk employer dan filter kueri pencarian kerja.
7. Pengajuan lamaran internal (*Quick Apply*) dan pembaruan status pelamar.
8. Hak penghapusan data permanen (*Right to be Forgotten*) untuk kepatuhan UU PDP.

## Cara Menjalankan Layanan Lokal

1. Masuk ke direktori:
   ```bash
   cd backend-api
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi environment:
   ```bash
   copy .env.example .env
   # Sesuaikan DATABASE_URL dan JWT_SECRET
   ```

4. Jalankan mode pengembangan:
   ```bash
   npm run dev
   ```

5. Server berjalan di:
   [http://localhost:5000](http://localhost:5000)

