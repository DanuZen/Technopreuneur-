from app.matching.keywords import extract_skills


def test_synonyms_map_to_canonical():
    assert "postgresql" in extract_skills("Pengalaman dengan Postgres dan Docker")


def test_node_variants_detected():
    assert "nodejs" in extract_skills("Membangun API dengan Node.js")
    assert "nodejs" in extract_skills("backend nodejs")


def test_java_not_matched_inside_javascript():
    skills = extract_skills("Membangun antarmuka dengan JavaScript")
    assert "javascript" in skills
    assert "java" not in skills


def test_bahasa_indonesia_terms():
    assert "project_management" in extract_skills("Berpengalaman dalam manajemen proyek")
    assert "machine_learning" in extract_skills("Dasar pembelajaran mesin")


def test_empty_text_gives_no_skills():
    assert extract_skills("") == set()


def test_skill_map_has_no_duplicate_terms_across_skills():
    from app.matching.keywords import load_skill_map
    seen: dict[str, str] = {}
    for canon, syns in load_skill_map().items():
        for s in syns:
            assert s not in seen, f"'{s}' muncul di {seen[s]} dan {canon}"
            seen[s] = canon
