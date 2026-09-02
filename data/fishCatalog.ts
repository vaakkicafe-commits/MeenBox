export interface PrepOption {
  id: string;
  name: string;
  description: string;
  yieldPercent: number; // Percentage of weight retained after cleaning
  cleaningFee?: number;
}

export const UNCUT_PREP_OPTION: PrepOption = {
  id: "whole-uncut",
  name: "Whole Uncut (முழு மீன்)",
  description: "Whole fresh fish as landed from the boat. No gutting or descaling.",
  yieldPercent: 100,
  cleaningFee: 0,
};

export const STANDARD_CLEANING_FEE = 25; // ₹25 nominal cutting & gutting fee

export interface BulkTier {
  minKg: number; // e.g. 5, 10, 25
  pricePerKg: number; // Discounted rate per kg
  packagingType: "Plastic Crate with Flake Ice" | "Insulated Thermocol Masterbox";
}

export interface FishItem {
  id: string;
  nameTamil: string;
  nameEnglish: string;
  marketName: string;
  badge?: string;
  image: string;
  price500g: number;
  price1kg: number;
  bulkTiers?: BulkTier[];
  isAvailable?: boolean;
  cleaningFee?: number;
  prepOptions: PrepOption[];
}

export const FISH_CATALOG: FishItem[] = [
  {
    id: "vanjaram",
    nameTamil: "வஞ்சிரம்",
    nameEnglish: "Vanjaram",
    marketName: "Seer Fish / King Mackerel",
    badge: "Catch of the Day",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    price500g: 450,
    price1kg: 850,
    prepOptions: [
      { id: "fry-slice", name: "Fry Slices (Steaks)", description: "Center-cut circular steaks perfect for frying", yieldPercent: 82, cleaningFee: 25 },
      { id: "curry-cut", name: "Curry Cut", description: "Steaks including head & tail pieces for rich broth", yieldPercent: 85, cleaningFee: 25 },
      { id: "boneless", name: "Boneless Cubes", description: "Skinless, boneless cubes for fish tikka or biryani", yieldPercent: 65, cleaningFee: 25 }
    ]
  },
  {
    id: "sankara",
    nameTamil: "சங்கரா",
    nameEnglish: "Sankara",
    marketName: "Red Snapper",
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80",
    price500g: 220,
    price1kg: 400,
    prepOptions: [
      { id: "whole-cleaned", name: "Whole Cleaned", description: "Gutted, descaled, gills removed with slits for tawa fry", yieldPercent: 78, cleaningFee: 25 },
      { id: "curry-cut", name: "Curry Cut", description: "Medium bone-in chunks for spicy Meen Kuzhambu", yieldPercent: 75, cleaningFee: 25 }
    ]
  },
  {
    id: "vavval-white",
    nameTamil: "வெள்ளை வவ்வால்",
    nameEnglish: "Vavval",
    marketName: "White Pomfret",
    badge: "Premium Catch",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    price500g: 480,
    price1kg: 920,
    prepOptions: [
      { id: "whole-cleaned", name: "Whole Gutted", description: "Scored on both sides for whole fish pan roast", yieldPercent: 85, cleaningFee: 25 },
      { id: "steaks", name: "Tawa Fry Steaks", description: "Clean transverse slices", yieldPercent: 82, cleaningFee: 25 }
    ]
  },
  {
    id: "karuppu-vavval",
    nameTamil: "கருப்பு வவ்வால்",
    nameEnglish: "Karuppu Vavval",
    marketName: "Black Pomfret",
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
    price500g: 350,
    price1kg: 650,
    prepOptions: [
      { id: "whole-cleaned", name: "Whole Cleaned", description: "Gutted and descaled", yieldPercent: 80, cleaningFee: 25 },
      { id: "curry-cut", name: "Curry Cut", description: "Steaks for curry and deep fry", yieldPercent: 80, cleaningFee: 25 }
    ]
  },
  {
    id: "sheela",
    nameTamil: "சீலா",
    nameEnglish: "Sheela",
    marketName: "Barracuda",
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80",
    price500g: 260,
    price1kg: 480,
    prepOptions: [
      { id: "finger-cut", name: "Fry Finger Cuts", description: "Long fillets sliced for crispy fry", yieldPercent: 70, cleaningFee: 25 },
      { id: "curry-cut", name: "Curry Cut", description: "Standard bone-in curry slices", yieldPercent: 78, cleaningFee: 25 }
    ]
  },
  {
    id: "mathi",
    nameTamil: "மத்தி",
    nameEnglish: "Mathi",
    marketName: "Sardine",
    badge: "Omega-3 Rich",
    image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80",
    price500g: 110,
    price1kg: 200,
    prepOptions: [
      { id: "headless", name: "Headless & Gutted", description: "Heads pinched off, viscera cleaned", yieldPercent: 72, cleaningFee: 25 },
      { id: "whole-gutted", name: "Whole Gutted", description: "Head intact, stomach cleaned", yieldPercent: 82, cleaningFee: 25 }
    ]
  },
  {
    id: "ayala",
    nameTamil: "அயல",
    nameEnglish: "Ayala",
    marketName: "Indian Mackerel",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
    price500g: 140,
    price1kg: 260,
    prepOptions: [
      { id: "whole-gutted", name: "Whole Gutted (Slitted)", description: "Scored for spicy masala stuffing", yieldPercent: 80, cleaningFee: 25 },
      { id: "curry-cut", name: "Curry Cut", description: "Divided into 3-4 pieces per fish", yieldPercent: 78, cleaningFee: 25 }
    ]
  },
  {
    id: "nethili",
    nameTamil: "நெத்திலி",
    nameEnglish: "Nethili",
    marketName: "Anchovy",
    image: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&w=800&q=80",
    price500g: 130,
    price1kg: 240,
    prepOptions: [
      { id: "head-removed", name: "Head & Intestine Cleaned", description: "Headless, degutted, ready for quick fry", yieldPercent: 70, cleaningFee: 25 }
    ]
  },
  {
    id: "paal-sura",
    nameTamil: "பால் சுறா",
    nameEnglish: "Paal Sura",
    marketName: "Baby Shark",
    badge: "For Puttu",
    image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80",
    price500g: 280,
    price1kg: 520,
    prepOptions: [
      { id: "puttu-cut", name: "Skinless Cubes for Puttu", description: "Thick skin removed, boneless cubes", yieldPercent: 75, cleaningFee: 25 },
      { id: "curry-cut", name: "Bone-in Curry Cut", description: "Soft cartilage intact", yieldPercent: 85, cleaningFee: 25 }
    ]
  },
  {
    id: "koduva",
    nameTamil: "கொடுவா",
    nameEnglish: "Koduva",
    marketName: "Asian Seabass / Barramundi",
    badge: "Chef Choice",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80",
    price500g: 380,
    price1kg: 720,
    prepOptions: [
      { id: "fillet", name: "Boneless Fillet", description: "Skin-on or skinless tender fillets", yieldPercent: 55, cleaningFee: 25 },
      { id: "curry-cut", name: "Curry Cut with Head", description: "Large chunky steaks", yieldPercent: 80, cleaningFee: 25 }
    ]
  },
  {
    id: "viral",
    nameTamil: "விரால்",
    nameEnglish: "Viral",
    marketName: "Murrel / Snakehead",
    image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80",
    price500g: 320,
    price1kg: 600,
    prepOptions: [
      { id: "steaks", name: "Steak Fry Cut", description: "Firm round slices", yieldPercent: 78, cleaningFee: 25 },
      { id: "curry-cut", name: "Curry Cut", description: "Traditional Tamil village style cut", yieldPercent: 82, cleaningFee: 25 }
    ]
  },
  {
    id: "eral",
    nameTamil: "இறால்",
    nameEnglish: "Eral",
    marketName: "Sea Prawns / Shrimp",
    badge: "Fast Moving",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    price500g: 290,
    price1kg: 550,
    prepOptions: [
      { id: "peeled-deveined", name: "Peeled & Deveined", description: "Shell, head & intestinal vein removed", yieldPercent: 50, cleaningFee: 25 },
      { id: "head-removed", name: "Shell-On (Headless)", description: "Head removed, shell kept for flavor", yieldPercent: 70, cleaningFee: 25 }
    ]
  }
];
