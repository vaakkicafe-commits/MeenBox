import { FishItem, PrepOption } from "../data/fishCatalog";

export type FulfillmentType = "porter" | "pickup";
export type CustomerTier = "retail" | "b2b";

export interface DeliveryDetails {
  fulfillmentType: FulfillmentType;
  customerName: string;
  phone: string;
  address?: {
    street: string;
    landmark?: string;
    pincode: string;
    lat?: number;
    lng?: number;
  };
  pickupHubAddress?: string;
  porterFee: number;
}

export type OrderStatus =
  | "confirmed"          // Placed overnight (before 11 PM)
  | "procured"           // 4:00 AM Kasimedu harbor auction
  | "cleaned_packed"     // 5:15 AM cleaned, weighed, ice gel boxed
  | "porter_dispatched"  // 6:30 AM Porter driver picked up
  | "out_for_delivery"   // On the way to customer doorstep
  | "delivered"          // Completed
  | "ready_for_pickup";  // If self-pickup chosen

export interface CartItem {
  id: string;
  fish: FishItem;
  weight: string; // e.g. "500g", "1kg", "5kg", "10kg", "25kg"
  prep: PrepOption;
  isCut: boolean;
  basePrice: number;
  cleaningFee: number;
  unitPrice: number;
  quantity: number;
  isBulkCrate?: boolean;
  crateKg?: number;
}

export interface Order {
  id: string;
  tier: CustomerTier;
  customerName: string;
  restaurantName?: string;
  gstin?: string;
  phone: string;
  deliveryMode: FulfillmentType;
  address?: {
    address: string;
    pincode: string;
  };
  items: CartItem[];
  itemTotal: number;
  packagingCharge: number;
  porterDeliveryCharge: number;
  grandTotal: number;
  contingency: "substitute" | "refund";
  status: OrderStatus;
  createdAt: string;
  deliverySlot: string;
  vehicleAllocation?: "porter_bike" | "porter_3wheeler_tata_ace";
  porterTrackingUrl?: string;
}
