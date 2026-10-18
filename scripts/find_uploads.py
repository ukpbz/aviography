import re

with open("/tmp/aviography_archive.html") as f:
    html = f.read()

matches = re.findall(r'https?://[^\s"\'()<>]+\.(?:jpg|png|jpeg)', html, re.I)
unique_imgs = sorted(set(matches))
print(f"Total image URLs found in aviography_archive.html: {len(unique_imgs)}")
for u in unique_imgs:
    if "wp-content/uploads" in u:
        print(" ", u)
