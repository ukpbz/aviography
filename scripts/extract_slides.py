import subprocess
import re

cmd = ["curl", "-sL", "-m", "20", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/"]
html = subprocess.check_output(cmd).decode("utf-8", errors="ignore")

slides_match = re.search(r'slides\s*:\s*\[(.*?)\]', html, re.DOTALL)
if slides_match:
    print("Found slides block:")
    print(slides_match.group(0))
else:
    print("No slides block found")
