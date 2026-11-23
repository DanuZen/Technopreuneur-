import pytest
from pydantic import ValidationError

from app.ats.schema import ATSCheckResult, ATSDimension, DimensionName, DocumentFlags


def _valid_dimensions(weights=None):
    weights = weights or {
        DimensionName.READABILITY: 0.25,
        DimensionName.SECTIONS: 0.20,
        DimensionName.KEYWORDS: 0.25,
        DimensionName.CONTENT: 0.20,
        DimensionName.CONTACT_LENGTH: 0.10,
    }
    return [ATSDimension(name=n, score=80, weight=w) for n, w in weights.items()]


def test_valid_result_builds():
    result = ATSCheckResult(
        overall_score=80,
        dimensions=_valid_dimensions(),
        flags=DocumentFlags(page_count=1, char_count=500),
    )
    assert result.is_estimate is True
    assert result.rules_version


def test_weights_must_sum_to_one():
    bad = {
        DimensionName.READABILITY: 0.5,
        DimensionName.SECTIONS: 0.5,
        DimensionName.KEYWORDS: 0.5,
        DimensionName.CONTENT: 0.0,
        DimensionName.CONTACT_LENGTH: 0.0,
    }
    with pytest.raises(ValidationError):
        ATSCheckResult(overall_score=80, dimensions=_valid_dimensions(bad), flags=DocumentFlags())


def test_missing_dimension_rejected():
    dims = _valid_dimensions()[:4]
    with pytest.raises(ValidationError):
        ATSCheckResult(overall_score=80, dimensions=dims, flags=DocumentFlags())


def test_score_out_of_range_rejected():
    with pytest.raises(ValidationError):
        ATSDimension(name=DimensionName.READABILITY, score=120, weight=0.2)


def test_is_estimate_cannot_be_false():
    with pytest.raises(ValidationError):
        ATSCheckResult(
            overall_score=80,
            dimensions=_valid_dimensions(),
            flags=DocumentFlags(),
            is_estimate=False,
        )


def test_issue_code_format_enforced():
    from app.ats.schema import ATSIssue, Severity

    with pytest.raises(ValidationError):
        ATSIssue(code="scanned pdf", severity=Severity.WARNING,
                 dimension=DimensionName.READABILITY, message="x")