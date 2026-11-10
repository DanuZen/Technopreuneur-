# Backend AI — CareerMatch AI

> **Lead Pengembang:** Florensius Panca Gati (NIM: 23343006)  
> **Teknologi:** Python 3.11+, FastAPI, Pydantic, pypdf, python-docx, pgvector, LangChain / LLM SDK

## Ruang Lingkup Tanggung Jawab
1. Ekstraksi teks dokumen CV (`.pdf` dan `.docx`) dengan deteksi scan kosong.
2. Sanitasi teks dokumen (menghapus atribut demografis sensitif sebelum prompt LLM).
3. Ekstraksi profil terstruktur & penilaian CV (skor 0–100, 5 dimensi breakdown, saran perbaikan).
4. Pembuatan vektor embedding teks deskripsi lowongan dan profil CV (1536-dimensi).
5. Mesin Pencocokan Dua Tahap (*Two-Stage Matching*):
   - Tahap 1: Pencarian kemiripan kosinus kueri pgvector (`<=>`) mengambil Top 20–50 lowongan.
   - Tahap 2: Evaluasi kontekstual LLM untuk menentukan skor kecocokan, alasan, dan *missing skills*.
6. Integrasi penarikan lowongan eksternal via Jooble API.

## Cara Menjalankan Layanan Lokal

1. Masuk ke direktori:
   ```bash
   cd backend-ai
   ```

2. Buat dan aktifkan virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependensi:
   ```bash
   pip install -r requirements.txt
   ```

4. Konfigurasi file environment:
   ```bash
   copy .env.example .env
   # Isi OPENAI_API_KEY / GEMINI_API_KEY
   ```

5. Jalankan server FastAPI:
   ```bash
   python main.py
   # atau via uvicorn:
   uvicorn main:app --reload --port 8001
   ```

6. Akses dokumentasi interaktif Swagger UI di:
   [http://localhost:8001/docs](http://localhost:8001/docs)

