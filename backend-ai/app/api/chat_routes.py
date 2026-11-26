import json
from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.api.security import require_internal_token
from app.llm.gemini_provider import get_provider
from app.sanitization.sanitizer import sanitize_text

router = APIRouter(
    prefix="/internal/v1/cv",
    tags=["cv"],
    dependencies=[Depends(require_internal_token)],
)

SYSTEM_PROMPT = (
    "Kamu adalah konsultan karir dan spesialis CV standar ATS berbahasa Indonesia dari Pasbana AI. "
    "Jawab pertanyaan kandidat secara ringkas, praktis, dan spesifik berdasarkan skor evaluasi CV, "
    "daftar kekuatan, kelemahan, serta isi CV yang sudah disanitasi. "
    "Jangan pernah menjawab topik di luar evaluasi CV, peningkatan profil, atau persiapan melamar kerja. "
    "Gunakan tanda hubung biasa (-) dan jangan gunakan tanda pisah panjang. "
    'Kembalikan HANYA objek JSON valid dengan format {"answer": "jawaban ringkas 2-4 kalimat"}.'
)


class CvChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    source: Literal["upload", "onboarding"] = Field(default="upload")
    sanitized_text: str = Field(default="", max_length=15000)
    overall_score: int = Field(default=80, ge=0, le=100)
    dimensions: dict[str, int] = Field(default_factory=dict)
    strengths: list[str] = Field(default_factory=list, max_length=20)
    weaknesses: list[str] = Field(default_factory=list, max_length=20)
    recommendations: list[str] = Field(default_factory=list, max_length=20)


class CvChatLLMOut(BaseModel):
    answer: str = Field(min_length=5, max_length=1800)


class CvChatResponse(BaseModel):
    answer: str
    status: Literal["ok", "fallback"]


def _get_dim_labels(source: str) -> dict[str, str]:
    if source == "onboarding":
        return {
            "structure": "Kesesuaian Target Posisi",
            "clarity": "Kedalaman Narasi Pengalaman",
            "measurableImpact": "Bukti Dampak & Angka",
            "skillRelevance": "Kekuatan Kata Kerja Aksi",
            "completeness": "Kredibilitas & Portofolio",
        }
    return {
        "structure": "Struktur & Format ATS",
        "clarity": "Kejelasan Bahasa",
        "measurableImpact": "Dampak Terukur",
        "skillRelevance": "Relevansi Skill",
        "completeness": "Kelengkapan Profil",
    }


def _deterministic_chat_answer(payload: CvChatRequest) -> str:
    q = payload.question.lower()
    is_onboarding = payload.source == "onboarding"
    dim_labels = _get_dim_labels(payload.source)
    scored_dims = [
        (dim_labels.get(k, k), v) for k, v in payload.dimensions.items() if isinstance(v, int)
    ]
    lowest_name, lowest_score = (
        min(scored_dims, key=lambda item: item[1])
        if scored_dims
        else ("Bukti Dampak & Angka" if is_onboarding else "Dampak Terukur", payload.overall_score)
    )
    top_rec = (
        payload.recommendations[0]
        if payload.recommendations
        else "Tambahkan metrik angka kuantitatif pada setiap poin pengalaman kerja atau proyek."
    )

    if any(w in q for w in ("poin pengalaman", "3 poin", "proyek")):
        return (
            "Gunakan pola Kata Kerja Aksi + Teknologi/Peran + Hasil Terukur dalam 3 poin: "
            "1) Mengembangkan fitur aplikasi menggunakan teknologi inti proyek sehingga mempercepat proses kerja hingga 30%. "
            "2) Berkolaborasi dalam tim beranggotakan 4 orang untuk menyelesaikan modul utama sesuai target waktu. "
            "3) Menguji dan mengoptimalkan kualitas hasil proyek berdasarkan umpan balik pengguna."
        )

    if any(w in q for w in ("kredibilitas", "portofolio", "fresh graduate")):
        comp_score = payload.dimensions.get("completeness", payload.overall_score)
        return (
            f"Skor Kredibilitas & Portofolio Anda saat ini {comp_score}/100. "
            "Untuk meningkatkannya, cantumkan tautan GitHub, LinkedIn, atau demo proyek aktif, lengkapi nomor telepon/WhatsApp, serta tambahkan minimal 4 keahlian teknis dan 2 soft skills."
        )

    if any(w in q for w in ("ats", "struktur", "format", "kolom", "tabel")):
        struct_score = payload.dimensions.get("structure", payload.overall_score)
        if is_onboarding:
            return (
                "Karena CV Anda dibuat melalui Kuesioner Onboarding Pasbana, format dokumen sudah 100% menggunakan struktur 1-kolom standar ATS. "
                f"Fokus utama Anda sekarang adalah meningkatkan Kesesuaian Target Posisi ({struct_score}/100) dan Kedalaman Narasi Pengalaman."
            )
        if struct_score >= 85:
            return (
                f"Skor Struktur & Format ATS Anda sudah sangat baik ({struct_score}/100). "
                "Pertahankan tata letak 1-kolom tanpa tabel bersarang atau kotak teks agar mesin parser rekruter membaca seluruh isi secara akurat."
            )
        return (
            f"Skor Struktur & Format ATS Anda saat ini {struct_score}/100. "
            "Sederhanakan dokumen ke format 1-kolom bersih tanpa tabel, header grafis, atau multi-kolom supaya seluruh riwayat terbaca utuh oleh ATS."
        )

    if any(w in q for w in ("terukur", "kalimat", "contoh", "dampak", "angka", "metrik")):
        impact_score = payload.dimensions.get("measurableImpact", payload.overall_score)
        label = "Bukti Dampak & Angka" if is_onboarding else "Dampak Terukur"
        return (
            f"Untuk menaikkan skor {label} (saat ini {impact_score}/100), gunakan pola Kata Kerja Aksi + Tugas + Hasil Angka. "
            'Contoh: "Mengoptimalkan endpoint API dan query database sehingga memangkas waktu respons hingga 35% untuk 5.000 pengguna harian."'
        )

    if any(w in q for w in ("skill", "keahlian", "kata kunci", "keyword", "tonjol", "wajib")):
        if is_onboarding:
            role_score = payload.dimensions.get("structure", payload.overall_score)
            return (
                f"Skor Kesesuaian Target Posisi Anda saat ini {role_score}/100. "
                f"{top_rec}"
            )
        skill_score = payload.dimensions.get("skillRelevance", payload.overall_score)
        return (
            f"Skor Relevansi Skill Anda berada di angka {skill_score}/100. "
            "Kelompokkan keahlian teknis utama, tools, dan soft skills secara eksplisit pada bagian Keahlian serta selaraskan istilahnya dengan kata kunci lowongan perusahaan target."
        )

    return (
        f"Berdasarkan skor keseluruhan CV Anda ({payload.overall_score}/100), dimensi paling potensial untuk ditingkatkan lebih dulu adalah {lowest_name} ({lowest_score}/100). "
        f"Langkah prioritas: {top_rec}"
    )


@router.post("/chat", response_model=CvChatResponse)
def cv_chat(payload: CvChatRequest) -> CvChatResponse:
    safe_cv = sanitize_text(payload.sanitized_text).text[:4000]
    safe_question = sanitize_text(payload.question).text.strip() or payload.question.strip()
    dim_labels = _get_dim_labels(payload.source)
    labeled_dimensions = {dim_labels.get(k, k): v for k, v in payload.dimensions.items()}
    mode_desc = (
        "Jalur Onboarding (Belum Punya CV - Format 1-kolom ATS sudah otomatis diterapkan oleh Pasbana, fokus evaluasi pada substansi isi terhadap target posisi)"
        if payload.source == "onboarding"
        else "Jalur Upload Dokumen CV (Audit keterbacaan format ATS dan kualitas isi dokumen)"
    )

    user_prompt = (
        f"Mode Evaluasi: {mode_desc}\n"
        f"Skor Keseluruhan CV: {payload.overall_score}/100\n"
        f"Skor 5 Dimensi: {json.dumps(labeled_dimensions, ensure_ascii=False)}\n"
        f"Kekuatan: {'; '.join(payload.strengths[:4]) or '-'}\n"
        f"Kelemahan: {'; '.join(payload.weaknesses[:4]) or '-'}\n"
        f"Rekomendasi Saat Ini: {'; '.join(payload.recommendations[:4]) or '-'}\n"
        f"Cuplikan CV Tersanitasi:\n{safe_cv or '(tidak disertakan)'}\n\n"
        f"Pertanyaan Kandidat: {safe_question}"
    )

    try:
        raw = get_provider().generate_json(SYSTEM_PROMPT, user_prompt)
        parsed = CvChatLLMOut.model_validate_json(raw)
        clean_answer = parsed.answer.replace("\u2014", "-").replace("\u2013", "-").strip()
        return CvChatResponse(answer=clean_answer, status="ok")
    except Exception:
        return CvChatResponse(
            answer=_deterministic_chat_answer(payload),
            status="fallback",
        )
