import re
from dataclasses import dataclass, field

# Setiap aturan: nama kategori dan pola untuk baris yang diawali label.
# Kategori dicatat di laporan, nilai aslinya tidak pernah disimpan.
LABEL_RULES: list[tuple[str, re.Pattern]] = [
    ("DATE_OF_BIRTH", re.compile(
        r"^\s*(tanggal\s+lahir|tgl\.?\s*lahir|tempat\s*,?\s*tanggal\s+lahir|ttl|"
        r"date\s+of\s+birth|dob|born)\s*[:\-–]",
        re.IGNORECASE,
    )),
    ("AGE", re.compile(r"^\s*(usia|umur|age)\s*[:\-–]", re.IGNORECASE)),
    ("GENDER", re.compile(r"^\s*(jenis\s+kelamin|jk|gender|sex)\s*[:\-–]", re.IGNORECASE)),
    ("MARITAL_STATUS", re.compile(
        r"^\s*(status\s+pernikahan|status\s+perkawinan|marital\s+status)\s*[:\-–]",
        re.IGNORECASE,
    )),
    ("RELIGION", re.compile(r"^\s*(agama|religion)\s*[:\-–]", re.IGNORECASE)),
    ("NATIONALITY_ETHNICITY", re.compile(
        r"^\s*(kewarganegaraan|nationality|suku|etnis|ethnicity|race)\s*[:\-–]",
        re.IGNORECASE,
    )),
]


@dataclass
class SanitizationReport:
    removed_categories: list[str] = field(default_factory=list)
    removed_lines: int = 0


@dataclass
class SanitizedText:
    text: str
    report: SanitizationReport


def sanitize_text(text: str) -> SanitizedText:
    kept: list[str] = []
    categories: list[str] = []
    removed = 0

    for line in text.splitlines():
        category = next(
            (name for name, pattern in LABEL_RULES if pattern.search(line)),
            None,
        )
        if category is None:
            kept.append(line)
            continue

        removed += 1
        if category not in categories:
            categories.append(category)

    return SanitizedText(
        text="\n".join(kept),
        report=SanitizationReport(removed_categories=categories, removed_lines=removed),
    )