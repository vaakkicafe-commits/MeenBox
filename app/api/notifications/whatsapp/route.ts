import { NextResponse } from "next/server";

const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER || "919840110022"; // Manager/Owner mobile
const META_WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function sendWhatsAppMessage(toPhone: string, messageBody: string) {
  const cleanPhone = (toPhone || "").replace(/[^0-9]/g, "");
  const recipient = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

  if (!META_WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log(`\n========================================\n[SIMULATED WHATSAPP TO ${recipient}]:\n${messageBody}\n========================================\n`);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${META_WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: { preview_url: true, body: messageBody },
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("WhatsApp API error:", error);
    return { error: "Failed to dispatch via Meta API" };
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { event, order, type, phone, orderId, customerName, driverName, trackingUrl, eta } = data;

    // Support both event-based payload and direct type payload
    if (event === "ORDER_PLACED" || type === "ORDER_CONFIRMED") {
      const currentOrder = order || {
        id: orderId || "KSM-" + Math.floor(100000 + Math.random() * 900000),
        customerName: customerName || "Customer",
        phone: phone || "9840123456",
        itemsSummary: data.itemsSummary || "Selected Fresh Fish",
        cuttingOption: data.cuttingOption || "Custom Cut",
        isCut: data.isCut !== false,
        deliveryMode: data.deliveryMode || "porter",
        address: data.address?.address || "Address Provided",
        pincode: data.address?.pincode || "600040",
        grandTotal: data.grandTotal || 850,
      };

      // 1. WhatsApp to CUSTOMER
      const customerMsg =
        `🐟 *KASIMEDU DIRECT: Order Confirmed!*\n\n` +
        `Hello ${currentOrder.customerName}, your overnight order *#${currentOrder.id}* is confirmed.\n` +
        `📦 *Items:* ${currentOrder.itemsSummary}\n` +
        `🔪 *Prep:* ${currentOrder.isCut ? `Cleaned & Sliced (${currentOrder.cuttingOption})` : "Whole Uncut (முழு மீன்)"}\n` +
        `🛵 *Fulfillment:* ${currentOrder.deliveryMode === "porter" ? "Early Morning Porter Delivery" : "Harbor Hub Self-Pickup"}\n` +
        `💰 *Amount Paid:* ₹${currentOrder.grandTotal}\n\n` +
        `⚓ Our boat catch procurement starts at 4:00 AM. You will receive your live driver tracking link at 6:30 AM.`;

      // 2. WhatsApp to ADMIN / OWNER
      const ownerMsg =
        `🚨 *NEW OVERNIGHT FISH ORDER: #${currentOrder.id}*\n\n` +
        `👤 *Customer:* ${currentOrder.customerName} (${currentOrder.phone})\n` +
        `🐟 *Items:* ${currentOrder.itemsSummary}\n` +
        `🔪 *Cutting:* ${currentOrder.isCut ? `YES (${currentOrder.cuttingOption})` : "NO (Deliver Whole)"}\n` +
        `🚚 *Mode:* ${currentOrder.deliveryMode === "porter" ? `PORTER - ${currentOrder.address}, PIN: ${currentOrder.pincode}` : "DIRECT HUB PICKUP"}\n` +
        `💵 *Paid:* ₹${currentOrder.grandTotal}\n\n` +
        `👉 Harbor Cutter Sheet: http://localhost:3000/admin/cutter-sheet`;

      await sendWhatsAppMessage(currentOrder.phone, customerMsg);
      await sendWhatsAppMessage(OWNER_WHATSAPP_NUMBER, ownerMsg);

      return NextResponse.json({ success: true, customerNotified: true, ownerNotified: true });
    }

    if (event === "PORTER_DISPATCHED" || type === "PORTER_DISPATCHED") {
      const customerDispatchedMsg =
        `🛵 *Porter Out for Delivery! (Order #${orderId || order?.id})*\n\n` +
        `Hi ${customerName || order?.customerName || "Customer"}, your fresh catch is cleaned, ice-packed, and on the way!\n` +
        `👤 *Rider:* ${driverName || "Porter Rider"}\n` +
        `⏱️ *ETA:* ${eta || "7:30 AM"}\n\n` +
        `👉 *Track Live Doorstep Delivery:* ${trackingUrl || `http://localhost:3000/track/${orderId || order?.id}`}`;

      await sendWhatsAppMessage(phone || order?.phone, customerDispatchedMsg);
      return NextResponse.json({ success: true, customerNotified: true });
    }

    if (event === "ORDER_DELIVERED" || type === "ORDER_DELIVERED") {
      const currentOrder = order || {
        id: orderId || "KSM-1041",
        customerName: customerName || "Customer",
        phone: phone || "9840123456",
        deliveryMode: "porter",
        grandTotal: 965,
      };

      // 1. WhatsApp to CUSTOMER
      const customerDeliveredMsg =
        `✅ *Your Fresh Harbor Catch Has Been Delivered!*\n\n` +
        `Order *#${currentOrder.id}* was handed over fresh on ice.\n` +
        `Enjoy your fresh fish curry / fry!\n\n` +
        `Let us know how the catch was: http://localhost:3000/feedback/${currentOrder.id}`;

      // 2. WhatsApp to OWNER / MANAGER
      const ownerDeliveredMsg =
        `🎉 *ORDER DELIVERED COMPLETED: #${currentOrder.id}*\n\n` +
        `Customer: ${currentOrder.customerName} (${currentOrder.phone})\n` +
        `Delivered at: ${new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}\n` +
        `Delivery Mode: ${(currentOrder.deliveryMode || "porter").toUpperCase()}\n` +
        `Payment Status: Settled (₹${currentOrder.grandTotal})`;

      await sendWhatsAppMessage(currentOrder.phone, customerDeliveredMsg);
      await sendWhatsAppMessage(OWNER_WHATSAPP_NUMBER, ownerDeliveredMsg);

      return NextResponse.json({ success: true, customerNotified: true, ownerNotified: true });
    }

    return NextResponse.json({ success: true, message: "Unhandled event" });
  } catch (error) {
    console.error("WhatsApp dispatch error:", error);
    return NextResponse.json({ error: "Failed to dispatch WhatsApp alerts" }, { status: 500 });
  }
}
