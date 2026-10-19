import subprocess
import re

try:
    cmd = ["curl", "-sL", "-m", "20", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/"]
    html = subprocess.check_output(cmd).decode("utf-8", errors="ignore")
    print("HTML length:", len(html))

    title = re.search(r"<title>([^<]+)</title>", html)
    print("Title:", title.group(1) if title else "None")

    # Find navigation menu structure
    nav_blocks = re.findall(r'<nav[^>]*>.*?</nav>|<ul[^>]*menu[^>]*>.*?</ul>', html, re.DOTALL | re.I)
    print("Nav blocks count:", len(nav_blocks))
    for nb in nav_blocks[:2]:
        links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>([^<]+)</a>', nb)
        print("Menu links:", links)

    # Find images, especially slider or banner or scrolling images
    imgs = re.findall(r'(?:src|href|data-url|background-image:[^;]+url\()\(?["\']?(http[^\'")\s]+\.(?:jpg|jpeg|png))', html, re.I)
    print("Images found:", len(imgs))
    for im in sorted(set(imgs))[:40]:
        print("IMG:", im)

except Exception as e:
    print("Exception:", e)
