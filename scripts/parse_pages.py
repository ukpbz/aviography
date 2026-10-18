import re
import subprocess
import urllib.parse
import os
import json

with open("/tmp/aviography_archive.html") as f:
    html = f.read()

# Parse the menu structure
# Structure:
# Top-level: Home, Photos, Contact Us
# Under Photos:
#   - Aircraft
#       - Airbus: A319, A320, A321, A330, A350, A380, A400M Atlas
#       - Boeing: 727, 737, 747, 757, 767, 777, 787
#   - Airshows
#   - Military Bases
#       - UK Military Bases
#       - European Military Bases
#   - Civil Airports
#       - UK Airports
#       - European Airports
#       - US Airports
#       - Other Airports
#   - Museums
#       - UK Museums
#       - US Museums
#       - Euro and Other Museums
#   - Aircraft Carriers
#       - CVN-71 USS Theodore Roosevelt
#       - CVN-77 USS George H. W. Bush

# Find all <li> items with links
pattern = r"<li[^>]*id=\"(menu-item-\d+)\"[^>]*class=\"([^\"]*)\"[^>]*>\s*<a[^>]*href=\"([^\"]*)\"[^>]*>(.*?)</a>"
matches = re.findall(pattern, html, re.DOTALL)

# Collect page URLs to scrape
page_items = []
for mid, cls, href, text in matches:
    clean_text = re.sub(r"<[^>]+>", " ", text).strip()
    clean_text = " ".join(clean_text.split())
    if "page_id=" in href:
        page_items.append((clean_text, href))

print(f"Found {len(page_items)} target pages to scrape images for.")
with open("/tmp/aviography_pages.json", "w") as f:
    json.dump(page_items, f, indent=2)
