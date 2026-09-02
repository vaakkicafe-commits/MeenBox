export interface PackSize {
  unit: "200g" | "250g" | "500g" | "1kg";
  price: number;
}

export interface PantryItem {
  id: string;
  category: "dried_fish" | "fry_masala" | "curry_paste";
  nameEnglish: string;
  nameTamil: string;
  badge?: string;
  description: string;
  culinaryUse: string;
  image: string;
  packSizes: PackSize[];
  shelfLife: string; // e.g. "6 Months", "90 Days"
  isStocked: boolean;
  pairingFish?: string[]; // IDs of fresh fish this pairs with for 1-click cart cross-sell
}

export const PANTRY_CATALOG: PantryItem[] = [
  // 1. SUN-DRIED FISH (KARUVADU)
  {
    id: "nethili-karuvadu",
    category: "dried_fish",
    nameEnglish: "Nethili Karuvadu",
    nameTamil: "நெத்திலி கருவாடு",
    badge: "Coastal Dried",
    description: "Salted and sun-dried whitebait anchovies. Vacuum-sealed in odor-free food-grade pouches.",
    culinaryUse: "Crispy deep fry, Thakkali Thokku, or Mor Kuzhambu side",
    image: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "250g", price: 150 },
      { unit: "500g", price: 280 },
      { unit: "1kg", price: 540 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
  },
  {
    id: "vanjaram-karuvadu",
    category: "dried_fish",
    nameEnglish: "Vanjaram Karuvadu",
    nameTamil: "வஞ்சிரம் கருவாடு",
    badge: "Chef Choice",
    description: "Premium sun-cured King Seer fish steaks. Rich aroma, meaty texture with minimal bone.",
    culinaryUse: "Tawa oil roast, bone-free spicy tamarind curry",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "250g", price: 270 },
      { unit: "500g", price: 520 },
      { unit: "1kg", price: 990 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
  },
  {
    id: "paal-sura-karuvadu",
    category: "dried_fish",
    nameEnglish: "Paal Sura Karuvadu",
    nameTamil: "பால் சுறா கருவாடு",
    badge: "Traditional Puttu",
    description: "Tender milk shark sun-dried with sea salt. Highly prized for traditional wellness recipes.",
    culinaryUse: "Herbal shredded Sura Puttu with shallots & green chillies",
    image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "250g", price: 220 },
      { unit: "500g", price: 420 },
      { unit: "1kg", price: 800 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
  },
  {
    id: "kavalai-karuvadu",
    category: "dried_fish",
    nameEnglish: "Kavalai Karuvadu",
    nameTamil: "கவலை கருவாடு",
    description: "Traditional coastal sardinella sun-dried on ocean racks. Intensely flavorful.",
    culinaryUse: "Village-style Kathirikai (brinjal) puli kuzhambu",
    image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "250g", price: 100 },
      { unit: "500g", price: 190 },
      { unit: "1kg", price: 360 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
  },
  {
    id: "vanjaram-thala",
    category: "dried_fish",
    nameEnglish: "Vanjaram Karuvattu Thala",
    nameTamil: "வஞ்சிரம் கருவாட்டு தலை",
    badge: "Rich Broth",
    description: "Sun-cured Seer fish head pieces. Infuses broths and gravies with deep umami richness.",
    culinaryUse: "Intense aroma broth & brinjal drumstick kuzhambu",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "250g", price: 120 },
      { unit: "500g", price: 220 },
      { unit: "1kg", price: 400 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
  },
  {
    id: "manal-eral-dried",
    category: "dried_fish",
    nameEnglish: "Manal Eral (Dried Shrimp)",
    nameTamil: "காய்ந்த இறால்",
    badge: "High Protein",
    description: "Tiny pink sea prawns cleaned and naturally dried under the Bay of Bengal sun.",
    culinaryUse: "Chettinad Manga Thokku, crunchy stir-fry podi",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "250g", price: 200 },
      { unit: "500g", price: 380 },
      { unit: "1kg", price: 720 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
  },

  // 2. STONE-GROUND FRESH MASALAS & PASTES
  {
    id: "madras-tawa-fry-paste",
    category: "fry_masala",
    nameEnglish: "Madras Tawa Fish Fry Paste",
    nameTamil: "மெட்ராஸ் மீன் வறுவல் மசாலா",
    badge: "Stone-Ground",
    description: "Small-batch wet marinade crafted with Byadgi chilli, ginger, garlic, curry leaves & cold-pressed gingelly oil.",
    culinaryUse: "Coat fish steaks for 15 mins before pan frying. Perfect with Vanjaram & Sankara.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "200g", price: 69 },
      { unit: "500g", price: 150 }
    ],
    shelfLife: "90 Days (Airtight Tub)",
    isStocked: true,
    pairingFish: ["vanjaram", "sankara", "sheela", "koduva", "vavval-white"]
  },
  {
    id: "chettinad-roast-podi",
    category: "fry_masala",
    nameEnglish: "Chettinad Spicy Roast Podi",
    nameTamil: "செட்டிநாடு மிளகு வறுவல் பொடி",
    badge: "Dry Blend",
    description: "Stone-ground roasted fennel, tellicherry black pepper, roasted coriander & red chillies.",
    culinaryUse: "Crispy crust seasoning for Pomfret, Barracuda, and Prawn fry.",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "200g", price: 79 },
      { unit: "500g", price: 170 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
    pairingFish: ["karuppu-vavval", "vavval-white", "eral", "mathi", "ayala"]
  },
  {
    id: "royapuram-kuzhambu-paste",
    category: "curry_paste",
    nameEnglish: "Royapuram Meen Kuzhambu Paste",
    nameTamil: "ராயபுரம் மீன் குழம்பு பேஸ்ட்",
    badge: "Wild Tamarind",
    description: "Thick gravy base with roasted small onions, garlic, sour gundu chilli, country tomato & aged wild tamarind.",
    culinaryUse: "Add 500ml water to paste, boil for 7 mins, drop fresh fish in and simmer. No extra spices needed!",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "200g", price: 89 },
      { unit: "500g", price: 190 }
    ],
    shelfLife: "90 Days",
    isStocked: true,
    pairingFish: ["vanjaram", "sankara", "koduva", "ayala", "viral", "nethili"]
  },
  {
    id: "village-karuvadu-mix",
    category: "curry_paste",
    nameEnglish: "Village Karuvadu Kuzhambu Mix",
    nameTamil: "கிராமத்து கருவாட்டு குழம்பு மசாலா",
    badge: "Claypot Recipe",
    description: "Cumin, fenugreek, coriander & organic turmeric tailored specially for dried fish with brinjal & drumstick.",
    culinaryUse: "Cook with tamarind extract, brinjal, drumstick & dried fish for authentic village aroma.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    packSizes: [
      { unit: "200g", price: 75 },
      { unit: "500g", price: 160 }
    ],
    shelfLife: "6 Months",
    isStocked: true,
    pairingFish: ["nethili-karuvadu", "kavalai-karuvadu", "vanjaram-thala"]
  }
];
