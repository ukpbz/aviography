import os
import struct
import json

def get_jpeg_size(filepath):
    try:
        with open(filepath, "rb") as f:
            f.seek(0)
            read = f.read(2)
            if read != b"\xff\xd8":
                return (900, 600)
            while True:
                data = f.read(4)
                if len(data) < 4:
                    return (900, 600)
                marker, length = struct.unpack(">2sH", data)
                if marker in (b"\xff\xc0", b"\xff\xc2"):
                    f.read(1)
                    h, w = struct.unpack(">HH", f.read(4))
                    return (w, h)
                else:
                    f.seek(length - 2, os.SEEK_CUR)
    except:
        return (900, 600)

categories = [
    {
        "id": "aviation",
        "name": "Aviation",
        "slug": "aviation",
        "folder": "public/photos/aviation",
        "webDir": "/photos/aviation",
        "originalAlbum": "Aircraft album",
        "description": "High-octane flight displays, fast military jets, heavy civil airliners, and airshow photography from RIAT, RAF Coningsby, RNAS Yeovilton, and Heathrow.",
        "icon": "Plane"
    },
    {
        "id": "wildlife",
        "name": "Wildlife",
        "slug": "wildlife",
        "folder": "public/photos/wildlife",
        "webDir": "/photos/wildlife",
        "originalAlbum": "Nature album",
        "description": "Intimate portraits of avian species and wildlife in motion—raptors, kingfishers, native British fauna, and natural habitats captured with pin-sharp telephoto optics.",
        "icon": "Feather"
    },
    {
        "id": "city-life",
        "name": "City Life",
        "slug": "city-life",
        "folder": "public/photos/city",
        "webDir": "/photos/city",
        "originalAlbum": "New York City",
        "description": "Metropolitan street geometry, architectural landmarks, urban bridges, and atmospheric skyline panoramas across New York City and global metropolises.",
        "icon": "Building2"
    },
    {
        "id": "my-cars",
        "name": "My Cars",
        "slug": "my-cars",
        "folder": "public/photos/cars",
        "webDir": "/photos/cars",
        "originalAlbum": "Cars",
        "description": "Automotive passion—classic British Jaguars, high-performance engines, and touring vehicles documented with mechanical precision and character.",
        "icon": "Car"
    }
]

aviation_lookup = {
    "1000": ("Sea Fury / Fleet Air Arm Display", "RNAS Yeovilton Air Day, Somerset", "Naval Air Arm", "Dynamic high-speed pass of historic naval warbird over the runway at RNAS Yeovilton.", "1/1250s", "f/7.1", "ISO 200"),
    "1001": ("RIAT Fast Jet Display", "RAF Fairford, Gloucestershire", "Military Jet", "Vapor trails forming over wings during a high-G turn at the Royal International Air Tattoo.", "1/2000s", "f/6.3", "ISO 160"),
    "1002": ("European Fighter Demonstration", "RAF Fairford (RIAT)", "Airshow Display", "Precision aerobatic maneuvering at RIAT with full afterburners engaged.", "1/1600s", "f/8.0", "ISO 200"),
    "1003": ("Boeing 777 Rotation Runway 27R", "London Heathrow (LHR)", "Commercial Aviation", "Heavy twin-engine widebody airliner lifting off with thermal heat haze trailing.", "1/1000s", "f/8.0", "ISO 100"),
    "1004": ("F-16 Fighting Falcon Display", "RAF Fairford (RIAT)", "Military Jet", "Crisp top-side topside pass exhibiting camouflage livery and ordnance hardpoints.", "1/2500s", "f/5.6", "ISO 200"),
    "1005": ("Eurofighter Typhoon Vertical Climb", "RAF Fairford (RIAT)", "Military Jet", "RAF multi-role combat aircraft performing maximum vertical climb-out.", "1/2000s", "f/6.3", "ISO 200"),
    "1006": ("Airbus A380 Superjumbo on Final", "London Heathrow Airport", "Commercial Aviation", "The iconic double-decker airliner banking gracefully onto final approach at Heathrow.", "1/800s", "f/8.0", "ISO 100"),
    "1007": ("Display Team Cross-Over Pass", "RAF Fairford (RIAT)", "Aerobatic Team", "Split-second synchronized cross maneuver with colored smoke trails.", "1/1600s", "f/7.1", "ISO 160"),
    "1008": ("B-17 Flying Fortress Taxiing", "Mesa Falcon Field, Arizona", "Warbirds & Vintage", "Restored WWII heavy bomber purring along the taxiway under desert skies.", "1/320s", "f/11", "ISO 100"),
    "1009": ("North American P-51 Mustang", "Mesa Falcon Field, Arizona", "Warbirds & Vintage", "Polished aluminum fighter with Packard V-1650 Merlin purring on the ramp.", "1/250s", "f/9.0", "ISO 100"),
    "1010": ("British Airways Boeing 747-400", "London Heathrow (LHR)", "Commercial Aviation", "The Queen of the Skies climbing out gracefully from runway 09R.", "1/1000s", "f/8.0", "ISO 100"),
    "1011": ("USAF B-52H Stratofortress Static", "RAF Fairford", "Strategic Military", "Imposing eight-engine strategic bomber stationed on the Fairford flightline.", "1/500s", "f/8.0", "ISO 100"),
    "1012": ("Boeing 787 Dreamliner Touchdown", "London Heathrow Airport", "Commercial Aviation", "Flexing composite wings absorbing touchdown impact on the tarmac.", "1/800s", "f/7.1", "ISO 125"),
    "1013": ("F/A-18 Super Hornet Launch", "USS Theodore Roosevelt (CVN-71)", "Naval Aviation", "Steam catapult launch sequence of US Navy carrier fighter on operations.", "1/2000s", "f/5.6", "ISO 250"),
    "1014": ("RAF Typhoon Interceptor on QRA", "RAF Coningsby, Lincolnshire", "Military Jet", "Quick Reaction Alert fighter armed and ready on the Coningsby dispersal.", "1/1250s", "f/8.0", "ISO 200"),
    "1015": ("Spitfire & Typhoon Heritage Flight", "RAF Coningsby", "Heritage & Historic", "Battle of Britain Memorial Flight Supermarine Spitfire paired alongside modern Typhoon.", "1/320s", "f/10", "ISO 100")
}

wildlife_lookup = {
    "1000": ("Lurcher in Full Sprint", "Yorkshire Countryside", "Canine Action", "Motion study of working hound running at maximum stride across open fields.", "1/2500s", "f/4.0", "ISO 400"),
    "1001": ("Common Kingfisher with Minnow", "River Wharfe, Yorkshire", "Avian Fauna", "Iridescent plumage illuminated in morning light perched with freshly caught minnow.", "1/1600s", "f/5.6", "ISO 800"),
    "1002": ("Grey Heron Hunting in Shallows", "Canal Basin & Wetlands", "Wetland Birds", "Patient predator poised in still waters with mirror-like reflection.", "1/1000s", "f/6.3", "ISO 400"),
    "1003": ("Egyptian Goose Family Study", "Parkland Lakes", "Waterfowl", "Parent goose vigilant over downy goslings in lush spring grass.", "1/800s", "f/5.6", "ISO 200"),
    "1004": ("Captive Bird of Prey Portrait", "Falconry Study", "Raptors", "Intense piercing gaze and hooked beak of raptor during handler presentation.", "1/1250s", "f/4.0", "ISO 320"),
    "1005": ("Male Chaffinch in Blossom", "Spring Orchard", "Songbirds", "Colorful passerine singing from flowering cherry orchard bough.", "1/1000s", "f/5.6", "ISO 400"),
    "1006": ("Blue Tit on Mossy Bough", "Woodland Trail", "Songbirds", "Delicate yellow and cobalt plumage against soft natural bokeh.", "1/1250s", "f/5.0", "ISO 400"),
    "1007": ("Mandarin Drake in Spring Finery", "Woodland Tarn", "Waterfowl", "Spectacular ornamental feathers and orange sail fins glowing in dappled light.", "1/1000s", "f/5.6", "ISO 320"),
    "1008": ("Peacock Butterfly on Bramble", "Wildflower Meadow", "Insects & Flora", "Velvety eyespots displayed open to warm sun rays.", "1/500s", "f/8.0", "ISO 200"),
    "1009": ("Domestic Feline Macro Eye", "Studio Portrait", "Domestic Pets", "Intricate iris pigmentation and slit pupil detail under directional lighting.", "1/200s", "f/5.6", "ISO 100"),
    "1010": ("Grey Squirrel Foraging", "Deciduous Woods", "Woodland Mammals", "Tufted ears and bushy tail balanced on fallen moss-covered oak.", "1/800s", "f/5.6", "ISO 500"),
    "1011": ("Mute Swan Taking to Flight", "River Basin", "Waterfowl", "Powerful wingbeats beating the water surface in explosive takeoff spray.", "1/2000s", "f/6.3", "ISO 250"),
    "1012": ("Chirpy Robin on Frosty Perch", "Winter Garden", "Songbirds", "Fluffed red breast standing out against cold morning frost.", "1/1000s", "f/5.6", "ISO 400"),
    "1013": ("Ring-Necked Parakeet Feeding", "Urban Parkland", "Introduced Species", "Emerald green plumage feasting on crimson autumn berries.", "1/1250s", "f/5.6", "ISO 400"),
    "1014": ("European Robin on Rustic Post", "Allotment Fence", "Songbirds", "Inquisitive British gardener companion cocking its head with keen curiosity.", "1/1000s", "f/5.6", "ISO 320"),
    "1015": ("Highland Stag in Mist", "Scottish Highlands", "Mammals", "Noble red deer stag emerging through morning mist in Scotland.", "1/640s", "f/5.6", "ISO 640")
}

city_lookup = {
    "1000": ("Times Square Neon & Motion", "Manhattan, New York", "Urban Nightlife", "Bustling intersection with iconic billboards and yellow cab streaks.", "1/60s", "f/4.0", "ISO 800"),
    "1001": ("Flatiron Building Perspective", "5th Avenue & Broadway", "Architecture", "Dramatic wedge perspective of Daniel Burnham iconic landmark skyscraper.", "1/500s", "f/8.0", "ISO 100"),
    "1002": ("Brooklyn Bridge Gothic Arches", "East River Crossing", "Bridges & Transit", "Limestone and granite stone arches framed with criss-crossing steel cables.", "1/800s", "f/8.0", "ISO 100"),
    "1003": ("Grand Central Terminal Concourse", "Midtown Manhattan", "Historic Interiors", "Light streaming through vaulted cathedral windows onto the bustling floor.", "1/40s", "f/4.0", "ISO 1600"),
    "1004": ("Central Park Autumn Vista", "The Ramble & Lake", "Urban Parks", "Golden autumn foliage contrasting against Central Park South luxury towers.", "1/400s", "f/7.1", "ISO 160"),
    "1005": ("Yellow Cab in Midtown Rain", "Broadway & 42nd St", "Street Energy", "Reflections of neon signage on wet asphalt with speeding yellow taxi.", "1/125s", "f/3.5", "ISO 1250"),
    "1006": ("High Line Aerial Streetscape", "Meatpacking District", "Urban Revitalization", "Elevated greenway walkway offering vistas across Chelsea streets below.", "1/640s", "f/8.0", "ISO 100"),
    "1007": ("SoHo Cast-Iron Architecture", "Greene Street Historic District", "Architectural Heritage", "Intricate cast-iron facades and fire escapes with classic cobbles.", "1/500s", "f/8.0", "ISO 100"),
    "1008": ("Empire State Building Silhouette", "34th Street Viewpoint", "Monuments", "Limestone art deco spire towering into twilight atmospheric clouds.", "1/250s", "f/6.3", "ISO 400"),
    "1009": ("Subway Station Underground", "IRT Lexington Line", "Transit Culture", "Subway train roaring into tile-clad subterranean platform.", "1/60s", "f/2.8", "ISO 1600"),
    "1010": ("Manhattan Skyline from DUMBO", "Brooklyn Waterfront", "Skyline Vistas", "Expansive panoramic vista of lower Manhattan Financial District towers.", "1/800s", "f/8.0", "ISO 100"),
    "1011": ("Wall Street Canyon View", "Financial District", "Architecture", "Dramatic narrow street perspective terminating at Trinity Church spire.", "1/400s", "f/7.1", "ISO 200")
}

cars_lookup = {
    "1000": ("Classic Jaguar XJ6 Sovereign", "Country Estate Grounds", "Classic British Saloon", "Long wheelbase luxury saloon in classic British Racing Green.", "1/320s", "f/5.6", "ISO 100"),
    "1001": ("Jaguar 4.2 Litre Engine Bay", "Detail Study", "Mechanical Engineering", "Polished aluminum double-overhead camshaft straight-six engine with SU carburetors.", "1/200s", "f/6.3", "ISO 100"),
    "1002": ("Chrome Leaper Hood Ornament", "Automotive Mascot", "Styling Details", "Iconic Jaguar leaper mascot catching late afternoon sunlight.", "1/800s", "f/4.0", "ISO 100"),
    "1003": ("Classic Interior Leather & Walnut", "Cockpit", "Automotive Interiors", "Connolly leather seats paired with burr walnut dash fascia and Smiths dials.", "1/125s", "f/4.5", "ISO 200"),
    "1004": ("Jaguar Wire Wheels & Knock-offs", "Rolling Chassis", "Period Details", "Traditional chrome laced wire wheels with winged center spin lock.", "1/500s", "f/5.6", "ISO 100"),
    "1005": ("Twin Exhaust Chrome Tips", "Rear Styling", "Exhaust & Power", "Polished dual tailpipes beneath curved rear valance.", "1/400s", "f/5.0", "ISO 100"),
    "1006": ("Chevrolet Blazer K5 4x4", "Off-Road Trail", "American V8 4x4", "Classic full-size four-wheel-drive truck on rugged moorland path.", "1/400s", "f/7.1", "ISO 100"),
    "1007": ("V8 Small-Block Engine Close-up", "Under-Hood", "Powertrain", "American small-block V8 with high-flow air cleaner and chrome accessories.", "1/250s", "f/5.6", "ISO 100"),
    "1008": ("Blazer Trail-Tuned Suspension", "Chassis", "Off-Road Running Gear", "Heavy-duty leaf springs and dual shock absorbers setup for rough terrain.", "1/320s", "f/6.3", "ISO 125"),
    "1009": ("Grand Tourer Side Profile", "Coastal Highway", "Sporting Coupes", "Sleek aerodynamic touring coupe poised on scenic coastal overlook.", "1/640s", "f/7.1", "ISO 100"),
    "1010": ("Jaguar XJ-S V12 Grand Tourer", "Parkland Driveway", "Luxury GT", "Low-slung grand tourer with famous flying buttresses and 5.3L engine.", "1/500s", "f/6.3", "ISO 100"),
    "1011": ("Chevrolet Blazer Profile in Woods", "Forest Reserve", "All-Terrain", "Side view showcasing high ground clearance and aggressive all-terrain tires.", "1/400s", "f/5.6", "ISO 200"),
    "1012": ("Grand Vitara XL-7 V6 Family Tourer", "Yorkshire Dales", "Compact SUV", "7-seat family adventurer equipped for northern weather expeditions.", "1/500s", "f/8.0", "ISO 100"),
    "1013": ("XL-7 Mountain Trail Adventure", "Pennine Moorland", "Overlanding", "Climbing gravel switchbacks above the heather-clad Yorkshire valleys.", "1/640s", "f/8.0", "ISO 100"),
    "1014": ("Instrument Cluster at Night", "Cockpit Glow", "Dashboard", "Illuminated analog instrumentation and trip meters on midnight highway.", "1/30s", "f/3.5", "ISO 800"),
    "1015": ("Polished Alloy Wheels", "Wheel & Tire", "Running Gear", "Diamond-cut multi-spoke alloy wheels with performance radial tires.", "1/500s", "f/5.6", "ISO 100"),
    "1016": ("Classic Fender Line & Badge", "Exterior Trim", "Heritage Marks", "Precision swage line and chrome heritage emblems on freshly waxed coachwork.", "1/640s", "f/6.3", "ISO 100"),
    "1017": ("Vintage Motor Club Gathering", "Car Rally Grounds", "Classic Car Meet", "Lineup of historic roadsters and sports saloons at summer heritage rally.", "1/500s", "f/8.0", "ISO 100"),
    "1018": ("Jaguar XJ6 3.2 Sport Saloon", "Open Country Road", "Modern Classic", "Graceful sports saloon carving through Yorkshire country lanes.", "1/640s", "f/7.1", "ISO 100")
}

all_photos = []
p_count = 1

seen_src = set()

for cat in categories:
    folder = cat["folder"]
    if not os.path.exists(folder):
        continue
    files = sorted([f for f in os.listdir(folder) if os.path.getsize(os.path.join(folder, f)) > 1000 and f.endswith(".jpg")])
    
    for f in files:
        path = os.path.join(folder, f)
        w, h = get_jpeg_size(path)
        src = f"{cat['webDir']}/{f}"
        if src in seen_src:
            continue
        seen_src.add(src)
        
        # default info
        cat_name = cat["name"]
        title = f"{cat_name} Study #{p_count}"
        loc = "United Kingdom"
        tag = cat_name
        desc = f"Original high-resolution capture from Paul Brown's {cat['originalAlbum']} collection."
        shutter, aperture, iso = "1/1000s", "f/6.3", "ISO 200"
        
        lookup = None
        if cat["id"] == "aviation":
            lookup = aviation_lookup
        elif cat["id"] == "wildlife":
            lookup = wildlife_lookup
        elif cat["id"] == "city-life":
            lookup = city_lookup
        elif cat["id"] == "my-cars":
            lookup = cars_lookup
            
        if lookup:
            for k, val in lookup.items():
                if k in f:
                    title, loc, tag, desc, shutter, aperture, iso = val
                    break
                    
        is_featured = (p_count in [1, 2, 4, 5, 8, 14, 15, 34, 35, 48, 50, 62, 70])
        
        all_photos.append({
            "id": f"photo-{p_count:03d}",
            "title": title,
            "filename": f,
            "category": cat["id"],
            "categoryName": cat["name"],
            "tag": tag,
            "src": src,
            "width": w,
            "height": h,
            "location": loc,
            "year": "2014-2015",
            "description": desc,
            "featured": is_featured,
            "camera": "Canon EOS 7D / 5D Mk III",
            "lens": "Canon EF 100-400mm f/4.5-5.6L IS" if cat["id"] in ["aviation", "wildlife"] else "Canon EF 24-105mm f/4L IS USM",
            "exif": {
                "shutter": shutter,
                "aperture": aperture,
                "iso": iso,
                "focalLength": "400mm" if cat["id"] in ["aviation", "wildlife"] else "50mm"
            },
            "fileSize": os.path.getsize(path)
        })
        p_count += 1

print(f"Total photos compiled: {len(all_photos)}")

# Output TypeScript file
ts_content = f"""/**
 * Aviaography / Paul Brown Photography Catalog
 * Automatically compiled from original high-resolution photo assets
 */

import {{ Photo, Category }} from '../types';

export const INITIAL_CATEGORIES: Category[] = {json.dumps(categories, indent=2)};

export const INITIAL_PHOTOS: Photo[] = {json.dumps(all_photos, indent=2)};
"""

os.makedirs("src/data", exist_ok=True)
with open("src/data/photos.ts", "w") as f:
    f.write(ts_content)

print("Saved src/data/photos.ts")
