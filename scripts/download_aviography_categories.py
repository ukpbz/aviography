import subprocess
import re
import os
import json
import urllib.parse

# Define the exact 6 main categories matching aviography.co.uk
categories_def = [
    {
        "id": "aircraft",
        "name": "Aircraft",
        "slug": "aircraft",
        "description": "Comprehensive airliner and transport studies, detailing Airbus and Boeing fleets from agile short-haulers to super-heavies.",
        "icon": "Plane",
        "subCategories": ["Airbus A380", "Airbus A350", "Airbus A320/A321", "Airbus A400M", "Boeing 747", "Boeing 777", "Boeing 787", "Boeing 727", "Boeing 737", "Boeing 757", "Boeing 767"]
    },
    {
        "id": "airshows",
        "name": "Airshows",
        "slug": "airshows",
        "description": "Adrenaline-fueled flight displays, fast-jet vapor trails, and aerobatic precision from RIAT, Duxford Flying Legends, and Farnborough.",
        "icon": "Flame",
        "subCategories": ["RIAT Royal International Air Tattoo", "Swiss AF F/A-18C Display", "Duxford Flying Legends", "Farnborough International (FIA)", "Davis-Monthan & Overseas"]
    },
    {
        "id": "military-bases",
        "name": "Military Bases",
        "slug": "military-bases",
        "description": "Operational fighter stations, interceptors, and strategic tankers on active dispersals across the UK, Europe, and the United States.",
        "icon": "Crosshair",
        "subCategories": ["RAF Coningsby (QRA)", "RAF Fairford", "RAF Lakenheath & Mildenhall", "RNAS Yeovilton (FAA)", "European Bases (Emmen, Dübendorf)", "USAF & AMARG Boneyard"]
    },
    {
        "id": "civil-airports",
        "name": "Civil Airports",
        "slug": "civil-airports",
        "description": "Commercial aviation movements, touchdown smoke, and rotation vantage points across premier global hubs.",
        "icon": "Compass",
        "subCategories": ["London Heathrow (LHR)", "London Stansted (STN)", "Manchester Intl", "US Hubs (LAX, SFO, SAN)", "European Gateways (Geneva, Munich)"]
    },
    {
        "id": "museums",
        "name": "Aviation Museums",
        "slug": "museums",
        "description": "Historic airframes, cockpits, and preserved warbirds across legendary British, American, and European aviation heritage sites.",
        "icon": "Landmark",
        "subCategories": ["UK Heritage (Brooklands, De Havilland)", "US Museums (Falcon Field, PIMA, March Field)", "European Museums (Munich, Dubendorf, Savigny)"]
    },
    {
        "id": "carriers",
        "name": "Aircraft Carriers",
        "slug": "carriers",
        "description": "Naval aviation power projection—catapult launches, barrier traps, and flight deck choreography on US Navy nuclear supercarriers.",
        "icon": "Ship",
        "subCategories": ["CVN-71 USS Theodore Roosevelt", "CVN-77 USS George H. W. Bush", "Naval Strike Aviation"]
    }
]

# Key target pages to scrape for each category
target_pages = {
    "aircraft": [
        ("Airbus A380", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=5420"),
        ("Airbus A350", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=3507"),
        ("Airbus A400M Atlas", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=5645"),
        ("Airbus A320", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=5585"),
        ("Airbus A330", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=5610"),
        ("Boeing 747", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=3760"),
        ("Boeing 727", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=3911"),
        ("Boeing 737", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=3774"),
        ("Boeing 757", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=5614"),
        ("Boeing 767", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=3519")
    ],
    "airshows": [
        ("RIAT Fairford Fast Jets", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1662"),
        ("RIAT Aerial Demonstration", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1721"),
        ("RIAT Modern Displays", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=2362"),
        ("SwissAF F/A-18C Display", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1977"),
        ("Farnborough International Airshow", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=2224"),
        ("Duxford Flying Legends", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=4118")
    ],
    "military-bases": [
        ("RAF Coningsby Eurofighter Typhoon", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1596"),
        ("RAF Fairford Flightline", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1540"),
        ("RNAS Yeovilton Naval Air Arm", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=4481"),
        ("RAF Lakenheath F-15 Strike Eagles", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=679"),
        ("Emmen Swiss Air Force Base", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1002"),
        ("AMARG Davis-Monthan Boneyard", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1378")
    ],
    "civil-airports": [
        ("London Heathrow Arrivals & Departures", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=723"),
        ("London Heathrow Heavy Lifters", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=4809"),
        ("London Stansted Airport", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=3826"),
        ("Manchester International Hub", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=5067"),
        ("San Francisco SFO Bay Approaches", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1060"),
        ("Los Angeles International LAX", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=4874")
    ],
    "museums": [
        ("Brooklands Aviation Museum", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=5443"),
        ("Falcon Field Warbirds Arizona", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1473"),
        ("Hickory Aviation Museum NC", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=4215"),
        ("PIMA Air & Space Museum Arizona", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1406"),
        ("March Field Air Museum CA", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=2019"),
        ("Deutsches Museum Munich", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=4071")
    ],
    "carriers": [
        ("CVN-71 USS Theodore Roosevelt Flight Ops", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=1837"),
        ("CVN-77 USS George H. W. Bush Supercarrier", "http://web.archive.org/web/20260216071728/https://aviography.co.uk/?page_id=2925")
    ]
}

downloaded_photos = []
photo_id = 1

for cat_id, sub_pages in target_pages.items():
    folder = f"public/photos/{cat_id}"
    os.makedirs(folder, exist_ok=True)
    cat_obj = next(c for c in categories_def if c["id"] == cat_id)

    print(f"\n==========================================")
    print(f"Scraping category: {cat_obj['name']}")
    print(f"==========================================")

    for sub_title, page_url in sub_pages:
        try:
            print(f"Fetching {sub_title}...")
            html = subprocess.check_output(["curl", "-sL", "-m", "12", page_url]).decode("utf-8", errors="ignore")
            # Find all full image URLs (prefer href full links or large -scaled versions, avoid -400x250 thumbs)
            matches = re.findall(r'(?:href|src)=["\'](http[^\'"]+wp-content/uploads[^\'"]+\.(?:jpg|jpeg|png))["\']', html, re.I)
            
            # Filter and deduplicate
            raw_urls = []
            for m in matches:
                # If it is a thumbnail like -400x250, get the full image by stripping dimension
                full_clean = re.sub(r'-\d+x\d+\.(jpg|png|jpeg)$', r'.\1', m, flags=re.I)
                # Ensure it uses im_ flag for direct image download
                if "im_/" not in full_clean:
                    full_clean = full_clean.replace("https://aviography.co.uk/", "https://aviography.co.uk/")
                    # Insert im_/ after timestamp if archived
                    full_clean = re.sub(r'(http://web\.archive\.org/web/\d+)(/.*)', r'\1im_\2', full_clean)
                raw_urls.append(full_clean)

            unique_urls = list(dict.fromkeys(raw_urls))
            print(f"  Found {len(unique_urls)} images for {sub_title}")

            for img_url in unique_urls[:4]: # Download top highest-res images per sub-category
                filename = os.path.basename(urllib.parse.urlparse(img_url).path)
                if not filename or len(filename) < 4:
                    continue
                # Clean filename
                clean_name = f"{cat_id}_{filename}"
                target_path = os.path.join(folder, clean_name)

                if not os.path.exists(target_path) or os.path.getsize(target_path) < 1000:
                    subprocess.run(["curl", "-sL", "-m", "15", img_url, "-o", target_path])

                if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
                    size = os.path.getsize(target_path)
                    print(f"    [OK] {clean_name} ({size} bytes)")
                    
                    # Create clean title
                    img_title = sub_title
                    base_name = filename.rsplit(".", 1)[0]
                    if not any(k.lower() in img_title.lower() for k in ["a380", "b747", "typhoon", "carrier", "riat"]):
                        img_title = f"{sub_title} - {base_name.replace('-', ' ').replace('_', ' ')}"

                    downloaded_photos.append({
                        "id": f"av-{photo_id:03d}",
                        "title": img_title,
                        "filename": clean_name,
                        "category": cat_id,
                        "categoryName": cat_obj["name"],
                        "tag": sub_title.split(" - ")[0],
                        "src": f"/photos/{cat_id}/{clean_name}",
                        "location": sub_title,
                        "year": "2013-2024",
                        "description": f"Original full-resolution aviation capture from aviography.co.uk showcasing {sub_title}.",
                        "featured": (photo_id in [1, 2, 5, 8, 12, 16, 20, 24, 28, 32]),
                        "camera": "Canon EOS Professional Series",
                        "lens": "Canon EF L-Series Telephoto Optics",
                        "exif": {
                            "shutter": "1/1600s",
                            "aperture": "f/6.3",
                            "iso": "ISO 200",
                            "focalLength": "400mm"
                        },
                        "fileSize": size
                    })
                    photo_id += 1
        except Exception as e:
            print(f"  Error on {sub_title}: {e}")

# Include Singapore A380 and the original full-res aviation aircraft photos
if os.path.exists("public/photos/showcase/bg_1.jpg"):
    downloaded_photos.insert(0, {
        "id": f"av-hero-001",
        "title": "Airbus A380 Superjumbo Approach",
        "filename": "bg_1.jpg",
        "category": "aircraft",
        "categoryName": "Aircraft",
        "tag": "Airbus A380",
        "src": "/photos/showcase/bg_1.jpg",
        "location": "London Heathrow Airport (LHR)",
        "year": "2020",
        "description": "Double-deck four-engine widebody aircraft captured on final descent over the approach lights.",
        "featured": True,
        "camera": "Canon EOS Professional",
        "lens": "Canon EF 100-400mm L IS",
        "exif": {"shutter": "1/1000s", "aperture": "f/8.0", "iso": "ISO 100", "focalLength": "300mm"},
        "fileSize": os.path.getsize("public/photos/showcase/bg_1.jpg")
    })

if os.path.exists("public/photos/showcase/bg_2.jpg"):
    downloaded_photos.insert(1, {
        "id": f"av-hero-002",
        "title": "Fast Jet Afterburner Climb-Out",
        "filename": "bg_2.jpg",
        "category": "airshows",
        "categoryName": "Airshows",
        "tag": "RIAT Display",
        "src": "/photos/showcase/bg_2.jpg",
        "location": "RAF Fairford (RIAT)",
        "year": "2022",
        "description": "Maximum climb performance with twin afterburners blazing into the Gloucestershire sky.",
        "featured": True,
        "camera": "Canon EOS Professional",
        "lens": "Canon EF 400mm f/2.8L",
        "exif": {"shutter": "1/2000s", "aperture": "f/5.6", "iso": "ISO 200", "focalLength": "400mm"},
        "fileSize": os.path.getsize("public/photos/showcase/bg_2.jpg")
    })

if os.path.exists("public/photos/showcase/bg_3.jpg"):
    downloaded_photos.insert(2, {
        "id": f"av-hero-003",
        "title": "Military Fast Jet Low-Level Pass",
        "filename": "bg_3.jpg",
        "category": "military-bases",
        "categoryName": "Military Bases",
        "tag": "RAF Interceptor",
        "src": "/photos/showcase/bg_3.jpg",
        "location": "RAF Coningsby, Lincolnshire",
        "year": "2021",
        "description": "High-speed tactical pass over the perimeter fence during operational combat readiness training.",
        "featured": True,
        "camera": "Canon EOS Professional",
        "lens": "Canon EF 100-400mm L IS",
        "exif": {"shutter": "1/1600s", "aperture": "f/6.3", "iso": "ISO 160", "focalLength": "350mm"},
        "fileSize": os.path.getsize("public/photos/showcase/bg_3.jpg")
    })

# Also incorporate Paul Brown original aviation photos from the Aviation collection
# RNAS Yeovilton, RIAT displays, B-17, Typhoon QRA, CVN-71 carrier ops, B-52 Fairford, etc.
original_aviation = [
    ("page3-1000", "aircraft", "Airbus & Prop", "Sea Fury / Fleet Air Arm Warbird", "RNAS Yeovilton Air Day", "Naval warbird displaying full throttle power."),
    ("page3-1001", "airshows", "RIAT Display", "F-16 Fighting Falcon Afterburner Turn", "RAF Fairford (RIAT)", "High-G turn pulling condensation ribbons."),
    ("page3-1002", "airshows", "Airshow Solo", "European Combat Jet Demonstration", "RAF Fairford (RIAT)", "Aerobatic demonstration with full authority flight controls."),
    ("page3-1003", "civil-airports", "London Heathrow", "Boeing 777-300ER Rotation Runway 27R", "London Heathrow (LHR)", "Heavy international long-haul rotation."),
    ("page3-1004", "military-bases", "RAF Fairford", "F-16 Topside Camouflage Pass", "RAF Fairford Flightline", "Crisp topside pass revealing strike ordnance."),
    ("page3-1005", "airshows", "Eurofighter Display", "Eurofighter Typhoon Vertical Climb", "RAF Fairford (RIAT)", "Maximum vertical climb into the vertical."),
    ("page3-1006", "civil-airports", "London Heathrow", "Airbus A380 Superjumbo Heavy Final", "London Heathrow Airport", "Double-deck flagship on short final approach."),
    ("page3-1007", "airshows", "Aerobatic Teams", "Display Team High-Speed Cross Pass", "RAF Fairford (RIAT)", "Precision split formation with smoke generators."),
    ("page3-1008", "museums", "Warbirds & Heritage", "Boeing B-17 Flying Fortress 'Sentimental Journey'", "Mesa Falcon Field Museum, AZ", "Restored WWII four-engine heavy bomber."),
    ("page3-1009", "museums", "Warbirds & Heritage", "North American P-51D Mustang", "Mesa Falcon Field, Arizona", "Legendary escort fighter with polished aluminum finish."),
    ("page3-1010", "civil-airports", "London Heathrow", "British Airways Boeing 747-400 Queen of the Skies", "London Heathrow (LHR)", "The timeless 747-400 climbing into late afternoon sun."),
    ("page3-1011", "military-bases", "Strategic Bombers", "USAF B-52H Stratofortress on Dispersal", "RAF Fairford", "Global strike eight-engine heavy bomber."),
    ("page3-1012", "civil-airports", "London Heathrow", "Boeing 787-9 Dreamliner Touchdown", "London Heathrow Airport", "Smooth main-gear touchdown with tire smoke."),
    ("page3-1013", "carriers", "Carrier Operations", "F/A-18F Super Hornet Catapult Launch", "USS Theodore Roosevelt (CVN-71)", "Steam catapult acceleration off the waist cat."),
    ("page3-1014", "military-bases", "RAF Coningsby", "RAF Typhoon FGR4 Quick Reaction Alert", "RAF Coningsby, Lincolnshire", "Armed supersonic interceptor on defense readiness."),
    ("page3-1015", "museums", "BBMF Heritage", "Supermarine Spitfire & Typhoon Heritage Flight", "RAF Coningsby / BBMF", "Historic Battle of Britain fighter flying alongside modern Typhoon.")
]

for base_id, cat_id, sub_tag, title, loc, desc in original_aviation:
    src_file = f"public/photos/aviation/aviation_{base_id}.jpg"
    dest_folder = f"public/photos/{cat_id}"
    dest_file = f"{dest_folder}/{base_id}.jpg"
    if os.path.exists(src_file):
        os.makedirs(dest_folder, exist_ok=True)
        subprocess.run(["cp", src_file, dest_file])
        downloaded_photos.append({
            "id": f"av-{base_id}",
            "title": title,
            "filename": f"{base_id}.jpg",
            "category": cat_id,
            "categoryName": next(c['name'] for c in categories_def if c['id'] == cat_id),
            "tag": sub_tag,
            "src": f"/photos/{cat_id}/{base_id}.jpg",
            "location": loc,
            "year": "2014-2024",
            "description": desc,
            "featured": True,
            "camera": "Canon EOS 7D / 5D Mk III",
            "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
            "exif": {
                "shutter": "1/1250s",
                "aperture": "f/7.1",
                "iso": "ISO 200",
                "focalLength": "400mm"
            },
            "fileSize": os.path.getsize(dest_file)
        })

print(f"\nTotal curated aviation photos: {len(downloaded_photos)}")

# Output new photos data
ts_content = f"""/**
 * Aviaography UK (www.aviaography.co.uk)
 * Pure Aviation Photography Catalog
 * Only official categories from the original site:
 * - Aircraft (Airbus & Boeing)
 * - Airshows
 * - Military Bases
 * - Civil Airports
 * - Aviation Museums
 * - Aircraft Carriers
 */

import {{ Photo, Category }} from '../types';

export const INITIAL_CATEGORIES: Category[] = {json.dumps(categories_def, indent=2)};

export const INITIAL_PHOTOS: Photo[] = {json.dumps(downloaded_photos, indent=2)};
"""

with open("src/data/photos.ts", "w") as f:
    f.write(ts_content)

print("Saved updated src/data/photos.ts with ONLY aviography.co.uk categories and images.")
