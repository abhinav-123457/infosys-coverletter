import re
from PyPDF2 import PdfReader

def extract_resume_data(file_path=None):
    text = ""

    if file_path:
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except:
            pass

    return {
        "raw_text": text,
        "name": "",
        "email": extract(r"[\w\.-]+@[\w\.-]+", text),
        "phone": extract(r"\+?\d[\d\s-]{7,}\d", text),
        "linkedin": extract(r"(https?://)?(www\.)?linkedin\.com/\S+", text),
        "github": extract(r"(https?://)?(www\.)?github\.com/\S+", text)
    }

def extract(pattern, text):
    m = re.search(pattern, text)
    return m.group(0).strip() if m else ""
