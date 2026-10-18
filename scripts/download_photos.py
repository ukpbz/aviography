import subprocess
import re
import urllib.parse
import os
import json

os.makedirs("public/photos/aviation", exist_ok=True)
os.makedirs("public/photos/city", exist_ok=True)
os.makedirs("public/photos/wildlife", exist_ok=True)
os.makedirs("public/photos/cars", exist_ok=True)
os.makedirs("public/photos/highlights", exist_ok=True)
os.makedirs("public/photos/about", exist_ok=True)

# Also fetch profile picture
subprocess.run(["curl", "-s", "-L", "-A", "Mozilla/5.0", "http://www.pbrown.com/AboutMe/files/me_young.jpg", "-o", "public/photos/about/paul_brown.jpg"])

albums = [
    {
        "category": "aviation",
        "categoryName": "Aviation",
        "url": "http://www.pbrown.com/photos/photos-2/",
        "folder": "public/photos/aviation",
        "webPath": "/photos/aviation",
        "description": "High-octane flight displays, fast jets, heavy transports, and airshow photography from RIAT, RAF Coningsby, RNAS Yeovilton, Heathrow, and across the globe."
    },
    {
        "category": "wildlife",
        "categoryName": "Wildlife",
        "url": "http://www.pbrown.com/photos/photos-3/",
        "folder": "public/photos/wildlife",
        "webPath": "/photos/wildlife",
        "description": "Portraits of nature in motion—raptors, kingfishers, native British fauna, and avian species captured with pin-sharp optics."
    },
    {
        "category": "city-life",
        "categoryName": "City life",
        "url": "http://www.pbrown.com/photos/photos-4/",
        "folder": "public/photos/city",
        "webPath": "/photos/city",
        "description": "Urban geometry, architectural monuments, street energy, and skyline vistas across New York City and global metropolises."
    },
    {
        "category": "my-cars",
        "categoryName": "My Cars",
        "url": "http://www.pbrown.com/photos/photos-5/",
        "folder": "public/photos/cars",
        "webPath": "/photos/cars",
        "description": "Automotive passion—classic Jaguars, rugged 4x4s, and sports tourers through the lens of meticulous mechanical appreciation."
    },
    {
        "category": "highlights",
        "categoryName": "Highlights",
        "url": "http://www.pbrown.com/photos/",
        "folder": "public/photos/highlights",
        "webPath": "/photos/highlights",
        "description": "Hand-picked showcase of definitive portfolio captures, spanning legendary aerial displays to intimate wildlife studies."
    }
]

all_photos = []
photo_counter = 1

def clean_title(alt):
    name = alt
    if "." in name:
        name = name.rsplit(".", 1)[0]
    name = name.replace("_", " ")
    return name

# Better descriptive aircraft tags based on filename
def enrich_aviation(title, alt):
    alt_lower = alt.lower()
    tag = "Aircraft"
    location = "Airshow / Field"
    
    if "yeovilton" in alt_lower:
        tag = "Fleet Air Arm / Royal Navy"
        location = "RNAS Yeovilton Air Day"
    elif "riat" in alt_lower:
        tag = "Military Fast Jet / Display"
        location = "Royal International Air Tattoo (RAF Fairford)"
    elif "lhr" in alt_lower or "heathrow" in alt_lower:
        tag = "Commercial Airliner"
        location = "London Heathrow Airport (LHR)"
    elif "mesa" in alt_lower:
        tag = "Warbird / US Aviation"
        location = "Mesa Falcon Field, Arizona"
    elif "fairford" in alt_lower:
        tag = "Strategic Aviation"
        location = "RAF Fairford"
    elif "cvn71" in alt_lower:
        tag = "Naval Aviation"
        location = "USS Theodore Roosevelt (CVN-71)"
    elif "coningsby" in alt_lower:
        tag = "Eurofighter Typhoon / RAF"
        location = "RAF Coningsby, Lincolnshire"
    elif "swissaf" in alt_lower or "f18" in alt_lower:
        tag = "Swiss Air Force F/A-18 Hornet"
        location = "Alpine Flight Display"
    elif "arrow" in alt_lower:
        tag = "RAF Red Arrows (Hawk T1)"
        location = "RAF Display Squadron"
        
    return tag, location

for alb in albums:
    cat_name = alb["categoryName"]
    html = subprocess.check_output(["curl", "-s", "-L", "-A", "Mozilla/5.0", alb["url"]]).decode("utf-8", errors="ignore")
    items = re.findall(r'<a href="([^"]+full\.html)"[^>]*><img src="([^"]+thumb\.jpg)"[^>]*alt="([^"]+)"', html)
    print(f"Downloading {len(items)} images for {cat_name}...")
    
    for full_html, thumb, alt in items:
        full_jpg_url = urllib.parse.urljoin(alb["url"], full_html.replace("-full.html", "-full.jpg"))
        # Some had uppercase JPG
        base_name = os.path.basename(full_html).replace("-full.html", "")
        local_filename = f"{alb['category']}_{base_name}.jpg"
        local_filepath = os.path.join(alb["folder"], local_filename)
        
        # Download with curl
        subprocess.run(["curl", "-s", "-L", "-A", "Mozilla/5.0", full_jpg_url, "-o", local_filepath])
        
        # If file is empty or small, try uppercase .JPG
        if not os.path.exists(local_filepath) or os.path.getsize(local_filepath) < 1000:
            full_jpg_url_upper = urllib.parse.urljoin(alb["url"], full_html.replace("-full.html", "-full.JPG"))
            subprocess.run(["curl", "-s", "-L", "-A", "Mozilla/5.0", full_jpg_url_upper, "-o", local_filepath])
            
        if os.path.exists(local_filepath) and os.path.getsize(local_filepath) > 1000:
            file_size = os.path.getsize(local_filepath)
            title = clean_title(alt)
            tag = alb["categoryName"]
            location = "United Kingdom"
            if alb["category"] == "aviation":
                tag, location = enrich_aviation(title, alt)
            elif alb["category"] == "city-life":
                tag = "Metropolitan Architecture"
                location = "New York City, NY"
            elif alb["category"] == "wildlife":
                tag = "Natural Fauna"
                location = "British Countryside & Wetlands"
            elif alb["category"] == "my-cars":
                tag = "Classic & Sports Marques"
                location = "Automotive Collection"
            elif alb["category"] == "highlights":
                if "F18" in alt or "Arrow" in alt:
                    tag, location = enrich_aviation(title, alt)
                else:
                    tag = "Curated Selection"
                    location = "UK / International"

            all_photos.append({
                "id": f"photo-{photo_counter:03d}",
                "title": title,
                "originalFilename": alt,
                "category": alb["category"],
                "categoryName": alb["categoryName"],
                "src": f"{alb['webPath']}/{local_filename}",
                "tag": tag,
                "location": location,
                "aspectRatio": "3:2",
                "width": 900,
                "height": 600,
                "featured": (alb["category"] == "highlights" or "RIAT" in alt or "Yeovilton" in alt or "Coningsby" in alt),
                "dateCaptured": "2014-2015",
                "equipment": "Canon EOS / L-Series Telephoto Optics"
            })
            photo_counter += 1
            print(f"  [OK] {alt} -> {local_filepath} ({file_size} bytes)")
        else:
            print(f"  [FAILED] {full_jpg_url}")

with open("photos_manifest.json", "w") as f:
    json.dump(all_photos, f, indent=2)

print(f"\nTotal downloaded photos: {len(all_photos)}")
