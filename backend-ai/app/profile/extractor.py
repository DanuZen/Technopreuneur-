import re
from typing import Optional

from pydantic import BaseModel, Field

from app.matching.keywords import extract_skills, label_for

SOFT_SKILL_CANONS = {
    "komunikasi",
    "kepemimpinan",
    "project_management",
    "layanan_pelanggan",
    "bahasa_inggris",
}

TOOL_SKILL_CANONS = {
    "docker",
    "kubernetes",
    "git",
    "github",
    "linux",
    "aws",
    "figma",
    "canva",
    "excel",
    "microsoft_office",
    "powerpoint",
    "jest",
    "cypress",
    "mlflow",
}

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
YEAR_RE = re.compile(r"\b(19\d{2}|20\d{2})\b")
DEGREE_RE = re.compile(
    r"\b(S1|S2|D3|D4|SMK|SMA|Sarjana|Magister|Diploma|Bachelor|Master)\b",
    re.IGNORECASE,
)
INSTITUTION_RE = re.compile(
    r"(Universitas|Institut|Politeknik|Sekolah Tinggi|SMK|SMA|University|Institute)[^\n,|•]{0,80}",
    re.IGNORECASE,
)


class ProfileSkillsOut(BaseModel):
    technical: list[str] = Field(default_factory=list)
    soft: list[str] = Field(default_factory=list)
    tools: list[str] = Field(default_factory=list)


class ProfileEducationItem(BaseModel):
    institution: str
    degree: str
    field: str
    graduationYear: str


class ProfileExperienceItem(BaseModel):
    title: str
    organization: str
    period: str
    description: str


class ExtractedProfile(BaseModel):
    fullName: str
    headline: str = "Kandidat Profesional Muda"
    contactEmail: Optional[str] = None
    summary: str = ""
    skills: ProfileSkillsOut = Field(default_factory=ProfileSkillsOut)
    experiences: list[ProfileExperienceItem] = Field(default_factory=list)
    education: list[ProfileEducationItem] = Field(default_factory=list)


def extract_structured_profile(sanitized_text: str) -> ExtractedProfile:
    lines = [ln.strip() for ln in sanitized_text.splitlines() if ln.strip()]

    email_match = EMAIL_RE.search(sanitized_text)
    contact_email = email_match.group(0) if email_match else None

    heading_stop = {
        "pendidikan",
        "riwayat pendidikan",
        "education",
        "pengalaman",
        "pengalaman kerja",
        "riwayat pekerjaan",
        "experience",
        "work experience",
        "keahlian",
        "keterampilan",
        "kemampuan",
        "skills",
        "ringkasan",
        "ringkasan profil",
        "profil",
    }

    full_name = "Kandidat Terdaftar"
    for ln in lines[:5]:
        clean = re.sub(r"^[•\-\*]\s*", "", ln).strip()
        if (
            2 <= len(clean) <= 60
            and "@" not in clean
            and not re.search(r"\d{4,}", clean)
            and clean.lower().rstrip(":") not in heading_stop
        ):
            full_name = clean
            break

    detected_canons = sorted(extract_skills(sanitized_text))
    technical: list[str] = []
    soft: list[str] = []
    tools: list[str] = []

    for canon in detected_canons:
        lbl = label_for(canon)
        if canon in SOFT_SKILL_CANONS:
            soft.append(lbl)
        elif canon in TOOL_SKILL_CANONS:
            tools.append(lbl)
        else:
            technical.append(lbl)

    headline = (
        f"Spesialis {' & '.join(technical[:2])}"
        if technical
        else "Kandidat Profesional Muda"
    )

    summary_candidates = [
        ln
        for ln in lines
        if 55 <= len(ln) <= 350
        and not ln.startswith(("•", "-", "*"))
        and "@" not in ln
    ]
    summary = (
        summary_candidates[0]
        if summary_candidates
        else "Kandidat dengan kesiapan dokumen berbasis teks digital yang terstruktur untuk evaluasi ATS."
    )

    # Ekstraksi Pendidikan
    education: list[ProfileEducationItem] = []
    for ln in lines:
        inst_m = INSTITUTION_RE.search(ln)
        deg_m = DEGREE_RE.search(ln)
        if inst_m or deg_m:
            year_m = YEAR_RE.search(ln)
            education.append(
                ProfileEducationItem(
                    institution=inst_m.group(0).strip() if inst_m else ln[:80],
                    degree=deg_m.group(0).upper() if deg_m else "S1 / Sederajat",
                    field="Bidang Studi Terkait",
                    graduationYear=year_m.group(0) if year_m else "2026",
                )
            )
            break

    if not education:
        education.append(
            ProfileEducationItem(
                institution="Institusi Pendidikan",
                degree="S1 / Sederajat",
                field="Bidang Studi Terkait",
                graduationYear="2026",
            )
        )

    # Ekstraksi Pengalaman (dari poin bullet atau baris pengalaman)
    experiences: list[ProfileExperienceItem] = []
    bullet_lines = [
        re.sub(r"^\s*(?:[•\-\*▪◦‣–—]|\d+[.)])\s*", "", ln).strip()
        for ln in lines
        if re.match(r"^\s*(?:[•\-\*▪◦‣–—]|\d+[.)])\s+", ln)
    ]
    for idx, b in enumerate(bullet_lines[:3]):
        year_m = YEAR_RE.search(b)
        experiences.append(
            ProfileExperienceItem(
                title=f"Pencapaian & Pengalaman #{idx + 1}",
                organization="Riwayat Pengalaman Kandidat",
                period=year_m.group(0) if year_m else "Terbaru",
                description=b[:280],
            )
        )

    if not experiences and summary_candidates:
        experiences.append(
            ProfileExperienceItem(
                title="Pengalaman Proyek & Kolaborasi",
                organization="Riwayat Kandidat",
                period="Terbaru",
                description=summary_candidates[-1][:280],
            )
        )

    return ExtractedProfile(
        fullName=full_name,
        headline=headline,
        contactEmail=contact_email,
        summary=summary,
        skills=ProfileSkillsOut(
            technical=technical,
            soft=soft,
            tools=tools,
        ),
        experiences=experiences,
        education=education,
    )
