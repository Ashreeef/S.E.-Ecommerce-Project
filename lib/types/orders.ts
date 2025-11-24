export type OrderStatus =
  | "Delivered"
  | "Confirmed"
  | "Returned"
  | "Canceled"
  | "Pending"
  | "Sent";

export interface Order {
  id: string;              // #CRO000123
  userName: string;        // Example: "Flen fleni"
  date: string;            // ISO or dd-mm-yyyy
  total: number;           // Total in DZD
  status: OrderStatus;
  address: string;         // Wilaya or full address
  items: number;           // Number of items in order
  phone?: string;          // Optional
  note?: string;           // Admin note
}


export const orders: Order[] = [
  {
    id: "#CRO000123",
    userName: "Flen fleni",
    date: "15-08-2025",
    total: 4500,
    status: "Sent",
    address: "Algiers",
    items: 3,
  },
  {
    id: "#CRO000124",
    userName: "Flen fleni",
    date: "15-08-2025",
    total: 4600,
    status: "Canceled",
    address: "Tizi-Ouzou",
    items: 2,
  },
  {
    id: "#CRO000125",
    userName: "Flen fleni",
    date: "15-08-2025",
    total: 5000,
    status: "Pending",
    address: "Blida",
    items: 4,
  },
  {
    id: "#CRO000126",
    userName: "Flen fleni",
    date: "15-08-2025",
    total: 6200,
    status: "Confirmed",
    address: "Oran",
    items: 1,
  },
  {
    id: "#CRO000127",
    userName: "Flen fleni",
    date: "16-08-2025",
    total: 3200,
    status: "Returned",
    address: "Constantine",
    items: 2,
  },
  {
    id: "#CRO000128",
    userName: "Flen fleni",
    date: "16-08-2025",
    total: 8400,
    status: "Delivered",
    address: "Setif",
    items: 5,
  },
  {
    id: "#CRO000129",
    userName: "Flen fleni",
    date: "17-08-2025",
    total: 2700,
    status: "Pending",
    address: "Annaba",
    items: 1,
  },
  {
    id: "#CRO000130",
    userName: "Flen fleni",
    date: "17-08-2025",
    total: 9800,
    status: "Confirmed",
    address: "Batna",
    items: 6,
  },
  {
    id: "#CRO000131",
    userName: "Flen fleni",
    date: "18-08-2025",
    total: 5100,
    status: "Delivered",
    address: "Bejaia",
    items: 3,
  },
  {
    id: "#CRO000132",
    userName: "Flen fleni",
    date: "18-08-2025",
    total: 4300,
    status: "Canceled",
    address: "Boumerdes",
    items: 2,
  },
];

