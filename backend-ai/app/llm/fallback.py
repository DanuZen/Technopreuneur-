import logging

logger = logging.getLogger(__name__)


class FallbackProvider:
    """Mencoba provider berurutan. Provider yang berhasil menentukan `name`."""

    def __init__(self, providers: list):
        self._providers = providers
        self.name = providers[0].name if providers else "none"

    def generate_json(self, system_prompt: str, user_prompt: str) -> str:
        if not self._providers:
            raise RuntimeError("Tidak ada provider LLM yang aktif")

        last_exc: Exception | None = None
        for provider in self._providers:
            try:
                output = provider.generate_json(system_prompt, user_prompt)
                self.name = provider.name  # service.py membaca ini untuk field "provider"
                return output
            except Exception as exc:
                # Hanya jenis error yang dicatat, bukan pesannya, supaya isi CV tidak ikut ke log
                logger.warning("Provider %s gagal (%s), mencoba berikutnya", provider.name, type(exc).__name__)
                last_exc = exc

        raise last_exc