from app.matching.keywords import label_for, load_skill_labels, load_skill_map
from app.matching.scorer import build_reasons


def test_every_skill_has_a_label():
    missing = set(load_skill_map()) - set(load_skill_labels())
    assert not missing, f"belum ada label untuk: {sorted(missing)}"


def test_no_orphan_labels():
    orphan = set(load_skill_labels()) - set(load_skill_map())
    assert not orphan, f"label tanpa skill di skills.yaml: {sorted(orphan)}"


def test_label_is_human_readable():
    assert label_for("nodejs") == "Node.js"
    assert label_for("postgresql") == "PostgreSQL"
    assert label_for("rest_api") == "REST API"


def test_unknown_skill_falls_back_to_canon():
    assert label_for("skill_yang_tidak_ada") == "skill_yang_tidak_ada"


def test_reason_text_uses_label():
    cv = "Menggunakan Docker untuk deployment."
    reasons = build_reasons(cv, ["docker"])
    assert reasons[0]["text"] == "Memiliki pengalaman dengan Docker"