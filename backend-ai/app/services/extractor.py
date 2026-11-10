import io
from pypdf import PdfReader
from docx import Document


class DocumentExtractor:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        """
        Mengekstrak teks dari file PDF.
        Mengembalikan teks string atau string kosong bila PDF hasil scan gambar.
        """
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_pages.append(text)
        return "\n".join(extracted_pages).strip()

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        """
        Mengekstrak teks dari file DOCX (Word).
        """
        doc = Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text]
        return "\n".join(paragraphs).strip()

    @classmethod
    def extract_text(cls, filename: str, file_bytes: bytes) -> str:
        lower_name = filename.lower()
        if lower_name.endswith(".pdf"):
            return cls.extract_text_from_pdf(file_bytes)
        elif lower_name.endswith(".docx"):
            return cls.extract_text_from_docx(file_bytes)
        else:
            raise ValueError(f"Format file tidak didukung: {filename}. Hanya menerima .pdf dan .docx")

