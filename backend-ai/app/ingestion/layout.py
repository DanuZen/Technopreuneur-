GAP_MIN_PT = 10.0            # celah minimum antar kolom (poin)
ROW_TOLERANCE_PT = 3.0       # kata dianggap satu baris jika selisih top kecil
MIN_BOTH_SIDE_ROWS = 3       # minimal baris yang punya teks di kiri dan kanan
MIN_BOTH_SIDE_RATIO = 0.25   # minimal proporsi baris tersebut


def group_lines(words: list[dict]) -> list[list[dict]]:
    lines: list[list[dict]] = []
    for word in sorted(words, key=lambda w: (w["top"], w["x0"])):
        if lines and abs(word["top"] - lines[-1][0]["top"]) <= ROW_TOLERANCE_PT:
            lines[-1].append(word)
        else:
            lines.append([word])
    return lines


def detect_column_split(words: list[dict], page_width: float) -> float | None:
    """Mengembalikan posisi x pemisah dua kolom, atau None jika satu kolom."""
    if len(words) < 10:
        return None

    # Celah antar kata di seluruh halaman. Celah besar di tengah = kemungkinan gutter.
    spans = sorted((w["x0"], w["x1"]) for w in words)
    gaps: list[tuple[float, float]] = []
    reach = spans[0][1]
    for x0, x1 in spans[1:]:
        if x0 > reach:
            gaps.append((reach, x0))
        reach = max(reach, x1)

    middle = [
        (a, b) for a, b in gaps
        if b - a >= GAP_MIN_PT and 0.25 * page_width <= (a + b) / 2 <= 0.75 * page_width
    ]
    if not middle:
        return None

    a, b = max(middle, key=lambda g: g[1] - g[0])
    split = (a + b) / 2

    # Verifikasi: harus ada baris yang punya teks di kedua sisi, bukan hanya celah kosong
    rows = group_lines(words)
    both = 0
    for row in rows:
        left = [w for w in row if w["x1"] <= split]
        right = [w for w in row if w["x0"] >= split]
        if left and len(right) >= 2:
            both += 1

    if both >= MIN_BOTH_SIDE_ROWS and both / len(rows) >= MIN_BOTH_SIDE_RATIO:
        return split
    return None