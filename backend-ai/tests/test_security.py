import importlib

import pytest
from fastapi import HTTPException


def _reload_with_token(monkeypatch, token: str):
    import app.config as config
    monkeypatch.setattr(config, "INTERNAL_TOKEN", token)
    import app.api.security as sec
    return importlib.reload(sec)


def test_missing_token_rejected(monkeypatch):
    sec = _reload_with_token(monkeypatch, "rahasia-uji-123")
    with pytest.raises(HTTPException) as exc:
        sec.require_internal_token(x_internal_token="")
    assert exc.value.status_code == 401


def test_wrong_token_rejected(monkeypatch):
    sec = _reload_with_token(monkeypatch, "rahasia-uji-123")
    with pytest.raises(HTTPException) as exc:
        sec.require_internal_token(x_internal_token="salah")
    assert exc.value.status_code == 401


def test_correct_token_accepted(monkeypatch):
    sec = _reload_with_token(monkeypatch, "rahasia-uji-123")
    sec.require_internal_token(x_internal_token="rahasia-uji-123")


def test_unconfigured_token_is_503(monkeypatch):
    sec = _reload_with_token(monkeypatch, "")
    with pytest.raises(HTTPException) as exc:
        sec.require_internal_token(x_internal_token="apa-saja")
    assert exc.value.status_code == 503