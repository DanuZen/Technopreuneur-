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


def _deterministic_chat_answer(payload: CvChatRequest) -> str:
    q = payload.question.lower()
    dim_labels = {
        "structure": "Struktur ATS",
        "clarity": "Kejelasan Bahasa",
        "measurableImpact": "Dampak Terukur",
        "skillRelevance": "Relevansi Skill",
        "completeness": "Kelengkapan Profil",
    }
    scored_dims = [
        (dim_labels.get(k, k), v) for k, v in payload.dimensions.items() if isinstance(v, int)
    ]
    lowest_name, lowest_score = (
        min(scored_dims, key=lambda item: item[1])
        if scored_dims
        else ("Dampak Terukur", payload.overall_score)
    )
    top_rec = (
        payload.recommendations[0]
        if payload.recommendations
        else "Tambahkan metrik angka kuantitatif pada setiap poin pengalaman kerja atau proyek."
    )

    if any(w in q for w in ("ats", "struktur", "format", "kolom", "tabel")):
        struct_score = payload.dimensions.get("structure", payload.overall_score)
        if struct_score >= 85:
            return (
                f"Skor Struktur ATS Anda sudah sangat baik ({struct_score}/100). "
                "Pertahankan tata letak 1-kolom tanpa tabel bersarang atau kotak teks agar mesin parser rekruter membaca seluruh isi secara akurat."
            )
        return (
            f"Skor Struktur ATS Anda saat ini {struct_score}/100. "
            "Sederhanakan dokumen ke format 1-kolom bersih tanpa tabel, header grafis, atau multi-kolom supaya seluruh riwayat terbaca utuh oleh ATS."
        )

    if any(w in q for w in ("terukur", "kalimat", "contoh", "dampak", "angka", "metrik")):
        impact_score = payload.dimensions.get("measurableImpact", payload.overall_score)
        return (
            f"Untuk menaikkan skor Dampak Terukur (saat ini {impact_score}/100), gunakan pola Kata Kerja Aksi + Tugas + Hasil Angka. "
            'Contoh: "Mengoptimalkan endpoint API dan query database sehingga memangkas waktu respons hingga 35% untuk 5.000 pengguna harian."'
        )

    if any(w in q for w in ("skill", "keahlian", "kata kunci", "keyword", "tonjol")):
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

    user_prompt = (
        f"Skor Keseluruhan CV: {payload.overall_score}/100\n"
        f"Skor Dimensi: {json.dumps(payload.dimensions, ensure_ascii=False)}\n"
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
