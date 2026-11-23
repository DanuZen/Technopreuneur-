# CareerMatch AI — Layanan AI

Layanan AI untuk CareerMatch AI. Hanya dipanggil oleh backend API, tidak pernah langsung dari browser.

## Fitur

- Ekstraksi teks CV (PDF berbasis teks dan DOCX), termasuk deteksi scan dan dua kolom
- Penilaian ATS 0–100 dengan lima dimensi, deterministik
- Sanitasi data demografis sebelum dikirim ke LLM
- Saran perbaikan CV dari Gemini, dengan filter kutipan
- Embedding CV 1536 dimensi, dinormalisasi
- Pencocokan CV dengan lowongan secara lokal, dengan alasan yang dikutip dari CV
- Normalizer lowongan (tanpa pemanggilan API sumber)

Dokumentasi kontrak: [`docs/handover.md`](docs/handover.md) dan [`docs/contract/examples/`](docs/contract/examples/).

## Prasyarat

- Python 3.12
- Key Gemini (untuk saran dan embedding)
- Token internal (`INTERNAL_TOKEN`), diberikan lewat kanal aman

## Instalasi

```bash
python -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Konfigurasi

Buat berkas `.env` di root proyek dari `.env.example`:

```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash-lite
INTERNAL_TOKEN=
LLM_ALLOW_MOCK=false
```

Jangan commit `.env`. Berkas ini sudah diabaikan oleh `.gitignore`.

Buat token acak untuk pengembangan lokal:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Menjalankan

```bash
uvicorn app.main:app --reload --port 8000
```

Dokumentasi interaktif: http://127.0.0.1:8000/docs

Cek hidup (publik, tanpa token):

```bash
curl http://127.0.0.1:8000/health
```

## Endpoint internal

Semua endpoint di bawah `/internal/v1/` wajib header `X-Internal-Token`.

| Endpoint | Fungsi | Kuota Gemini |
|---|---|---|
| `POST /internal/v1/cv/analyze` | ATS, saran, embedding, teks tersanitasi | Ya |
| `POST /internal/v1/match/stage2` | Skor kecocokan dan alasan | Tidak |
| `POST /internal/v1/cv/ats-check` | Hanya ATS (pengujian) | Tidak |
| `POST /internal/v1/cv/advice` | ATS dan saran (pengujian) | Ya |

Contoh:

```bash
curl -s -X POST http://127.0.0.1:8000/internal/v1/match/stage2 \
  -H "X-Internal-Token: $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d @docs/contract/examples/stage2_request.json
```

Untuk detail request, respons, dan kode error, lihat `docs/handover.md`.

## Tes

```bash
pytest -v
```

Semua tes berjalan tanpa memanggil Gemini. Tes yang menyentuh provider memakai pengganti.

## Struktur

```
app/
├── api/          # route HTTP dan autentikasi token
├── contract/     # skema respons dan verifikasi kutipan
├── embedding/    # embedding Gemini, dinormalisasi
├── ingestion/    # ekstraksi PDF dan DOCX
├── jobs/         # normalizer lowongan
├── llm/          # provider Gemini, fallback, mock
├── matching/     # kamus skill, skor, alasan
├── resources/    # skills.yaml dan skill_labels.yaml
├── ats/          # penilaian ATS
├── advice/       # saran dan prompt
└── sanitization/ # sanitasi demografis
docs/
├── handover.md
└── contract/examples/
tests/
```

## Batasan yang diketahui

- Skor pencocokan bergantung pada kamus skill. Skill yang tidak ada di `skills.yaml` tidak terdeteksi.
- PDF scan ditolak. Text box di DOCX belum terbaca.
- Sanitasi hanya menghapus baris berlabel, misalnya "Tanggal Lahir: ...". Kalimat bebas belum disaring.
- `sanitized_text` masih memuat nama, email, dan telepon. Jangan disimpan atau dicatat di log.
- Sumber lowongan belum ditentukan. Data lowongan dikirim oleh backend API.
