from typing import Protocol


class LLMProvider(Protocol):
    name: str

    def generate_json(self, system_prompt: str, user_prompt: str) -> str:
        """Mengembalikan string mentah. Validasi dilakukan di app/advice/service.py."""
        ...