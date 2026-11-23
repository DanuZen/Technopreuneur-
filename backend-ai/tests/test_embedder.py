import math

import pytest

from app.embedding.gemini_embedder import EMBEDDING_DIM, _normalize


def test_normalize_gives_unit_length():
    vec = _normalize([3.0, 4.0] + [0.0] * (EMBEDDING_DIM - 2))
    assert math.isclose(math.sqrt(sum(x * x for x in vec)), 1.0, rel_tol=1e-9)


def test_normalize_keeps_direction():
    vec = _normalize([2.0, 0.0] + [0.0] * (EMBEDDING_DIM - 2))
    assert vec[0] == pytest.approx(1.0)


def test_zero_vector_rejected():
    with pytest.raises(ValueError):
        _normalize([0.0] * EMBEDDING_DIM)