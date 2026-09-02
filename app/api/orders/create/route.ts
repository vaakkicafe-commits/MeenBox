import { NextResponse } from "next/server";

// In-memory store for orders
const ordersStore: Record<string, any> = {
  "KSM-1041": {
    orderId: "KSM-1041",
    customerName: "Rajesh K.",
    phone: "9840123456",
    deliveryMode: "porter",
    address: {
      address: "14, 2nd Avenue, Anna Nagar East",
      pincode: "600040",
    },
    items: [
      {
        fishName: "Vanjaram (Seer Fish)",
        weight: "1kg",
        prep: "Fry Slices (Steaks)",
        isCut: true,
        unitPrice: 875,
        quantity: 1,
      },
    ],
    itemTotal: 875,
    packagingCharge: 30,
    porterDeliveryCharge: 60,
    grandTotal: 965,
    contingency: "substitute",
    status: "dispatched",
    eta: "7:25 AM",
    porterDriver: {
      name: "S. Murugan",
      phone: "+91 98401 10022",
      vehicle: "TN 04 BV 4912 (Bajaj Pulsar / Porter Insulated Bag)",
      porterTrackingUrl: "https://porter.in",
    },
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = "KSM-" + Math.floor(100000 + Math.random() * 900000);

    const itemsSummary = (body.items || [])
      .map(
        (i: any) =>
          `${i.quantity}x ${i.weight} ${i.fish?.nameEnglish || "Fish"} (${
            i.isCut ? i.prep?.name || "Cleaned" : "Whole Uncut"
          })`
      )
      .join(", ") || "Fresh Seafood Selection";

    const newOrder = {
      orderId,
      customerName: body.customerName || "Customer",
      phone: body.phone,
      deliveryMode: body.deliveryMode || "porter",
      address: body.address,
      items: body.items,
      itemTotal: body.itemTotal,
      packagingCharge: body.packagingCharge || 30,
      porterDeliveryCharge: body.porterDeliveryCharge || 0,
      grandTotal: body.grandTotal,
      contingency: body.contingency || "substitute",
      status: "confirmed",
      createdAt: new Date().toISOString(),
      eta: "7:15 AM - 7:45 AM",
      porterDriver: {
        name: "S. Murugan",
        phone: "+91 98401 10022",
        vehicle: "TN 04 BV 4912 (Porter Delivery Partner)",
        porterTrackingUrl: "https://porter.in",
      },
    };

    ordersStore[orderId] = newOrder;

    // Trigger two-way WhatsApp alert (to Customer and Owner)
    try {
      const origin = req.headers.get("origin") || "http://localhost:3000";
      await fetch(`${origin}/api/notifications/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "ORDER_PLACED",
          order: {
            id: orderId,
            customerName: newOrder.customerName,
            phone: newOrder.phone,
            itemsSummary,
            cuttingOption: body.items?.[0]?.isCut ? body.items[0].prep?.name : "Whole Uncut",
            isCut: body.items?.some((i: any) => i.isCut !== false),
            deliveryMode: newOrder.deliveryMode,
            address: body.address?.address || "Address Provided",
            pincode: body.address?.pincode || "600040",
            grandTotal: newOrder.grandTotal,
          },
        }),
      });
    } catch (e) {
      console.error("Internal WhatsApp trigger error on order create:", e);
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order placed successfully. Two-way WhatsApp notifications sent to Customer and Owner!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (orderId && ordersStore[orderId]) {
    return NextResponse.json({ success: true, order: ordersStore[orderId] });
  }

  // Fallback demo order
  const defaultOrder = {
    orderId: orderId || "KSM-1041",
    customerName: "Rajesh K.",
    phone: "9840123456",
    deliveryMode: "porter",
    address: {
      address: "14, 2nd Avenue, Anna Nagar East",
      pincode: "600040",
    },
    items: [
      {
        fishName: "Vanjaram (Seer Fish)",
        weight: "1kg",
        prep: "Fry Slices (Steaks)",
        isCut: true,
        unitPrice: 875,
        quantity: 1,
      },
    ],
    itemTotal: 875,
    packagingCharge: 30,
    porterDeliveryCharge: 60,
    grandTotal: 965,
    contingency: "substitute",
    status: "dispatched",
    eta: "7:25 AM",
    porterDriver: {
      name: "S. Murugan",
      phone: "+91 98401 10022",
      vehicle: "TN 04 BV 4912 (Porter Cooler Box)",
      porterTrackingUrl: "https://porter.in",
    },
  };

  return NextResponse.json({ success: true, order: defaultOrder });
}
