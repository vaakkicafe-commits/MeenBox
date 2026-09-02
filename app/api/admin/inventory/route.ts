import { NextResponse } from "next/server";
import { FISH_CATALOG } from "@/data/fishCatalog";

// In-memory daily inventory state (persisted during session)
let dailyInventoryState = FISH_CATALOG.map((fish) => ({
  id: fish.id,
  nameEnglish: fish.nameEnglish,
  nameTamil: fish.nameTamil,
  image: fish.image,
  price500g: fish.price500g,
  price1kg: fish.price1kg,
  isAvailable: true,
  cleaningFee: 25,
}));

export async function GET() {
  return NextResponse.json({ success: true, items: dailyInventoryState });
}

export async function POST(req: Request) {
  try {
    const updatedItems = await req.json();
    if (Array.isArray(updatedItems)) {
      dailyInventoryState = updatedItems;
    }
    return NextResponse.json({ success: true, updatedCount: dailyInventoryState.length });
  } catch {
    return NextResponse.json({ error: "Failed to update daily catalog" }, { status: 500 });
  }
}
