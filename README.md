README.md
# Professional Cover Letter Generator

A Streamlit-based application to generate professional cover letters from your resume and a job description. The app extracts relevant information from your resume, matches skills to the job description, and fills pre-defined templates with your data. It also allows tone selection and optional grammar polishing.

---

## **Features**

- **Resume Parsing:** Upload PDF resumes; extracts name, email, phone, LinkedIn, GitHub, and skills.
- **Job Description Skill Matching:** Automatically matches relevant skills from your resume to the job description.
- **Template & Tone Selection:** Choose from 10 professional templates (tones) for the cover letter.
- **Editable Output:** After generation, edit the cover letter manually.
- **Grammar Polishing:** Polishes the last paragraph using either LanguageTool or OpenAI (if configured).
- **Downloadable Output:** Download your cover letter as a `.txt` file.

---

## **Project Structure**



cover_letter_gen2/
│
├─ templates/
│ └─ templates.json # All templates with different tones
├─ resume_parser.py # Extracts data from resumes
├─ skill_matcher.py # Extracts and matches skills from resume and JD
├─ cover_letter_generator.py# Generates the cover letter and optionally polishes
├─ cover_letter_app.py # Streamlit app interface
├─ grammar_polisher.py # Polishes grammar for the last paragraph
└─ README.md


---

## **How to Run**

1. **Clone the repository**:
```bash
git clone <repo-url>
cd cover_letter_gen2


Set up Python environment (recommended: venv):

python -m venv venv
venv\Scripts\activate    # Windows
# source venv/bin/activate  # Linux/Mac


Install dependencies:

pip install -r requirements.txt


Run Streamlit app:

streamlit run cover_letter_app.py


Upload Resume, paste Job Description, fill optional Job Details, choose Template/Tone, and click Generate.

Notes

Grammar polishing uses either:

LanguageTool (requires Java installed)

The skill matcher extracts top 4–5 relevant skills from your resume and job description.

If certain fields (like Hiring Manager or Salutation) are missing, defaults like "Hiring Team" and "Sir/Madam" are used.

Templates are editable in templates/templates.json.

Dependencies

Python 3.10+

Streamlit

PyPDF2

language-tool-python (optional for grammar polishing)

openai (optional for AI polish)