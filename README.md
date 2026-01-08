# 📝 AI-Powered Cover Letter Generator

An intelligent, resume-aware web application built with **Python** and **Streamlit**. This tool bridges the gap between your professional background and job requirements by generating tailored, high-impact cover letters in seconds.

---

## 🚀 Features

* **📄 Dual Input Modes:** Upload your resume as a PDF or manually enter your professional details.
* **🧠 Smart Skill Matching:** Intelligently identifies overlaps between your resume and the job description.
* **🎯 Automated Relevance:** Prioritizes and selects the most impactful skills for the specific role.
* **✍️ Dynamic Tones:** Choose from various writing styles (Professional, Concise, Results-Focused, etc.).
* **🧹 Built-in Polishing:** Automatic grammar and language enhancement for a flawless first impression.
* **🛠 Interactive Editor:** Refine the generated text directly within the app.
* **📥 Instant Export:** Download your customized cover letter, ready to send.

---

## 🧩 How It Works



1.  **Input:** Upload your resume (PDF) or fill in your details manually.
2.  **Context:** Paste the target company’s job description.
3.  **Customization:** Select your preferred professional tone.
4.  **Processing:** * The app extracts text and parses resume data.
    * Regex-based NLP matches your skills to the JD requirements.
    * Language models/templates generate the draft.
    * Grammar polishing is applied automatically.
5.  **Output:** Edit the result and download.

---

## 🖥️ Tech Stack

* **Frontend/UI:** [Streamlit](https://streamlit.io/)
* **PDF Processing:** `PyPDF2`
* **Grammar Engine:** `LanguageTool`
* **NLP & Logic:** Python Regex-based matching
* **Data Handling:** JSON (for templates)

---

## 📂 Project Structure

```text
cover_letter_gen2/
 ├ templates/
 │   └ templates.json           # Cover letter style definitions
 ├ cover_letter_app.py          # Main Streamlit UI entry point
 ├ cover_letter_generator.py    # Core generation logic
 ├ grammar_polisher.py          # Language enhancement module
 ├ resume_parser.py             # PDF text extraction
 ├ skill_matcher.py             # NLP/Regex matching engine
 ├ README.md
 └ requirements.txt
