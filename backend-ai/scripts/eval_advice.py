import tempfile
import time
from pathlib import Path

from docx import Document

from app.ingestion.dispatcher import extract
from app.llm.gemini_provider import get_provider
from app.pipeline import build_advice


time.sleep(15) 

SAMPLES = {
    "it": [
        "Nama Contoh Satu",
        "contoh1@example.com | 0812-0000-0001",
        "Ringkasan",
        "Pengembang backend dengan pengalaman membangun REST API menggunakan Python dan FastAPI.",
        "Pengalaman Kerja",
        "• Membangun 5 layanan API untuk sistem pembayaran menggunakan FastAPI dan PostgreSQL",
        "• Menurunkan waktu respons rata-rata sebesar 30% dengan caching Redis",
        "Pendidikan",
        "S1 Informatika, Universitas Contoh",
        "Keterampilan",
        "Python, FastAPI, PostgreSQL, Docker, Redis",
    ],
    "kesehatan": [
        "Nama Contoh Dua",
        "contoh2@example.com | 0812-0000-0002",
        "Ringkasan",
        "Perawat dengan pengalaman di unit gawat darurat selama tiga tahun.",
        "Pengalaman Kerja",
        "• Menangani 20 pasien per shift di unit gawat darurat",
        "• Melatih 4 perawat baru tentang prosedur triase",
        "Pendidikan",
        "D3 Keperawatan, Akademi Contoh",
        "Keterampilan",
        "Triase, pemasangan infus, resusitasi jantung paru",
    ],
    "keuangan": [
        "Nama Contoh Tiga",
        "contoh3@example.com | 0812-0000-0003",
        "Ringkasan",
        "Staf akuntansi dengan pengalaman rekonsiliasi bank dan pelaporan bulanan.",
        "Pengalaman Kerja",
        "• Menyusun laporan keuangan bulanan untuk 3 entitas",
        "• Mengurangi selisih rekonsiliasi bank hingga 50%",
        "Pendidikan",
        "S1 Akuntansi, Universitas Contoh",
        "Keterampilan",
        "Excel tingkat lanjut, SAP, pelaporan pajak",
    ],
    "administrasi": [
        "Nama Contoh Empat",
        "contoh4@example.com | 0812-0000-0004",
        "Ringkasan",
        "Admin kantor dengan pengalaman mengelola arsip dan korespondensi.",
        "Pengalaman Kerja",
        "• Mengelola arsip surat masuk dan keluar untuk 2 divisi",
        "Pendidikan",
        "SMA Contoh",
        "Keterampilan",
        "Microsoft Office, pengetikan 60 kata per menit",
    ],
}


def _make_docx(lines: list[str], path: Path) -> None:
    doc = Document()
    for line in lines:
        doc.add_paragraph(line)
    doc.save(path)


def main() -> None:
    provider = get_provider()
    print(f"provider aktif: {provider.name}\n")

    with tempfile.TemporaryDirectory() as tmp:
        for field, lines in SAMPLES.items():
            path = Path(tmp) / f"{field}.docx"
            _make_docx(lines, path)
            doc = extract(path)
            ats, advice, error = build_advice(doc, provider)

            if advice is None:
                print(f"[{field}] skor={ats.overall_score} | gagal: {error}")
                continue

            with_evidence = sum(1 for s in advice.suggestions if s.evidence)
            print(
                f"[{field}] skor={ats.overall_score} | "
                f"saran={len(advice.suggestions)} | "
                f"dengan evidence={with_evidence} | "
                f"is_mock={advice.is_mock}"
            )
            for s in advice.suggestions:
                print(f"   - ({s.dimension.value}, {s.priority}) {s.text}")
            print()

if __name__ == "__main__":
    main()