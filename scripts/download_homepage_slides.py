import subprocess
import os
import re

os.makedirs("public/photos/homepage_slides", exist_ok=True)

slide_urls = [
    ("slide_01_a380.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/2013/04/Singapore-A380-Large.jpg"),
    ("slide_02_bg10.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/10.jpg"),
    ("slide_03_bg9.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/9.jpg"),
    ("slide_04_bg8.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/8.jpg"),
    ("slide_05_bg7.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/7.jpg"),
    ("slide_06_bg6.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/6.jpg"),
    ("slide_07_bg5.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/5.jpg"),
    ("slide_08_bg3.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/3.jpg"),
    ("slide_09_bg2.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/2.jpg"),
    ("slide_10_bg11.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/11.jpg"),
    ("slide_11_bg1.jpg", "http://web.archive.org/web/20260216071728im_/https://aviography.co.uk/wp-content/uploads/background/1.jpg"),
]

for filename, url in slide_urls:
    dest = os.path.join("public/photos/homepage_slides", filename)
    print(f"Downloading {filename} from {url}...")
    subprocess.run(["curl", "-sL", "-m", "25", url, "-o", dest])
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"  [OK] {filename} ({os.path.getsize(dest)} bytes)")
    else:
        print(f"  [FAILED/EMPTY] {filename}")
