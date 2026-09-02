import { NextResponse } from "next/server";

// Shared in-memory active orders store
const activeOrdersMap: Record<string, any> = {
  "KSM-1041": {
    id: "KSM-1041",
    customerName: "Rajesh K.",
    phone: "9840123456",
    status: "dispatched", // 'confirmed' | 'procured' | 'cleaned_packed' | 'dispatched' | 'delivered'
    itemsSummary: "1kg Vanjaram (Fry Slices)",
    isCut: true,
    cuttingOption: "Fry Slices (Steaks)",
    deliveryMode: "porter",
    address: "14, 2nd Avenue, Anna Nagar East",
    pincode: "600040",
    grandTotal: 965,
    eta: "7:25 AM",
    driver: {
      name: "S. Murugan",
      phone: "+91 98401 10022",
      vehicle: "TN 04 BV 4912 (Bajaj Pulsar / Porter Insulated Bag)",
    },
  },
  "KSM-948201": {
    id: "KSM-948201",
    customerName: "Karthik Rajan",
    phone: "9840192831",
    status: "dispatched",
    itemsSummary: "1kg Vanjaram + 500g Sankara",
    isCut: true,
    cuttingOption: "Fry Slices & Curry Cut",
    deliveryMode: "porter",
    address: "Flat 4B, Coastal Palms, Besant Nagar",
    pincode: "600090",
    grandTotal: 1160,
    eta: "7:25 AM",
    driver: {
      name: "Murugan S.",
      phone: "+91 98401 54321",
      vehicle: "TN 04 BV 4912 (Porter Cooler Box)",
    },
  },
};

// GET: Live tracking page calls this every 5 seconds to poll real-time status
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId") || "KSM-1041";

  const order = activeOrdersMap[orderId] || {
    id: orderId,
    customerName: "Customer",
    phone: "9840123456",
    status: "dispatched",
    eta: "7:25 AM",
    deliveryMode: "porter",
    driver: {
      name: "S. Murugan",
      phone: "+91 98401 10022",
      vehicle: "TN 04 BV 4912 (Porter Bike)",
    },
  };

  return NextResponse.json({ success: true, order });
}

// POST: Triggered by Porter Webhook or Delivery Partner App when delivered
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, newStatus } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: "orderId and newStatus required" }, { status: 400 });
    }

    if (!activeOrdersMap[orderId]) {
      activeOrdersMap[orderId] = {
        id: orderId,
        customerName: body.customerName || "Customer",
        phone: body.phone || "9840123456",
        status: newStatus,
        grandTotal: body.grandTotal || 965,
        deliveryMode: body.deliveryMode || "porter",
      };
    } else {
      activeOrdersMap[orderId].status = newStatus;
    }

    // If newly marked delivered, dispatch two-way WhatsApp alerts (to customer and owner)
    if (newStatus === "delivered") {
      try {
        const origin = req.headers.get("origin") || "http://localhost:3000";
        await fetch(`${origin}/api/notifications/whatsapp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "ORDER_DELIVERED",
            order: activeOrdersMap[orderId],
          }),
        });
      } catch (e) {
        console.error("Failed to notify delivery via internal fetch:", e);
      }
    }

    return NextResponse.json({ success: true, orderId, status: newStatus });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Status update failed" }, { status: 500 });
  }
}
