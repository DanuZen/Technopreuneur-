# Serah Terima Layanan AI (CareerMatch AI)

Dokumen ini untuk backend API. Layanan AI hanya dipanggil oleh backend API, tidak pernah langsung dari browser.

## 1. Ringkasan

| Endpoint | Metode | Fungsi | Kuota Gemini |
|---|---|---|---|
| `/health` | GET | Cek layanan hidup (publik) | Tidak |
| `/internal/v1/cv/analyze` | POST | Skor ATS, saran, embedding CV, teks tersanitasi | Ya (1 generasi + 1 embedding) |
| `/internal/v1/match/stage2` | POST | Skor kecocokan CV dengan lowongan, alasan, missing skills | Tidak (lokal) |
| `/internal/v1/cv/ats-check` | POST | Hanya skor ATS (untuk pengujian) | Tidak |
| `/internal/v1/cv/advice` | POST | Skor ATS + saran (untuk pengujian) | Ya |

Gunakan `analyze` dan `stage2` untuk integrasi. `ats-check` dan `advice` hanya untuk pengujian.

## 2. Autentikasi

Semua endpoint `/internal/v1/...` wajib header:

```
X-Internal-Token: <token dari tim AI>
```

- Token diberikan lewat kanal aman, bukan chat umum atau repository.
- Jangan simpan token di URL, log, atau kode yang di-commit.
- Jika token bocor, beri tahu tim AI dan ganti token.

Respons tanpa token atau dengan token salah: `401 {"detail":"unauthorized"}`.

## 3. Endpoint `analyze`

Request (multipart):
- `file` (wajib): PDF atau DOCX, maksimal 5 MB
- `jd_keywords` (opsional): kata kunci dipisah koma

Respons 200: lihat `docs/contract/examples/analyze_response.json`.

Field utama:
- `ats`: hasil penilaian ATS (skor, dimensi, issue, flags)
- `advice`: saran perbaikan, atau `null`
- `advice_status`: `ok`, `quota_exhausted`, atau `unavailable`
- `advice_message`: pesan untuk ditampilkan jika saran tidak tersedia
- `cv_embedding`: vektor 1536 dimensi (wajib tepat 1536)
- `sanitized_text`: teks CV yang sudah disanitasi

Aturan penting:
- Saran gagal (kuota habis, layanan sibuk) **tidak** membuat HTTP error. Hasil ATS tetap dikembalikan dengan `advice_status` yang sesuai.
- Jika embedding gagal, respons `503`. Tanpa embedding, tahap 1 tidak bisa dijalankan.
- `sanitized_text` hanya untuk dipakai di permintaan yang sama (misalnya dikirim ke `stage2`). **Jangan disimpan dan jangan dicatat di log.** Teks ini masih memuat nama, email, dan telepon.

## 4. Endpoint `stage2`

Request (JSON):

```json
{
  "sanitized_text": "teks CV dari analyze",
  "candidates": [
    {"job_id": "42", "title": "...", "description": "...", "skills": ["..."]}
  ]
}
```

Batas: maksimal 5 kandidat, `sanitized_text` maksimal 30.000 karakter, `description` maksimal 20.000 karakter.

Respons 200: lihat `docs/contract/examples/stage2_response.json`.

Field per hasil:
- `job_id`: sama dengan input
- `match_score`: 0 sampai 100, hanya dari skill yang tertulis di CV
- `verdict`: `sangat_cocok` (≥85), `cocok` (≥70), `cukup` (≥55), `kurang_cocok`
- `reasons`: alasan dengan `evidence` berupa kutipan yang ada di CV
- `missing_skills`: skill lowongan yang tidak ada di CV
- `verified`: `true` jika setiap skill yang cocok punya kutipan

Lowongan tanpa skill yang dikenali mendapat `match_score: 0`, `verdict: kurang_cocok`, dan `reasons` kosong. Tampilkan sebagai "data lowongan kurang", bukan "tidak cocok".

## 5. Kode error

Layanan AI mengembalikan format FastAPI `{"detail": "..."}`. Backend API perlu memetakannya ke format publik.

| HTTP | Arti | Tindakan backend API |
|---|---|---|
| 400 | File kosong | Tampilkan pesan "file kosong" |
| 401 | Token salah atau tidak ada | Periksa konfigurasi token, jangan tampilkan ke pengguna |
| 413 | File lebih dari 5 MB | Tampilkan batas ukuran |
| 415 | Format tidak didukung | Tampilkan "gunakan PDF atau DOCX" |
| 422 | File rusak, atau data request tidak valid | Tampilkan "file tidak bisa dibaca" |
| 503 | Token belum dikonfigurasi, atau embedding gagal | Coba lagi nanti |

Kuota saran habis bukan HTTP error. Cek `advice_status == "quota_exhausted"`.

## 6. Batasan yang perlu diketahui

- Skor pencocokan bergantung pada kamus skill (`app/resources/skills.yaml`). Skill yang tidak ada di kamus tidak pernah terdeteksi.
- Hanya PDF berbasis teks dan DOCX yang didukung. PDF scan ditolak dengan `scan_detected`.
- Teks di dalam text box DOCX belum terbaca.
- Sanitasi hanya menghapus baris berlabel (misalnya "Tanggal Lahir: ..."). Kalimat bebas tidak disaring.
- Layanan AI tidak menyimpan CV. Penyimpanan adalah tanggung jawab backend API.
- Sumber lowongan belum ditentukan. Data lowongan untuk `stage2` dikirim oleh backend API.

## 7. Menjalankan lokal (untuk pengujian)

```bash
uvicorn app.main:app --reload --port 8000
curl -s http://127.0.0.1:8000/health
```

Gunakan `INTERNAL_TOKEN` dari kanal aman:

```bash
export INTERNAL_TOKEN="<token>"
curl -s -X POST http://127.0.0.1:8000/internal/v1/match/stage2 \
  -H "X-Internal-Token: $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d @docs/contract/examples/stage2_request.json | jq
```

Endpoint `stage2` tidak memakai kuota, jadi aman dipakai berulang. Endpoint `analyze` dan `advice` memakai kuota Gemini, jadi jangan dipanggil berulang saat pengujian.

## 8. Berkas acuan

- `docs/contract/examples/stage2_request.json` dan `stage2_response.json`
- `docs/contract/examples/analyze_response.json`
- `app/contract/schemas.py`: sumber kebenaran bentuk respons
- `tests/test_contract.py`: tes yang memastikan respons sesuai contoh

## 9. Status

| Bagian | Status |
|---|---|
| Analisis CV (ATS, saran, embedding, sanitasi) | Berjalan |
| Pencocokan lokal (`stage2`) | Berjalan |
| Sumber lowongan | Belum diputuskan |
| Tabel `jobs` dan pgvector | Menunggu skema dan dimensi |
| Integrasi dan billing Gemini | Menunggu keputusan tim |