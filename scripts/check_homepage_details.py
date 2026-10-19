import subprocess
import re

cmd = ["curl", "-sL", "-m", "20", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/"]
html = subprocess.check_output(cmd).decode("utf-8", errors="ignore")

# Find all links in the main navigation
nav_match = re.search(r'<div class="menu-[^"]*">(.*?)</div>', html, re.DOTALL)
if not nav_match:
    nav_match = re.search(r'<ul[^>]+id="menu-[^"]*"[^>]*>(.*?)</ul>', html, re.DOTALL)

# Let's find all li and a elements
menus = re.findall(r'<li[^>]*><a[^>]*href=["\']([^"\']*)["\'][^>]*>([^<]+)</a>', html)
print(f"Total menu items: {len(menus)}")
for href, label in menus:
    print(f"  {label.strip()} -> {href}")

# Let's inspect slider or scrolling images
print("\n--- Looking for slider / carousel / scroller ---")
for kw in ["slider", "carousel", "swiper", "cycle", "scroll", "rev_slider", "layerslider", "meteor-slides", "soliloquy", "nivo", "flexslider", "hero", "header"]:
    matches = re.findall(rf'class=["\'][^"\']*{kw}[^"\']*["\']', html, re.I)
    if matches:
        print(f"Found class with {kw}: {matches[:3]}")

# Look for image tags
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html)
print(f"\nTotal <img> tags: {len(imgs)}")
for im in imgs[:20]:
    print(" ", im)
