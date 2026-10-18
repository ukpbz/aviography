/**
 * Aviaography UK (www.aviaography.co.uk)
 * Dedicated Aviation Photography Catalog
 * Categories matching the original site exactly:
 * - Aircraft
 * - Airshows
 * - Military Bases
 * - Civil Airports
 * - Aviation Museums
 * - Aircraft Carriers
 */

import { Photo, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    "id": "aircraft",
    "name": "Aircraft",
    "slug": "aircraft",
    "description": "Comprehensive airliner and transport studies, detailing Airbus and Boeing fleets from agile short-haulers to super-heavies.",
    "icon": "Plane",
    "subCategories": [
      "Airbus A380",
      "Boeing 747",
      "Boeing 787 Dreamliner",
      "Boeing 777",
      "Airbus A350"
    ]
  },
  {
    "id": "airshows",
    "name": "Airshows",
    "slug": "airshows",
    "description": "Adrenaline-fueled flight displays, fast-jet vapor trails, and aerobatic precision from RIAT, Duxford, and RNAS Yeovilton.",
    "icon": "Flame",
    "subCategories": [
      "Royal International Air Tattoo (RIAT)",
      "RNAS Yeovilton Air Day",
      "Solo Fast Jet Displays",
      "Aerobatic Teams"
    ]
  },
  {
    "id": "military-bases",
    "name": "Military Bases",
    "slug": "military-bases",
    "description": "Operational fighter stations, interceptors, and strategic bombers on active flightlines across the UK and international bases.",
    "icon": "Crosshair",
    "subCategories": [
      "RAF Coningsby (QRA)",
      "RAF Fairford Dispersals",
      "Tactical Low-Level Sorties",
      "Strategic Bombers"
    ]
  },
  {
    "id": "civil-airports",
    "name": "Civil Airports",
    "slug": "civil-airports",
    "description": "Commercial aviation movements, touchdown smoke, and rotation vantage points across Heathrow and international hubs.",
    "icon": "Compass",
    "subCategories": [
      "London Heathrow Runway 27R",
      "Short Final Approaches",
      "Heavy Touchdowns",
      "Long-Haul Departures"
    ]
  },
  {
    "id": "museums",
    "name": "Aviation Museums",
    "slug": "museums",
    "description": "Historic airframes, cockpits, and preserved warbirds across legendary British and American aviation heritage collections.",
    "icon": "Landmark",
    "subCategories": [
      "Hickory Aviation Museum NC",
      "Mesa Falcon Field Arizona",
      "Battle of Britain Memorial Flight (BBMF)"
    ]
  },
  {
    "id": "carriers",
    "name": "Aircraft Carriers",
    "slug": "carriers",
    "description": "Naval aviation power projection\u2014catapult launches, flight deck traps, and strike fighter operations aboard US Navy nuclear supercarriers.",
    "icon": "Ship",
    "subCategories": [
      "CVN-71 USS Theodore Roosevelt",
      "Steam Catapult Launches",
      "Naval Strike Aviation"
    ]
  }
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    "id": "av-ac-001",
    "title": "Singapore Airlines Airbus A380-800 Flagship",
    "filename": "singapore_a380_large.jpg",
    "category": "aircraft",
    "categoryName": "Aircraft",
    "tag": "Airbus A380",
    "src": "/photos/aircraft/singapore_a380_large.jpg",
    "location": "London Heathrow (LHR) / Singapore",
    "year": "2020",
    "description": "The world's largest passenger airliner captured in pristine ultra-high definition (1920x1280), showing four Rolls-Royce Trent 900 turbofans and double-deck fuselage contours.",
    "featured": true,
    "camera": "Canon EOS Professional",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS USM",
    "exif": {
      "shutter": "1/1000s",
      "aperture": "f/8.0",
      "iso": "ISO 100",
      "focalLength": "340mm"
    },
    "width": 1920,
    "height": 1280,
    "fileSize": 564891
  },
  {
    "id": "av-ac-002",
    "title": "Airbus A380 Superjumbo Low Approach",
    "filename": "a380_superjumbo_approach.jpg",
    "category": "aircraft",
    "categoryName": "Aircraft",
    "tag": "Airbus A380",
    "src": "/photos/aircraft/a380_superjumbo_approach.jpg",
    "location": "Heathrow Threshold / Myrtle Avenue",
    "year": "2020",
    "description": "Full-span 1536px capture of the double-decker superjumbo gliding over the perimeter threshold with triple-slotted flaps and gear extended.",
    "featured": true,
    "camera": "Canon EOS Professional",
    "lens": "Canon EF 70-200mm f/2.8L IS II USM",
    "exif": {
      "shutter": "1/1250s",
      "aperture": "f/6.3",
      "iso": "ISO 100",
      "focalLength": "135mm"
    },
    "width": 1536,
    "height": 1020,
    "fileSize": 223045
  },
  {
    "id": "av-ac-003",
    "title": "British Airways Boeing 747-400 Queen of the Skies",
    "filename": "b747_queen_of_skies.jpg",
    "category": "aircraft",
    "categoryName": "Aircraft",
    "tag": "Boeing 747",
    "src": "/photos/aircraft/b747_queen_of_skies.jpg",
    "location": "London Heathrow Airport (LHR)",
    "year": "2019",
    "description": "The immortal Queen of the Skies climbing out gracefully with four RB211 engines into afternoon skies.",
    "featured": true,
    "camera": "Canon EOS 5D Mark III",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1000s",
      "aperture": "f/8.0",
      "iso": "ISO 100",
      "focalLength": "280mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 78945
  },
  {
    "id": "av-ac-004",
    "title": "Airbus A380 Heavy on Short Final",
    "filename": "airbus_a380_final.jpg",
    "category": "aircraft",
    "categoryName": "Aircraft",
    "tag": "Airbus A380",
    "src": "/photos/aircraft/airbus_a380_final.jpg",
    "location": "London Heathrow Approach",
    "year": "2019",
    "description": "Massive wing dihedral and wingtip fences illuminated as the A380 aligns with runway centerline.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/800s",
      "aperture": "f/7.1",
      "iso": "ISO 160",
      "focalLength": "200mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 73067
  },
  {
    "id": "av-ac-005",
    "title": "Boeing 787-9 Dreamliner Touchdown",
    "filename": "b787_dreamliner_touchdown.jpg",
    "category": "aircraft",
    "categoryName": "Aircraft",
    "tag": "Boeing 787 Dreamliner",
    "src": "/photos/aircraft/b787_dreamliner_touchdown.jpg",
    "location": "London Heathrow Runway 27L",
    "year": "2019",
    "description": "Composite raked wingtips flexing under ground effect at the precise instant of main gear wheel spin-up.",
    "featured": false,
    "camera": "Canon EOS 5D Mark III",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/800s",
      "aperture": "f/7.1",
      "iso": "ISO 125",
      "focalLength": "300mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 72460
  },
  {
    "id": "av-as-001",
    "title": "RIAT Fast Jet Afterburner Maximum Climb",
    "filename": "riat_fast_jet_afterburner.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "Royal International Air Tattoo",
    "src": "/photos/airshows/riat_fast_jet_afterburner.jpg",
    "location": "RAF Fairford, Gloucestershire",
    "year": "2022",
    "description": "Blinding shock diamonds and twin reheat flames roaring as the combat fighter pulls into the vertical at RIAT (1536x1020).",
    "featured": true,
    "camera": "Canon EOS Professional",
    "lens": "Canon EF 400mm f/2.8L IS USM",
    "exif": {
      "shutter": "1/2000s",
      "aperture": "f/5.6",
      "iso": "ISO 200",
      "focalLength": "400mm"
    },
    "width": 1536,
    "height": 1020,
    "fileSize": 189394
  },
  {
    "id": "av-as-002",
    "title": "Hawker Sea Fury High-Speed Runway Pass",
    "filename": "seafury_yeovilton.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "RNAS Yeovilton Air Day",
    "src": "/photos/airshows/seafury_yeovilton.jpg",
    "location": "RNAS Yeovilton, Somerset",
    "year": "2018",
    "description": "The Bristol Centaurus 18-cylinder radial engine screaming at low altitude during the historic naval air day finale.",
    "featured": true,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1250s",
      "aperture": "f/7.1",
      "iso": "ISO 200",
      "focalLength": "400mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 62039
  },
  {
    "id": "av-as-003",
    "title": "F-16 Fighting Falcon Topside Turn",
    "filename": "f16_riat_display.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "Royal International Air Tattoo",
    "src": "/photos/airshows/f16_riat_display.jpg",
    "location": "RAF Fairford (RIAT)",
    "year": "2021",
    "description": "High-G knife-edge topside maneuver with leading-edge vortex streamers tracing across the canopy.",
    "featured": true,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/2000s",
      "aperture": "f/6.3",
      "iso": "ISO 160",
      "focalLength": "380mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 60015
  },
  {
    "id": "av-as-004",
    "title": "European Fast Jet Aerobatic Demonstration",
    "filename": "combat_jet_demo_riat.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "Royal International Air Tattoo",
    "src": "/photos/airshows/combat_jet_demo_riat.jpg",
    "location": "RAF Fairford (RIAT)",
    "year": "2021",
    "description": "Flawless aerobatic maneuvering under crisp Cotswold light with reheat flaring in high angle-of-attack pitch.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1600s",
      "aperture": "f/8.0",
      "iso": "ISO 200",
      "focalLength": "400mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 55490
  },
  {
    "id": "av-as-005",
    "title": "Eurofighter Typhoon Maximum Reheat Climb",
    "filename": "eurofighter_typhoon_climb.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "Royal International Air Tattoo",
    "src": "/photos/airshows/eurofighter_typhoon_climb.jpg",
    "location": "RAF Fairford (RIAT)",
    "year": "2022",
    "description": "Twin Eurojet EJ200 engines generating 40,000 lbs of thrust as the Typhoon punches straight up through cloud bases.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/2000s",
      "aperture": "f/6.3",
      "iso": "ISO 200",
      "focalLength": "300mm"
    },
    "width": 900,
    "height": 601,
    "fileSize": 78420
  },
  {
    "id": "av-as-006",
    "title": "Display Team Synchronized Cross-Over Pass",
    "filename": "aerobatic_display_cross.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "Aerobatic Teams",
    "src": "/photos/airshows/aerobatic_display_cross.jpg",
    "location": "RAF Fairford (RIAT)",
    "year": "2021",
    "description": "Split-second formation convergence at combined closing speeds in excess of 800 mph with colored smoke generation.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1600s",
      "aperture": "f/7.1",
      "iso": "ISO 160",
      "focalLength": "250mm"
    },
    "width": 900,
    "height": 601,
    "fileSize": 97566
  },
  {
    "id": "av-as-007",
    "title": "Swiss Air Force F/A-18C Hornet Solo Display",
    "filename": "swiss_af_f18_display.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "Solo Fast Jet Displays",
    "src": "/photos/airshows/swiss_af_f18_display.jpg",
    "location": "Alpine Flight Demonstration / Airshow",
    "year": "2015",
    "description": "Swiss Air Force Boeing F/A-18C Hornet performing high-alpha aerobatics with leading-edge vapor cones under high-G pitch.",
    "featured": true,
    "camera": "Canon EOS Professional",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1600s",
      "aperture": "f/6.3",
      "iso": "ISO 200",
      "focalLength": "350mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 54851
  },
  {
    "id": "av-as-008",
    "title": "RAF Red Arrows Aerobatic Team 'Arrow' Formation",
    "filename": "red_arrows_display.jpg",
    "category": "airshows",
    "categoryName": "Airshows",
    "tag": "Aerobatic Teams",
    "src": "/photos/airshows/red_arrows_display.jpg",
    "location": "RAF Scampton / Royal Display Tour",
    "year": "2015",
    "description": "The Royal Air Force Aerobatic Team, the Red Arrows, flying BAE Systems Hawk T1 trainers in tight diamond 'Arrow' formation with synchronized red and blue smoke trails.",
    "featured": true,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/2000s",
      "aperture": "f/7.1",
      "iso": "ISO 160",
      "focalLength": "280mm"
    },
    "width": 900,
    "height": 601,
    "fileSize": 98227
  },
  {
    "id": "av-mb-001",
    "title": "RAF Interceptor Tactical Low-Level Sortie",
    "filename": "raf_interceptor_low_level.jpg",
    "category": "military-bases",
    "categoryName": "Military Bases",
    "tag": "RAF Interceptor",
    "src": "/photos/military-bases/raf_interceptor_low_level.jpg",
    "location": "RAF Coningsby / Low-Fly Area",
    "year": "2021",
    "description": "Tactical combat interceptor roaring low over the perimeter fence during combat readiness deployment (1536x1020).",
    "featured": true,
    "camera": "Canon EOS Professional",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1600s",
      "aperture": "f/6.3",
      "iso": "ISO 160",
      "focalLength": "350mm"
    },
    "width": 1536,
    "height": 1020,
    "fileSize": 234023
  },
  {
    "id": "av-mb-002",
    "title": "RAF Typhoon FGR4 Quick Reaction Alert (QRA)",
    "filename": "typhoon_coningsby_qra.jpg",
    "category": "military-bases",
    "categoryName": "Military Bases",
    "tag": "RAF Coningsby (QRA)",
    "src": "/photos/military-bases/typhoon_coningsby_qra.jpg",
    "location": "RAF Coningsby, Lincolnshire",
    "year": "2020",
    "description": "Armed multi-role interceptor stationed on 10-minute alert readiness to defend UK sovereign airspace.",
    "featured": true,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1250s",
      "aperture": "f/8.0",
      "iso": "ISO 200",
      "focalLength": "400mm"
    },
    "width": 900,
    "height": 601,
    "fileSize": 58876
  },
  {
    "id": "av-mb-003",
    "title": "USAF B-52H Stratofortress Forward Deployment",
    "filename": "b52h_stratofortress_fairford.jpg",
    "category": "military-bases",
    "categoryName": "Military Bases",
    "tag": "Strategic Bombers",
    "src": "/photos/military-bases/b52h_stratofortress_fairford.jpg",
    "location": "RAF Fairford Bomber Dispersal",
    "year": "2020",
    "description": "The massive eight-engine strategic heavy bomber positioned on the Fairford flightline during European Bomber Task Force operations.",
    "featured": true,
    "camera": "Canon EOS 5D Mark III",
    "lens": "Canon EF 24-105mm f/4L IS",
    "exif": {
      "shutter": "1/500s",
      "aperture": "f/8.0",
      "iso": "ISO 100",
      "focalLength": "70mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 85839
  },
  {
    "id": "av-mb-004",
    "title": "USAF F-16 Falcon Flightline Readiness",
    "filename": "f16_fairford_flightline.jpg",
    "category": "military-bases",
    "categoryName": "Military Bases",
    "tag": "Tactical Strike",
    "src": "/photos/military-bases/f16_fairford_flightline.jpg",
    "location": "RAF Fairford Dispersal",
    "year": "2019",
    "description": "Armed combat fighter lined up on the eastern taxiway under heavy European skies.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/2500s",
      "aperture": "f/5.6",
      "iso": "ISO 200",
      "focalLength": "300mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 75018
  },
  {
    "id": "av-ca-001",
    "title": "Boeing 777-300ER Rotation Runway 27R",
    "filename": "b777_heathrow_departure.jpg",
    "category": "civil-airports",
    "categoryName": "Civil Airports",
    "tag": "London Heathrow (LHR)",
    "src": "/photos/civil-airports/b777_heathrow_departure.jpg",
    "location": "London Heathrow Airport (LHR)",
    "year": "2020",
    "description": "Massive GE90-115B turbofans producing 115,000 lbs of thrust each as the long-haul twinjet rotates past the central control tower.",
    "featured": true,
    "camera": "Canon EOS 5D Mark III",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1000s",
      "aperture": "f/8.0",
      "iso": "ISO 100",
      "focalLength": "300mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 81484
  },
  {
    "id": "av-ca-002",
    "title": "Airbus A380 Flare over Heathrow Threshold",
    "filename": "heathrow_a380_approach.jpg",
    "category": "civil-airports",
    "categoryName": "Civil Airports",
    "tag": "London Heathrow (LHR)",
    "src": "/photos/civil-airports/heathrow_a380_approach.jpg",
    "location": "Heathrow Southern Runway 27L",
    "year": "2020",
    "description": "Double-deck passenger aircraft flared in ground effect seconds before main gear contact.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/800s",
      "aperture": "f/8.0",
      "iso": "ISO 100",
      "focalLength": "200mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 73067
  },
  {
    "id": "av-ca-003",
    "title": "Boeing 747-400 Long-Haul Departure Climb",
    "filename": "heathrow_b747_climb.jpg",
    "category": "civil-airports",
    "categoryName": "Civil Airports",
    "tag": "London Heathrow (LHR)",
    "src": "/photos/civil-airports/heathrow_b747_climb.jpg",
    "location": "Heathrow Runway 09R",
    "year": "2019",
    "description": "Four-engine heavy jet climbing over western London on departure toward North Atlantic tracks.",
    "featured": false,
    "camera": "Canon EOS 5D Mark III",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/1000s",
      "aperture": "f/8.0",
      "iso": "ISO 100",
      "focalLength": "280mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 78945
  },
  {
    "id": "av-ca-004",
    "title": "Boeing 787 Touchdown Wheel Smoke",
    "filename": "heathrow_b787_touchdown.jpg",
    "category": "civil-airports",
    "categoryName": "Civil Airports",
    "tag": "London Heathrow (LHR)",
    "src": "/photos/civil-airports/heathrow_b787_touchdown.jpg",
    "location": "London Heathrow Runway 27L",
    "year": "2020",
    "description": "High-speed touchdown sequence producing white tire friction smoke on concrete runway.",
    "featured": false,
    "camera": "Canon EOS 5D Mark III",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/800s",
      "aperture": "f/7.1",
      "iso": "ISO 125",
      "focalLength": "300mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 72460
  },
  {
    "id": "av-mu-001",
    "title": "Hickory Aviation Museum Historic Combat Flightline",
    "filename": "hickory_museum.jpg",
    "category": "museums",
    "categoryName": "Aviation Museums",
    "tag": "Hickory Aviation Museum NC",
    "src": "/photos/museums/hickory_museum.jpg",
    "location": "Hickory Regional Airport, North Carolina",
    "year": "2020",
    "description": "Extremely detailed 1787x1340 capture from aviography.co.uk showing preserved military carrier jets and historic tactical fighters.",
    "featured": true,
    "camera": "Canon PowerShot G1 X",
    "lens": "Canon 15-60mm f/2.8-5.8",
    "exif": {
      "shutter": "1/640s",
      "aperture": "f/5.6",
      "iso": "ISO 100",
      "focalLength": "28mm"
    },
    "width": 1787,
    "height": 1340,
    "fileSize": 557936
  },
  {
    "id": "av-mu-002",
    "title": "Boeing B-17G Flying Fortress 'Sentimental Journey'",
    "filename": "b17_falcon_field.jpg",
    "category": "museums",
    "categoryName": "Aviation Museums",
    "tag": "Falcon Field Warbirds",
    "src": "/photos/museums/b17_falcon_field.jpg",
    "location": "Mesa Falcon Field, Arizona",
    "year": "2019",
    "description": "Restored WWII heavy bomber purring on the Arizona desert apron with Wright R-1820 Cyclones idling.",
    "featured": true,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/320s",
      "aperture": "f/11",
      "iso": "ISO 100",
      "focalLength": "100mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 168905
  },
  {
    "id": "av-mu-003",
    "title": "North American P-51D Mustang Escort Fighter",
    "filename": "p51_falcon_field.jpg",
    "category": "museums",
    "categoryName": "Aviation Museums",
    "tag": "Falcon Field Warbirds",
    "src": "/photos/museums/p51_falcon_field.jpg",
    "location": "Mesa Falcon Field, Arizona",
    "year": "2019",
    "description": "Polished aluminum fuselage reflecting desert sunlight with classic four-blade paddle propeller.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/250s",
      "aperture": "f/9.0",
      "iso": "ISO 100",
      "focalLength": "135mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 105090
  },
  {
    "id": "av-mu-004",
    "title": "Battle of Britain Spitfire & Modern Typhoon Flight",
    "filename": "spitfire_typhoon_bbmf.jpg",
    "category": "museums",
    "categoryName": "Aviation Museums",
    "tag": "BBMF Heritage",
    "src": "/photos/museums/spitfire_typhoon_bbmf.jpg",
    "location": "RAF Coningsby / BBMF",
    "year": "2020",
    "description": "Seventy years of air defense in a single formation: Merlin-powered Supermarine Spitfire flying formation with delta-wing Typhoon.",
    "featured": true,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/320s",
      "aperture": "f/10",
      "iso": "ISO 100",
      "focalLength": "200mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 80576
  },
  {
    "id": "av-cv-001",
    "title": "F/A-18F Super Hornet Steam Catapult Launch",
    "filename": "cvn71_hornet_launch.jpg",
    "category": "carriers",
    "categoryName": "Aircraft Carriers",
    "tag": "CVN-71 USS Theodore Roosevelt",
    "src": "/photos/carriers/cvn71_hornet_launch.jpg",
    "location": "Flight Deck, USS Theodore Roosevelt (CVN-71)",
    "year": "2018",
    "description": "Steam vapor venting from the waist catapult tracks as a strike fighter accelerates from 0 to 160 knots in two seconds.",
    "featured": true,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/2000s",
      "aperture": "f/5.6",
      "iso": "ISO 250",
      "focalLength": "200mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 164636
  },
  {
    "id": "av-cv-002",
    "title": "Carrier Strike Flight Deck Catapult Acceleration",
    "filename": "cvn71_catapult_exhaust.jpg",
    "category": "carriers",
    "categoryName": "Aircraft Carriers",
    "tag": "CVN-71 USS Theodore Roosevelt",
    "src": "/photos/carriers/cvn71_catapult_exhaust.jpg",
    "location": "Flight Deck, USS Theodore Roosevelt",
    "year": "2018",
    "description": "Carrier flight deck crew and green shirts monitoring tension on the catapult shuttle prior to launch stroke.",
    "featured": false,
    "camera": "Canon EOS 7D",
    "lens": "Canon EF 100-400mm f/4.5-5.6L IS",
    "exif": {
      "shutter": "1/2000s",
      "aperture": "f/5.6",
      "iso": "ISO 250",
      "focalLength": "180mm"
    },
    "width": 900,
    "height": 600,
    "fileSize": 164636
  }
];
