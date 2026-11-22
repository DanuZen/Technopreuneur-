"""Tampilkan hasil ekstraksi satu PDF. Untuk pemeriksaan manual, bukan bagian dari tes."""
import sys
from pathlib import Path

from app.ingestion.dispatcher import extract


def main(path: str) -> None:
    doc = extract(Path(path))
    print(f"halaman: {doc.page_count} | blok: {len(doc.blocks)} | scan: {doc.is_scanned} | "
          f"tabel: {doc.has_tables} | gambar: {doc.has_images} | kolom ganda: {doc.has_multi_column}")
    print("-" * 60)
    for i, block in enumerate(doc.blocks):
        print(f"{i:3d} p{block.page} {block.region:6s} x={block.x0:6.1f} y={block.y0:6.1f} | {block.text}")

if __name__ == "__main__":
    main(sys.argv[1])