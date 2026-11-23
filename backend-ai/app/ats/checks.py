import re
from typing import Callable

from app.ats.schema import ATSIssue, DimensionName, Severity
from app.ingestion.models import ExtractedDocument

# Ambang panjang teks. Angka ini awal dan perlu dikalibrasi dengan CV contoh.
MIN_WORDS_ACCEPTABLE = 150
MAX_WORDS_ACCEPTABLE = 1200
MAX_PAGES_ACCEPTABLE = 2

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
PHONE_RE = re.compile(r"(\+62|62|0)[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}")
DECORATIVE_SYMBOLS_RE = re.compile(r"[★☆●■▪►✓✔◆◇]")


def check_scanned(doc: ExtractedDocument) -> list[ATSIssue]:
    if doc.is_scanned:
        return [ATSIssue(
            code="SCANNED_PDF",
            severity=Severity.CRITICAL,
            dimension=DimensionName.READABILITY,
            message="CV terdeteksi sebagai hasil scan. Unggah CV dalam format PDF berbasis teks atau DOCX.",
        )]
    return []


def check_empty(doc: ExtractedDocument) -> list[ATSIssue]:
    if doc.is_empty:
        return [ATSIssue(
            code="EMPTY_DOCUMENT",
            severity=Severity.CRITICAL,
            dimension=DimensionName.READABILITY,
            message="Tidak ada teks yang bisa dibaca dari dokumen ini.",
        )]
    return []


def check_multi_column(doc: ExtractedDocument) -> list[ATSIssue]:
    if doc.has_multi_column:
        return [ATSIssue(
            code="MULTI_COLUMN_LAYOUT",
            severity=Severity.WARNING,
            dimension=DimensionName.READABILITY,
            message="Layout dua kolom terdeteksi. ATS bisa membaca urutan teks secara salah.",
        )]
    return []


def check_tables(doc: ExtractedDocument) -> list[ATSIssue]:
    if doc.has_tables:
        return [ATSIssue(
            code="TABLE_DETECTED",
            severity=Severity.WARNING,
            dimension=DimensionName.READABILITY,
            message="Tabel terdeteksi. Ganti dengan teks biasa agar mudah dibaca ATS.",
        )]
    return []


def check_images(doc: ExtractedDocument) -> list[ATSIssue]:
    if doc.has_images:
        return [ATSIssue(
            code="IMAGE_DETECTED",
            severity=Severity.WARNING,
            dimension=DimensionName.READABILITY,
            message="Gambar atau foto terdeteksi. ATS tidak membaca isi gambar.",
        )]
    return []


def check_decorative_symbols(text: str) -> list[ATSIssue]:
    if DECORATIVE_SYMBOLS_RE.search(text):
        return [ATSIssue(
            code="DECORATIVE_SYMBOLS",
            severity=Severity.INFO,
            dimension=DimensionName.READABILITY,
            message="Simbol dekoratif terdeteksi. Gunakan bullet standar seperti • atau -.",
        )]
    return []


def check_contact(doc: ExtractedDocument) -> list[ATSIssue]:
    text = doc.plain_text
    issues = []
    if not EMAIL_RE.search(text):
        issues.append(ATSIssue(
            code="EMAIL_MISSING",
            severity=Severity.WARNING,
            dimension=DimensionName.CONTACT_LENGTH,
            message="Email tidak terdeteksi. Pastikan email ada di teks utama CV.",
        ))
    elif all(b.region in ("header", "footer") for b in doc.blocks if EMAIL_RE.search(b.text)):
        issues.append(ATSIssue(
            code="CONTACT_IN_HEADER_FOOTER",
            severity=Severity.WARNING,
            dimension=DimensionName.CONTACT_LENGTH,
            message="Email hanya ada di header atau footer. Beberapa ATS melewatkan bagian ini.",
        ))
    if not PHONE_RE.search(text):
        issues.append(ATSIssue(
            code="PHONE_MISSING",
            severity=Severity.INFO,
            dimension=DimensionName.CONTACT_LENGTH,
            message="Nomor telepon tidak terdeteksi.",
        ))
    return issues


def check_length(doc: ExtractedDocument) -> list[ATSIssue]:
    issues = []
    words = len(doc.plain_text.split())
    if doc.page_count > MAX_PAGES_ACCEPTABLE:
        issues.append(ATSIssue(
            code="TOO_MANY_PAGES",
            severity=Severity.INFO,
            dimension=DimensionName.CONTACT_LENGTH,
            message=f"CV berisi {doc.page_count} halaman. Umumnya 1 sampai 2 halaman lebih mudah diproses.",
        ))
    if words < MIN_WORDS_ACCEPTABLE and not doc.is_empty and not doc.is_scanned:
        issues.append(ATSIssue(
            code="TOO_SHORT",
            severity=Severity.WARNING,
            dimension=DimensionName.CONTACT_LENGTH,
            message="Isi CV terlalu sedikit. Tambahkan detail pengalaman dan keterampilan.",
        ))
    if words > MAX_WORDS_ACCEPTABLE:
        issues.append(ATSIssue(
            code="TOO_LONG",
            severity=Severity.INFO,
            dimension=DimensionName.CONTACT_LENGTH,
            message="Isi CV terlalu panjang. Ringkas agar poin utama mudah ditemukan.",
        ))
    return issues


# Semua pengecekan yang berbasis dokumen. Dijalankan berurutan oleh scorer.
DOCUMENT_CHECKS: list[Callable[[ExtractedDocument], list[ATSIssue]]] = [
    check_scanned,
    check_empty,
    check_multi_column,
    check_tables,
    check_images,
    check_contact,
    check_length,
]


def run_document_checks(doc: ExtractedDocument) -> list[ATSIssue]:
    # Pengecekan bersifat independen. Jika satu gagal, pengecekan lain tetap berjalan.
    issues: list[ATSIssue] = []
    for check in DOCUMENT_CHECKS:
        issues.extend(check(doc))
    issues.extend(check_decorative_symbols(doc.plain_text))
    return issues