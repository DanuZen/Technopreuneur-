import re
from functools import lru_cache
from pathlib import Path

import yaml

SKILLS_PATH = Path(__file__).resolve().parents[1] / "resources" / "skills.yaml"


@lru_cache(maxsize=1)
def load_skill_map() -> dict[str, list[str]]:
    with SKILLS_PATH.open(encoding="utf-8") as f:
        raw = yaml.safe_load(f) or {}
    return {canon: [s.lower() for s in syns] for canon, syns in raw.items()}


@lru_cache(maxsize=1)
def _compiled_patterns() -> list[tuple[str, re.Pattern]]:
    patterns = []
    for canon, synonyms in load_skill_map().items():
        for term in synonyms:
            # Batas kata: "java" tidak cocok di dalam "javascript"
            pat = re.compile(
                rf"(?<![a-z0-9+#]){re.escape(term)}(?![a-z0-9+#])",
                re.IGNORECASE,
            )
            patterns.append((canon, pat))
    return patterns


def extract_skills(text: str) -> set[str]:
    """Mengembalikan nama kanonik skill yang muncul di teks."""
    found: set[str] = set()
    for canon, pat in _compiled_patterns():
        if canon not in found and pat.search(text):
            found.add(canon)
    return found

@lru_cache(maxsize=1)
def load_skill_labels() -> dict[str, str]:
    path = SKILLS_PATH.parent / "skill_labels.yaml"
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def label_for(canon: str) -> str:
    """Nama tampilan. Kalau belum ada labelnya, pakai nama kanonik apa adanya."""
    return load_skill_labels().get(canon, canon)