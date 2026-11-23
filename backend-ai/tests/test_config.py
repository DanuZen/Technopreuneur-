import importlib


def test_env_value_is_loaded(monkeypatch, tmp_path):
    env_file = tmp_path / ".env"
    env_file.write_text("GEMINI_API_KEY=test-key-123\nGEMINI_MODEL=model-uji\n")

    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_MODEL", raising=False)

    from dotenv import load_dotenv
    load_dotenv(env_file)

    import app.config as config
    importlib.reload(config)

    assert config.GEMINI_API_KEY == "test-key-123"
    assert config.GEMINI_MODEL == "model-uji"


def test_default_model_when_unset(monkeypatch):
    monkeypatch.delenv("GEMINI_MODEL", raising=False)

    import app.config as config
    importlib.reload(config)

    # tests/test_config.py
    assert config.GEMINI_MODEL == "gemini-3.5-flash-lite"