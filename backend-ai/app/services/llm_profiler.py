from app.schemas.cv_schema import CVAnalysisOutput


class LLMProfilerService:
    @staticmethod
    def get_system_prompt() -> str:
        return """Anda adalah AI Career Specialist dan ATS Expert untuk platform CareerMatch AI.
Tugas Anda adalah membaca teks Curriculum Vitae (CV) kandidat, mengekstrak informasi profil terstruktur, memberikan skor kualitas dokumen 0-100, dan memberikan saran perbaikan objektif.

ATURAN KETAT:
1. JANGAN PERNAH menyertakan data sensitif (usia, jenis kelamin, foto, agama, suku, status perkawinan) ke dalam evaluasi atau skor.
2. Penilaian murni berbasis kualitas struktur, kejelasan pencapaian, relevansi keahlian, dan kelengkapan.
3. Berikan saran konkret yang dapat langsung diperbaiki oleh pencari kerja.
4. Keluaran WAJIB berupa JSON valid yang mematuhi skema yang ditentukan."""

    @staticmethod
    async def analyze_cv(cv_text: str) -> CVAnalysisOutput:
        # Template method: siap dihubungkan ke OpenAI / Gemini API
        # Florensius Panca Gati dapat menyambungkan model_client di sini
        pass

