import streamlit as st
import json
from cover_letter_generator import generate_cover_letter
from resume_parser import extract_resume_data

st.set_page_config(page_title="Cover Letter Generator", layout="centered")
st.title("Professional Cover Letter Generator")

# Load templates
with open("templates/templates.json", encoding="utf-8") as f:
    TEMPLATES = json.load(f)["templates"]

tone_names = [t["template_name"] for t in TEMPLATES]

# ========== MODE ==========
st.header("Select Input Mode")
mode = st.radio("Choose how you want to proceed:", ["Upload Resume & Auto-Fill", "Enter Details Manually"])

# ========== JD ==========
st.header("Paste Job Description")
job_desc = st.text_area("Job Description")

# ========== TONE ==========
st.header("Select Writing Tone")
tone_choice = st.selectbox("Choose Tone / Template", tone_names)
template_index = tone_names.index(tone_choice)

# ========== USER DETAILS ==========
st.header("Your Details")

if mode == "Upload Resume & Auto-Fill":
    resume_file = st.file_uploader("Upload PDF Resume", type=["pdf"])

    if resume_file:
        with open("temp_resume.pdf", "wb") as f:
            f.write(resume_file.read())
        extracted = extract_resume_data("temp_resume.pdf")
    else:
        extracted = {}

    full_name = st.text_input("Full Name", extracted.get("name",""))
    email = st.text_input("Email", extracted.get("email",""))
    phone = st.text_input("Phone", extracted.get("phone",""))
    linkedin = st.text_input("LinkedIn", extracted.get("linkedin",""))
    github = st.text_input("GitHub", extracted.get("github",""))
else:
    full_name = st.text_input("Full Name")
    email = st.text_input("Email")
    phone = st.text_input("Phone")
    linkedin = st.text_input("LinkedIn")
    github = st.text_input("GitHub")

# ========== JOB DETAILS ==========
st.header("Job Details")
company = st.text_input("Company Name")
role = st.text_input("Role / Job Title")
hiring_team = st.text_input("Hiring Manager / Hiring Team (Leave Blank if Unsure)" )
salutation = st.text_input("Salutation (Sir/Madam/Name) (Leave Blank if Unsure)")
achievements = st.text_area("Key Achievements (comma-separated)")

# ========== GENERATE ==========
st.header("Generate")

if st.button("Generate Cover Letter"):
    if mode == "Upload Resume & Auto-Fill" and not resume_file:
        st.error("Please upload your resume.")
    else:
        form_data = {
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "linkedin": linkedin,
            "github": github,
            "company": company,
            "role": role,
            "hiring_team": hiring_team,
            "salutation": salutation,
            "achievements": achievements
        }

        letter = generate_cover_letter(
            "temp_resume.pdf" if mode == "Upload Resume & Auto-Fill" else None,
            job_desc,
            form_data,
            template_index
        )

        st.header("Editable Output")
        final = st.text_area("Edit your cover letter if needed", value=letter, height=520)
        st.download_button("Download Cover Letter", final, file_name="cover_letter.txt")
