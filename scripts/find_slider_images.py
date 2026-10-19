import subprocess
import re

cmd = ["curl", "-sL", "-m", "20", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/"]
html = subprocess.check_output(cmd).decode("utf-8", errors="ignore")

# Find scripts containing slide array or image URLs
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
for s in scripts:
    if "slide" in s.lower() or "image" in s.lower() or "background" in s.lower() or "supersized" in s.lower():
        print("--- FOUND SCRIPT ---")
        for line in s.splitlines():
            if any(k in line.lower() for k in ["slides", "image", "jpg", "png", "title", "url"]):
                print(" ", line.strip()[:140])
