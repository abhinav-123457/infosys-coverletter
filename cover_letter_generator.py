import json, datetime
from resume_parser import extract_resume_data
from skill_matcher import match_skills

try:
    import language_tool_python
    tool = language_tool_python.LanguageTool('en-US')
    USE_LT = True
except:
    USE_LT = False

TEMPLATE_PATH = "templates/templates.json"

def polish_text(text):
    if USE_LT:
        matches = tool.check(text)
        return language_tool_python.utils.correct(text, matches)
    return text

def generate_cover_letter(resume_path, jd_text, form, template_index):
    resume = extract_resume_data(resume_path)

    raw_text = resume.get("raw_text","")
    matched_skills = match_skills(raw_text, jd_text)

    skills = ", ".join(matched_skills)

    today = datetime.date.today().strftime("%d %B %Y")

    header = "\n".join(filter(None,[
        form.get("full_name"),
        form.get("email"),
        form.get("phone"),
        form.get("linkedin"),
        form.get("github")
    ])) + f"\n\n{today}"

    tpl = json.load(open(TEMPLATE_PATH,encoding="utf-8"))["templates"][template_index]["body"]

    data = {
        "Header": header,
        "ToBlock": form.get("hiring_team") or "Hiring Team\n" + form.get("company",""),
        "Salutation": form.get("salutation") or "Sir/Madam",
        "Role": form.get("role",""),
        "Company": form.get("company",""),
        "Skills": skills,
        "Achievements": form.get("achievements",""),
        "FullName": form.get("full_name","")
    }

    for k,v in data.items():
        tpl = tpl.replace("{"+k+"}", v)

    paras = tpl.strip().split("\n\n")
    paras[-1] = polish_text(paras[-1])

    return "\n\n".join(paras)
