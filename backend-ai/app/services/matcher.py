from typing import List, Dict, Any
from app.schemas.matching_schema import JobMatchEvaluationOutput


class TwoStageMatcherService:
    @staticmethod
    async def stage1_vector_search(profile_embedding: List[float], top_k: int = 30) -> List[Dict[str, Any]]:
        """
        Tahap 1: Pencarian kemiripan vektor menggunakan pgvector cosine distance (<=>).
        Mengambil Top K lowongan teratas.
        """
        # Template query SQL pgvector:
        # SELECT id, title, company_id, description, skills_required, location,
        #        1 - (embedding <=> :profile_embedding) AS similarity_score
        # FROM jobs
        # WHERE status = 'active'
        # ORDER BY embedding <=> :profile_embedding ASC
        # LIMIT :top_k;
        return []

    @staticmethod
    async def stage2_llm_evaluation(profile_data: Dict[str, Any], candidate_jobs: List[Dict[str, Any]]) -> List[JobMatchEvaluationOutput]:
        """
        Tahap 2: Evaluasi kontekstual LLM untuk kandidat teratas.
        Menghasilkan skor 0-100, alasan kecocokan, dan missing skills.
        """
        return []

