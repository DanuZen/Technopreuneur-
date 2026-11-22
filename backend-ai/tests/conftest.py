from pathlib import Path

import pytest
from PIL import Image
from reportlab.pdfgen import canvas


@pytest.fixture
def text_pdf(tmp_path) -> Path:
    path = tmp_path / "cv_text.pdf"
    c = canvas.Canvas(str(path))
    c.setFont("Helvetica", 11)
    y = 750
    for line in [
        "Budi Santoso",
        "budi@example.com | 0812-3456-7890",
        "Pengalaman Kerja",
        "Membangun API backend dengan Python dan Docker",
    ]:
        c.drawString(72, y, line)
        y -= 18
    c.save()
    return path


@pytest.fixture
def scan_pdf(tmp_path) -> Path:
    png = tmp_path / "scan.png"
    Image.new("RGB", (600, 800), "white").save(png)
    path = tmp_path / "cv_scan.pdf"
    c = canvas.Canvas(str(path))
    c.drawImage(str(png), 0, 0, width=612, height=792)
    c.save()
    return path


@pytest.fixture
def long_pdf(tmp_path) -> Path:
    path = tmp_path / "cv_long.pdf"
    c = canvas.Canvas(str(path))
    for _ in range(11):
        c.drawString(72, 750, "Halaman")
        c.showPage()
    c.save()
    return path

@pytest.fixture
def two_col_pdf(tmp_path) -> Path:
    path = tmp_path / "cv_two_col.pdf"
    c = canvas.Canvas(str(path))
    c.drawString(72, 780, "Nama Contoh Pelamar")
    kiri = ["Keterampilan", "Python, Docker", "Pendidikan", "S1 Informatika"]
    kanan = ["Pengalaman Kerja", "• Membangun API pembayaran", "• Menurunkan respons 30%"]
    for i, teks in enumerate(kiri):
        c.drawString(72, 740 - i * 18, teks)
    for i, teks in enumerate(kanan):
        c.drawString(340, 740 - i * 18, teks)
    c.save()
    return path