import pdfplumber

def extract_text_from_pdf(file_obj) -> str:
    """
    Extracts text from a PDF file-like object.
    Returns a single combined string.
    """
    text_parts = []
    with pdfplumber.open(file_obj) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_parts.append(page_text)

    return "\n".join(text_parts)
