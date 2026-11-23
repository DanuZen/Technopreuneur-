import pytest

from app.llm.fallback import FallbackProvider


class OkProvider:
    def __init__(self, name, payload="{}"):
        self.name = name
        self._payload = payload

    def generate_json(self, system_prompt, user_prompt):
        return self._payload


class FailProvider:
    def __init__(self, name):
        self.name = name

    def generate_json(self, system_prompt, user_prompt):
        raise RuntimeError("503 unavailable")


def test_uses_first_provider_when_it_works():
    fb = FallbackProvider([OkProvider("gemini", '{"a":1}'), OkProvider("grok")])
    assert fb.generate_json("s", "u") == '{"a":1}'
    assert fb.name == "gemini"


def test_falls_back_when_first_fails():
    fb = FallbackProvider([FailProvider("gemini"), OkProvider("grok", '{"b":2}')])
    assert fb.generate_json("s", "u") == '{"b":2}'
    assert fb.name == "grok"


def test_raises_when_all_fail():
    fb = FallbackProvider([FailProvider("gemini"), FailProvider("grok")])
    with pytest.raises(RuntimeError):
        fb.generate_json("s", "u")


def test_empty_chain_raises():
    with pytest.raises(RuntimeError):
        FallbackProvider([]).generate_json("s", "u")