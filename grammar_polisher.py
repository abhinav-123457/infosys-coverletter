import language_tool_python

tool = language_tool_python.LanguageTool('en-US')

def polish_paragraph(paragraph: str) -> str:
    matches = tool.check(paragraph)
    corrected = language_tool_python.utils.correct(paragraph, matches)
    return corrected
