import { Product } from "./product";
import { products } from "./product"; 


export type OrderStatus =
  | "Delivered"
  | "Confirmed"
  | "Returned"
  | "Canceled"
  | "Pending"
  | "Sent";

export interface ShipmentTimelineEntry {
  title: string;        // e.g. "Order Placed"
  date: string;         // "12-07-2025 04:25 PM"
  location?: string;    // "Algiers, Algeria"
}

export interface Order {
  // Basic info
  id: string;                   // e.g. "#CRO00221"
  status: OrderStatus;          // Delivered, Pending, etc.
  datePurchased: string;        // "12-07-2025 4:25 PM"
  dateDelivered?: string;       // "15-07-2025 15:34 PM"
  estimatedDelivery?: string;   // "3 days"

  // Customer info
  customerName: string;         // "Flen fleni"
  customerPhone: string;        // "+213 543 321 453"
  customerEmail: string;        // "email@email.com"
  address: string;              // Full address

  // Payment
  totalAmount: number;          // price sum (before shipping/tax/discount)
  shippingFee: number;          // 500 DZD
  tax: number;                  // 0.00 DZD
  discount?: number;            // -1000 DZD
  grandTotal: number;           // final payable amount

  // Delivery
  deliveryCompany: string;      // e.g. "Yalidine"
  shippingStatus?: string;      // "Delivered" (text shown in UI)
  shipmentTimeline: ShipmentTimelineEntry[];

  // Items
  numberOfProducts: number;     // "10 items"
  products: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;

  // Optional extras
  paymentProofImage?: string;   // path or URL
}


export const orders: Order[] = [
  {
    id: "3344",
    status: "Delivered",
    datePurchased: "12-07-2025 4:25 PM",
    dateDelivered: "15-07-2025 3:34 PM",
    estimatedDelivery: "3 days",

    customerName: "Flen Fleni",
    customerPhone: "+213 543 321 453",
    customerEmail: "email@email.com",
    address: "Résidence Universitaire Mehalma 5, Sidi Abdellah, Algiers",

    totalAmount: 23500,
    shippingFee: 500,
    tax: 0,
    discount: -1000,
    grandTotal: 23000,

    deliveryCompany: "Yalidine",
    shippingStatus: "Delivered",
    paymentProofImage: "/images/payments/proof1.png",

    shipmentTimeline: [
      {
        title: "Delivered to recipient at Yalidine Algiers",
        date: "15-07-2025 15:34 PM",
        location: "Algiers, Algeria",
      },
      {
        title: "Shipment reached Yalidine Algiers",
        date: "15-07-2025 10:16 AM",
        location: "Algiers, Algeria",
      },
      {
        title: "Shipment sent to Yalidine",
        date: "13-07-2025 8:14 AM",
        location: "Annaba, Algeria",
      },
      {
        title: "Order Confirmed",
        date: "12-07-2025 6:45 PM",
      },
      {
        title: "Order Placed",
        date: "12-07-2025 4:25 PM",
      },
    ],

    numberOfProducts: 10,
    products: [
      {
        product: products[0],
        quantity: 2,
        price: 2000,
      },
      {
        product: products[1],
        quantity: 2,
        price: 2000,
      },
      {
        product: products[2],
        quantity: 2,
        price: 2000,
      },
    ],
  },

  // Order 2 — Pending
  {
    id: "#CRO00145",
    status: "Pending",
    datePurchased: "05-07-2025 11:12 AM",
    estimatedDelivery: "3–5 days",

    customerName: "Sara Benali",
    customerPhone: "+213 662 123 987",
    customerEmail: "sara.benali@gmail.com",
    address: "Dar El Beida, Algiers",

    totalAmount: 9800,
    shippingFee: 400,
    tax: 0,
    grandTotal: 10200,

    deliveryCompany: "Yalidine",
    shippingStatus: "Pending",

    shipmentTimeline: [
      { title: "Order Placed", date: "05-07-2025 11:12 AM" },
      { title: "Order Awaiting Confirmation", date: "05-07-2025 11:20 AM" },
    ],

    numberOfProducts: 3,
    products: [
      { product: products[0], quantity: 1, price: 4500 },
      { product: products[3], quantity: 1, price: 3000 },
      { product: products[2], quantity: 1, price: 2300 },
    ],
  },

  // Order 3 — Confirmed
  {
    id: "#CRO00089",
    status: "Confirmed",
    datePurchased: "02-07-2025 9:05 AM",
    estimatedDelivery: "2 days",

    customerName: "Mehdi Lakhdar",
    customerPhone: "+213 550 821 449",
    customerEmail: "mehdi.l@gmail.com",
    address: "Ain Naadja, Algiers",

    totalAmount: 15000,
    shippingFee: 600,
    tax: 0,
    grandTotal: 15600,

    deliveryCompany: "ZraraExpress",
    shippingStatus: "Ready to Ship",

    shipmentTimeline: [
      { title: "Order Placed", date: "02-07-2025 9:05 AM" },
      { title: "Order Confirmed", date: "02-07-2025 9:30 AM" },
    ],

    numberOfProducts: 5,
    products: [
      { product: products[1], quantity: 3, price: 3000 },
      { product: products[4], quantity: 2, price: 3000 },
    ],
  },

  // Order 4 — Returned
  {
    id: "#CRO00011",
    status: "Returned",
    datePurchased: "25-06-2025 3:16 PM",
    dateDelivered: "28-06-2025 12:50 PM",
    estimatedDelivery: "3 days",

    customerName: "Nour Khelifa",
    customerPhone: "+213 661 998 441",
    customerEmail: "nour.k@gmail.com",
    address: "Bab Ezzouar, Algiers",

    totalAmount: 7000,
    shippingFee: 400,
    tax: 0,
    grandTotal: 7400,

    deliveryCompany: "Yalidine",
    shippingStatus: "Returned to Sender",

    shipmentTimeline: [
      {
        title: "Returned to Sender – Customer not available",
        date: "28-06-2025 12:50 PM",
      },
      {
        title: "Shipment reached Yalidine",
        date: "28-06-2025 8:14 AM",
        location: "Algiers, Algeria",
      },
      {
        title: "Order Confirmed",
        date: "25-06-2025 4:03 PM",
      },
      {
        title: "Order Placed",
        date: "25-06-2025 3:16 PM",
      },
    ],

    numberOfProducts: 2,
    products: [
      { product: products[3], quantity: 1, price: 4000 },
      { product: products[0], quantity: 1, price: 3000 },
    ],
  },
];
