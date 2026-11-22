"""Buat CV palsu untuk pengujian. Semua data fiktif, output tidak di-commit."""
from pathlib import Path

from docx import Document
from PIL import Image
from reportlab.pdfgen import canvas

OUT = Path("tests/cv_samples")

NAMA = "Nama Contoh Pelamar"
KONTAK = "contoh.pelamar@example.com | 0812-0000-0000 | Kota Contoh"
RINGKASAN = "Pengembang backend dengan pengalaman membangun REST API menggunakan Python dan FastAPI."
PENGALAMAN = [
    "Membangun 5 layanan API untuk sistem pembayaran menggunakan FastAPI dan PostgreSQL",
    "Menurunkan waktu respons rata-rata sebesar 30% melalui caching Redis",
]
PENGALAMAN_SINGKAT = ["Membangun 5 layanan API", "Menurunkan respons 30%"]
PENDIDIKAN = "S1 Informatika, Universitas Contoh (2019 - 2023)"
KETERAMPILAN = "Python, FastAPI, PostgreSQL, Docker, Git"


def docx_ats(path: Path) -> None:
    doc = Document()
    doc.add_paragraph(NAMA)
    doc.add_paragraph(KONTAK)
    doc.add_paragraph("Ringkasan")
    doc.add_paragraph(RINGKASAN)
    doc.add_paragraph("Pengalaman Kerja")
    for item in PENGALAMAN:
        doc.add_paragraph(f"• {item}")
    doc.add_paragraph("Pendidikan")
    doc.add_paragraph(PENDIDIKAN)
    doc.add_paragraph("Keterampilan")
    doc.add_paragraph(KETERAMPILAN)
    doc.save(path)


def docx_tabel(path: Path) -> None:
    doc = Document()
    doc.add_paragraph(NAMA)
    doc.add_paragraph(KONTAK)
    table = doc.add_table(rows=2, cols=2)
    table.cell(0, 0).text = "Pengalaman Kerja"
    table.cell(0, 1).text = "\n".join(f"• {i}" for i in PENGALAMAN)
    table.cell(1, 0).text = "Keterampilan"
    table.cell(1, 1).text = KETERAMPILAN
    doc.save(path)


def docx_header_kontak(path: Path) -> None:
    doc = Document()
    doc.sections[0].header.paragraphs[0].text = KONTAK
    doc.add_paragraph(NAMA)
    doc.add_paragraph("Pengalaman Kerja")
    for item in PENGALAMAN:
        doc.add_paragraph(f"• {item}")
    doc.add_paragraph("Pendidikan")
    doc.add_paragraph(PENDIDIKAN)
    doc.add_paragraph("Keterampilan")
    doc.add_paragraph(KETERAMPILAN)
    doc.save(path)


def pdf_satu_kolom(path: Path) -> None:
    c = canvas.Canvas(str(path))
    y = 780
    baris = [NAMA, KONTAK, "", "Ringkasan", RINGKASAN, "", "Pengalaman Kerja"]
    baris += [f"• {i}" for i in PENGALAMAN]
    baris += ["", "Pendidikan", PENDIDIKAN, "", "Keterampilan", KETERAMPILAN]
    for teks in baris:
        c.drawString(72, y, teks)
        y -= 18
    c.save()


def pdf_dua_kolom(path: Path) -> None:
    c = canvas.Canvas(str(path))
    c.drawString(72, 780, NAMA)
    kiri = ["Keterampilan", "Python, FastAPI, Docker", "Pendidikan", "S1 Informatika, UC"]
    kanan = ["Pengalaman Kerja"] + [f"• {i}" for i in PENGALAMAN_SINGKAT]
    y = 740
    for teks in kiri:
        c.drawString(72, y, teks)
        y -= 18
    y = 740
    for teks in kanan:
        c.drawString(340, y, teks)
        y -= 18
    c.save()


def pdf_scan(path: Path) -> None:
    png = path.with_suffix(".png")
    Image.new("RGB", (1240, 1754), "white").save(png)
    c = canvas.Canvas(str(path))
    c.drawImage(str(png), 0, 0, width=595, height=842)
    c.save()
    png.unlink()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    daftar = {
        "ats_baik.docx": docx_ats,
        "ats_baik.pdf": pdf_satu_kolom,
        "buruk_tabel.docx": docx_tabel,
        "buruk_header_kontak.docx": docx_header_kontak,
        "buruk_dua_kolom.pdf": pdf_dua_kolom,
        "buruk_scan.pdf": pdf_scan,
    }
    for nama, fungsi in daftar.items():
        fungsi(OUT / nama)
        print("dibuat:", OUT / nama)


if __name__ == "__main__":
    main()