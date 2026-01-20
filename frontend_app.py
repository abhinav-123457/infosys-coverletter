import streamlit as st
import pdfplumber

# ---------- Page Settings ----------
st.set_page_config(
    page_title="AI Cover Letter Generator",
    page_icon="📝",
    layout="centered"
)

# ---------- Styling ----------
st.markdown("""
<style>
.title {
    font-size:36px;
    font-weight:bold;
    text-align:center;
}
.subtitle {
    text-align:center;
    color:gray;
}
.box {
    padding:20px;
    border-radius:10px;
    background:#f5f7fa;
}
</style>
""", unsafe_allow_html=True)

# ---------- Header ----------
st.markdown("<div class='title'>AI Cover Letter Generator</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Generate personalized cover letters easily</div>", unsafe_allow_html=True)

st.write("")

# ---------- Resume Upload Section ----------
st.markdown("<div class='box'>", unsafe_allow_html=True)
st.subheader("📄 Upload Your Resume")
uploaded_file = st.file_uploader("Upload resume (PDF only)", type=["pdf"])
st.markdown("</div>", unsafe_allow_html=True)

st.write("")

# ---------- Job Description Section ----------
st.markdown("<div class='box'>", unsafe_allow_html=True)
st.subheader("💼 Enter Job Description")
job_desc = st.text_area("Paste job description here", height=120)
st.markdown("</div>", unsafe_allow_html=True)

st.write("")

# ---------- Tone Selection ----------
st.subheader("🎯 Select Tone")
tone = st.selectbox("Choose tone for cover letter", 
                    ["Formal", "Professional", "Enthusiastic"])

# ---------- Extract Resume Text ----------
resume_text = ""

if uploaded_file:
    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            resume_text += page.extract_text() or ""

# ---------- Show Extracted Text ----------
if resume_text:
    st.markdown("<div class='box'>", unsafe_allow_html=True)
    st.subheader("🔍 Extracted Resume Content")
    st.text_area("Resume Text", resume_text, height=250)
    st.markdown("</div>", unsafe_allow_html=True)

st.write("")

# ---------- Generate Button ----------
if st.button("✨ Generate Cover Letter"):

    if resume_text and job_desc:
        st.success("Great! Backend will generate cover letter here in next step 🚀")

        st.subheader("Generated Cover Letter")
        st.text_area(
            "Output",
            "This area will display AI generated cover letter once backend is connected.",
            height=300
        )

    else:
        st.warning("Please upload resume and enter job description first.")

