import { Club, PCSpec, Review } from "../data/mockClubs";
import { config } from "../config";

const GOOGLE_PLACES_BASE = "https://places.googleapis.com/v1/places:searchText";

const UNSPLASH_GAMING = [
  "https://images.unsplash.com/photo-1701281941392-fd6c2d8d652b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1723792306904-c417c0da40e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1715279240000-9a50953e327d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1726442131094-4fe2fa8e7d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1679766900523-d8e1a1393d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1629148769165-069e8a9e8a30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1598550476439-6840a69e02c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
  "https://images.unsplash.com/photo-1612282132031-ce5b14214286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
];

const GPU_OPTIONS = ["RTX 4090", "RTX 4080 Super", "RTX 4070 Ti", "RTX 4070", "RTX 3080", "RTX 3070"];
const CPU_OPTIONS = ["i9-14900K", "i9-14900K", "i7-14700K", "i7-13700K", "i5-13600K", "i5-12600K"];
const RAM_OPTIONS = ["64GB DDR5", "32GB DDR5", "32GB DDR4", "16GB DDR4"];
const PERIPHERAL_SETS = [
  ["Razer DeathAdder V3", "SteelSeries Apex Pro", "HyperX Cloud III", "ASUS ROG 360Hz"],
  ["Logitech G Pro X", "Corsair K100", "SteelSeries Arctis Nova Pro"],
  ["Logitech G502 X", "Corsair K95", "HyperX Cloud Alpha"],
  ["Razer Viper V2", "Logitech G815", "Corsair HS80"],
  ["Logitech G203", "Redragon K552", "HyperX Cloud Stinger"],
];

const REAL_CLUBS_ALMATY = [
  { name: "Seven CyberSport", address: "Толе би, 294, Алматы" },
  { name: "X-Game", address: "Алтынсарина проспект, 24а, Алматы" },
  { name: "Click Me", address: "5-й микрорайон, 3а, Алматы" },
  { name: "Galamtor Vip", address: "Ауэзова, 15/5, Алматы" },
  { name: "DofG Cyber Club", address: "Прокофьева, 230, Алматы" },
  { name: "Trinity Cyber Arena", address: "Аксай-2, 22/2, Алматы" },
  { name: "RAVENS Cyber Arena", address: "Сатпаева, 88а/1, Алматы" },
  { name: "Ferrum Cyber Sport", address: "Розыбакиева, 75, Алматы" },
  { name: "Qaru Cyber Lounge", address: "Terracotta, Абая 164/6, Алматы" },
  { name: "Off Cybersport", address: "Жетысу 4-й микрорайон, 12, Алматы" },
  { name: "Vertigo Gaming", address: "Аксай-2, 22/2, Алматы" },
  { name: "ACE Cyber Club", address: "Тимирязева, 42 к3, Алматы" },
  { name: "OneSix Cyber Zone", address: "Курмангазы, 35, Алматы" },
  { name: "Cyber X Arena", address: "Желтоксан, 118, Алматы" },
  { name: "Gotham Internet & PS Club", address: "Ауэзова, 64/4, Алматы" },
  { name: "Battle Palace", address: "Сейфуллина, 469/2, Алматы" },
  { name: "TeamPlay", address: "9-й микрорайон, 3а, Алматы" },
  { name: "Vulkan Arena", address: "Абая, 109в, Алматы" },
  { name: "YOLO Cyber Club", address: "Масанчи, 78, Алматы" },
  { name: "Rampage Game Zone", address: "Алтынсарина, 24а, Алматы" },
  { name: "FatNar Gaming", address: "Достык, 42, Алматы" },
  { name: "Max Play", address: "Сатпаева, 7а, Алматы" },
  { name: "Cyber Zone FORZE", address: "Тимирязева, 42, Алматы" },
  { name: "Egoist Game Room", address: "Розыбакиева, 75, Алматы" },
  { name: "The One Pro", address: "Аксай-5, 25, Алматы" },
  { name: "SkySport", address: "Аксай 3а микрорайон, 76/1, Алматы" },
  { name: "Game Over Center", address: "Жуалы, 90а, Алматы" },
  { name: "Nevermore Game Club", address: "Жандосова, 8, Алматы" },
  { name: "LION Cyber Club", address: "Аксай 2-й микрорайон, 12, Алматы" },
  { name: "Monster Game Zone", address: "6-й микрорайон, 11, Алматы" },
  { name: "Game Palace", address: "Рыскулбекова, 28/5, Алматы" },
  { name: "Upgrade PC Club", address: "Толе би, 279Б/1, Алматы" },
  { name: "Giga Net", address: "Толе би, 294, Алматы" },
  { name: "New Wave", address: "Аксай 3-й микрорайон, 5, Алматы" },
  { name: "QWERTY Internet Center", address: "Масанчи, 78, Алматы" },
  { name: "KIBERone", address: "Ауэзова, 15/5, Алматы" },
  { name: "BITLAB Academy", address: "Сатпаева, 7а, Алматы" },
];

const REVIEW_TEXTS = [
  "Great place! Amazing equipment and atmosphere.",
  "Best gaming club in the area, highly recommended!",
  "Good service and nice PCs. Will come again.",
  "Decent place for casual gaming sessions.",
  "Top notch equipment, the staff is very friendly.",
  "Clean, fast PCs, and great vibes all around.",
  "Awesome experience, will definitely return!",
];

const RATING_CITIES: Record<string, { lat: number; lng: number }> = {
  "Almaty": { lat: 43.2382, lng: 76.9454 },
  "Astana": { lat: 51.1693, lng: 71.4490 },
  "Moscow": { lat: 55.7558, lng: 37.6173 },
  "Saint Petersburg": { lat: 59.9343, lng: 30.3351 },
  "Aktau": { lat: 43.6507, lng: 51.1930 },
  "Atyrau": { lat: 47.1167, lng: 51.9167 },
  "Karaganda": { lat: 49.8069, lng: 73.0854 },
  "Shymkent": { lat: 42.3417, lng: 69.5901 },
  "Pavlodar": { lat: 52.2873, lng: 76.9674 },
  "Kokshetau": { lat: 53.2833, lng: 69.3833 },
  "Taldykorgan": { lat: 45.0156, lng: 78.3715 },
  "Semey": { lat: 50.4267, lng: 80.2667 },
  "Uralsk": { lat: 51.2333, lng: 51.3667 },
  "Kostanay": { lat: 53.2144, lng: 63.6246 },
  "Kyzylorda": { lat: 44.8528, lng: 65.5092 },
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePCs(clubId: string, pcCount: number): PCSpec[] {
  const seats: PCSpec[] = [];
  let id = 1;

  const zones: ("VIP" | "Pro" | "Standard")[] = pcCount > 20
    ? ["VIP", "Pro", "Standard"]
    : pcCount > 12
    ? ["Pro", "Standard"]
    : ["Standard"];

  const zoneDistribution: ("VIP" | "Pro" | "Standard")[] = [];
  if (zones.includes("VIP")) {
    zoneDistribution.push(...Array(Math.ceil(pcCount * 0.15)).fill("VIP" as const));
  }
  if (zones.includes("Pro")) {
    zoneDistribution.push(...Array(Math.ceil(pcCount * 0.35)).fill("Pro" as const));
  }
  const remaining = pcCount - zoneDistribution.length;
  zoneDistribution.push(...Array(remaining).fill("Standard" as const));

  zoneDistribution.forEach((zone, i) => {
    const priceMap = { VIP: 8, Pro: 5, Standard: 2.5 };
    const gpuIdx = zone === "VIP" ? 0 : zone === "Pro" ? 2 : 4;
    seats.push({
      id: `${clubId}-${id++}`,
      seatNumber: `${zone[0]}${i + 1}`,
      gpu: GPU_OPTIONS[gpuIdx + (i % 2)],
      hz: zone === "VIP" ? 360 : zone === "Pro" ? 240 : 144,
      ram: zone === "VIP" ? RAM_OPTIONS[0] : zone === "Pro" ? RAM_OPTIONS[1] : RAM_OPTIONS[2],
      cpu: CPU_OPTIONS[gpuIdx + (i % 2)],
      peripherals: randomFrom(PERIPHERAL_SETS),
      pricePerHour: priceMap[zone],
      zone,
      status: Math.random() > 0.3 ? "available" : "occupied",
      row: zone === "VIP" ? 1 : zone === "Pro" ? 2 : 3,
      col: i % 8,
    });
  });

  return seats;
}

function generateReviews(count: number): Review[] {
  const names = ["Alex T.", "ShadowWolf", "CyberNova", "NightRaider", "PixelQueen", "GameMaster", "ProGamer99", "NoScopeKing"];
  return Array.from({ length: count }, (_, i) => ({
    id: `rev-${i}`,
    userName: randomFrom(names),
    userLevel: randomInt(5, 60),
    rating: randomInt(3, 5),
    text: randomFrom(REVIEW_TEXTS),
    date: new Date(Date.now() - randomInt(0, 30) * 86400000).toISOString().slice(0, 10),
    helpful: randomInt(0, 40),
  }));
}

function generateClubName(): string {
  return `${randomFrom(CLUB_NAME_PREFIXES)} ${randomFrom(CLUB_NAME_SUFFIXES)}`;
}

function generateAddress(city: string): string {
  const street = randomFrom(STREET_NAMES);
  const building = randomInt(1, 200);
  return `${building} ${street}, ${city}`;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generateClub(index: number, lat: number, lng: number, city: string, country: string): Club {
  const realClub = REAL_CLUBS_ALMATY[index % REAL_CLUBS_ALMATY.length];
  const pcCount = randomInt(12, 35);
  const zones: ("VIP" | "Pro" | "Standard")[] = pcCount > 20
    ? ["VIP", "Pro", "Standard"]
    : pcCount > 12
    ? ["Pro", "Standard"]
    : ["Standard"];

  const cityCoords = RATING_CITIES[city] || { lat, lng };
  const clubLat = cityCoords.lat + (Math.random() - 0.5) * 0.06;
  const clubLng = cityCoords.lng + (Math.random() - 0.5) * 0.06;

  return {
    id: `club-gen-${index}`,
    name: realClub.name,
    address: realClub.address,
    distance: "—",
    rating: +(3.8 + Math.random() * 1.1).toFixed(1),
    reviewCount: randomInt(20, 300),
    photos: [randomFrom(UNSPLASH_GAMING), randomFrom(UNSPLASH_GAMING)],
    openingHours: [{ day: "Mon–Sun", hours: "10:00 – 02:00" }],
    zones,
    pcs: generatePCs(`club-gen-${index}`, pcCount),
    reviews: generateReviews(randomInt(3, 6)),
    minPricePerHour: zones.includes("Standard") ? 2.5 : zones.includes("Pro") ? 4 : 6,
    tags: randomFrom([
      ["24/7", "WiFi", "Café", "Tournaments"],
      ["VIP Zone", "Streamer Setup", "LAN Events"],
      ["Budget Friendly", "Student Discount", "Snack Bar"],
      ["Pro Gear", "VR Room", "Free Parking"],
    ]),
    availableSeats: Math.floor(pcCount * 0.6),
    totalSeats: pcCount,
    lat: clubLat,
    lng: clubLng,
    city,
    country,
  };
}

async function fetchFromGooglePlaces(lat: number, lng: number, city: string): Promise<Club[]> {
  if (!config.googlePlacesApiKey) return [];

  const queries = [
    `компьютерный клуб ${city}`,
    `gaming club ${city}`,
    `киберспортивный клуб ${city}`,
    `internet cafe ${city}`,
  ];

  for (const query of queries) {
    try {
      const response = await fetch(GOOGLE_PLACES_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": config.googlePlacesApiKey,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.regularOpeningHours",
        },
        body: JSON.stringify({
          textQuery: query,
          locationBias: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: 20000,
            },
          },
          maxResultCount: 20,
        }),
      });

      if (!response.ok) continue;
      const data = await response.json();
      if (data.places?.length > 0) {
        return data.places.map((p: any, i: number): Club => {
          const pcCount = randomInt(12, 35);
          const zones: ("VIP" | "Pro" | "Standard")[] = pcCount > 20
            ? ["VIP", "Pro", "Standard"]
            : ["Pro", "Standard"];

          return {
            id: `club-gp-${i}`,
            name: p.displayName?.text || p.formattedAddress || generateClubName(),
            address: p.formattedAddress || generateAddress(city),
            distance: "—",
            rating: p.rating || +(3.8 + Math.random() * 1.1).toFixed(1),
            reviewCount: p.userRatingCount || randomInt(10, 100),
            photos: [randomFrom(UNSPLASH_GAMING), randomFrom(UNSPLASH_GAMING)],
            openingHours: p.regularOpeningHours?.weekdayDescriptions
              ? p.regularOpeningHours.weekdayDescriptions.map((d: string) => ({ day: d.split(":")[0], hours: d.split(": ")[1] || d }))
              : [{ day: "Mon–Sun", hours: "10:00 – 02:00" }],
            zones,
            pcs: generatePCs(`club-gp-${i}`, pcCount),
            reviews: generateReviews(randomInt(3, 6)),
            minPricePerHour: zones.includes("Standard") ? 2.5 : zones.includes("Pro") ? 4 : 6,
            tags: randomFrom([
              ["24/7", "WiFi", "Café"],
              ["Tournaments", "VIP Zone", "Streamer Setup"],
              ["Pro Gear", "LAN Events"],
            ]),
            availableSeats: Math.floor(pcCount * 0.6),
            totalSeats: pcCount,
            lat: p.location?.latitude || lat,
            lng: p.location?.longitude || lng,
            city,
            country: "",
          };
        });
      }
    } catch {
      continue;
    }
  }
  return [];
}

export async function fetchClubsNearby(lat: number, lng: number, city: string, country: string): Promise<Club[]> {
  if (config.googlePlacesApiKey) {
    const googleClubs = await fetchFromGooglePlaces(lat, lng, city);
    if (googleClubs.length > 0) {
      return googleClubs.map(c => ({
        ...c,
        distance: `${haversineDistance(lat, lng, c.lat!, c.lng!).toFixed(1)} km`,
      }));
    }
  }

  const clubCount = randomInt(4, 8);
  const clubs: Club[] = [];

  for (let i = 0; i < clubCount; i++) {
    const club = generateClub(i, lat, lng, city, country);
    club.distance = `${haversineDistance(lat, lng, club.lat!, club.lng!).toFixed(1)} km`;
    clubs.push(club);
  }

  return clubs;
}
