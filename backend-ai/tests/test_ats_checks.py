from app.ats.checks import (
    check_contact,
    check_decorative_symbols,
    check_length,
    check_scanned,
    check_tables,
    run_document_checks,
)
from app.ats.schema import DimensionName
from app.ingestion.models import ExtractedDocument, TextBlock


def _doc(text_blocks, **flags):
    doc = ExtractedDocument(
        blocks=[TextBlock(text=t, page=1, region=r) for t, r in text_blocks],
        page_count=flags.pop("page_count", 1),
        **flags,
    )
    return doc


def test_scanned_flag_produces_critical_issue():
    doc = _doc([], is_scanned=True)
    codes = [i.code for i in check_scanned(doc)]
    assert codes == ["SCANNED_PDF"]


def test_table_flag_produces_warning():
    doc = _doc([("Node.js", "table")], has_tables=True)
    issues = check_tables(doc)
    assert issues and issues[0].code == "TABLE_DETECTED"


def test_email_in_body_no_issue():
    doc = _doc([("Budi Santoso", "body"), ("budi@example.com", "body")])
    assert not [i for i in check_contact(doc) if i.code == "EMAIL_MISSING"]


def test_email_only_in_header_flagged():
    doc = _doc([("Budi Santoso", "body"), ("budi@example.com", "header")])
    codes = [i.code for i in check_contact(doc)]
    assert "CONTACT_IN_HEADER_FOOTER" in codes


def test_missing_email_flagged():
    doc = _doc([("Budi Santoso", "body")])
    codes = [i.code for i in check_contact(doc)]
    assert "EMAIL_MISSING" in codes


def test_decorative_symbol_detected():
    issues = check_decorative_symbols("Node.js ★★★★☆")
    assert issues and issues[0].code == "DECORATIVE_SYMBOLS"


def test_short_cv_flagged():
    doc = _doc([("Budi Santoso budi@example.com", "body")])
    codes = [i.code for i in check_length(doc)]
    assert "TOO_SHORT" in codes


def test_all_issues_use_valid_dimensions():
    doc = _doc([("Budi", "body")], is_scanned=True, has_tables=True)
    for issue in run_document_checks(doc):
        assert issue.dimension in set(DimensionName)