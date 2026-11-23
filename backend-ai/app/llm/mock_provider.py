import json
import re

# Kode temuan -> (dimensi, prioritas, saran). Saran tidak boleh mengarang pengalaman.
SUGGESTION_BANK: dict[str, tuple[str, str, str]] = {
    "MISSING_SECTION_EXPERIENCE": (
        "sections", "high",
        "Tambahkan section 'Pengalaman Kerja' dengan heading yang jelas agar ATS mengenali riwayat pekerjaan Anda.",
    ),
    "MISSING_SECTION_SKILLS": (
        "sections", "high",
        "Tambahkan section 'Keterampilan' yang berisi daftar skill dalam bentuk teks biasa.",
    ),
    "LOW_METRIC_USAGE": (
        "content", "medium",
        "Tambahkan angka atau hasil terukur pada poin pengalaman, misalnya persentase peningkatan atau jumlah pengguna.",
    ),
    "KEYWORD_GAP": (
        "keywords", "high",
        "Selaraskan istilah CV dengan deskripsi lowongan, tanpa menambahkan pengalaman yang tidak Anda miliki.",
    ),
    "SCANNED_PDF": (
        "readability", "high",
        "Unggah ulang CV dalam format PDF berbasis teks atau DOCX, bukan hasil scan.",
    ),
    "TABLE_DETECTED": (
        "readability", "medium",
        "Ganti tabel dengan teks biasa agar urutan informasi terbaca dengan benar oleh ATS.",
    ),
    "EMAIL_MISSING": (
        "contact_length", "high",
        "Cantumkan email di badan utama CV, bukan hanya di header atau footer.",
    ),
}

_CODE_RE = re.compile(r"^- ([A-Z][A-Z0-9_]+):", re.MULTILINE)


class MockLLMProvider:
    name = "mock"

    def generate_json(self, system_prompt: str, user_prompt: str) -> str:
        suggestions: list[dict] = []
        seen: set[str] = set()

        for code in _CODE_RE.findall(user_prompt):
            if code in SUGGESTION_BANK and code not in seen:
                dimension, priority, text = SUGGESTION_BANK[code]
                suggestions.append({"dimension": dimension, "priority": priority, "text": text})
                seen.add(code)

        if suggestions:
            summary = "Beberapa bagian CV perlu diperbaiki agar lebih mudah dibaca dan dicocokkan ATS."
        else:
            summary = "CV sudah memenuhi aturan dasar. Pertahankan format ini dan sesuaikan keyword dengan lowongan."

        return json.dumps(
            {"summary": summary, "suggestions": suggestions[:6]},
            ensure_ascii=False,
        )