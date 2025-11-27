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
  date: string;         
  location?: string;    
}

export interface Order {
  // Basic info
  id: string;                   
  status: OrderStatus;          
  datePurchased: string;        
  dateDelivered?: string;       
  estimatedDelivery?: string;   
  // Customer info
  customerId: string;
  customerName: string;         
  customerPhone: string;        
  customerEmail: string;        
  address: string;              
  // Payment
  totalAmount: number;          
  shippingFee: number;          
  tax: number;                  
  discount?: number;            
  grandTotal: number; 
  paymentMethod: string;
  // Delivery
  deliveryCompany: string;     
  shippingStatus?: string;      
  shipmentTimeline: ShipmentTimelineEntry[];
  // Items
  numberOfProducts: number;    
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
    id: "#CRO00221",
    status: "Delivered",
    datePurchased: "2025-11-15",
    dateDelivered: "2025-11-20",
    estimatedDelivery: "2025-11-20",
    customerId: "CUST-001",
    customerName: "Sarah Johnson",
    customerPhone: "+213-555-0123",
    customerEmail: "sarah.j@email.com",
    address: "123 Rue Didouche Mourad, Algiers 16000, Algeria",
    totalAmount: 12000,
    shippingFee: 500,
    tax: 1200,
    discount: 1000,
    grandTotal: 12700,
    paymentMethod: "Credit Card",
    deliveryCompany: "Yalidine Express",
    shippingStatus: "Completed",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-15" },
      { title: "Order Confirmed", date: "2025-11-15", location: "Algiers Warehouse" },
      { title: "Package Shipped", date: "2025-11-17", location: "Algiers Distribution Center" },
      { title: "Out for Delivery", date: "2025-11-20", location: "Algiers Central" },
      { title: "Delivered", date: "2025-11-20", location: "Customer Address" },
    ],
    numberOfProducts: 2,
    products: [
      { product: products[0], quantity: 1, price: 4500 },
      { product: products[1], quantity: 1, price: 2500 },
    ],
  },
  {
    id: "ORD-2025-002",
    status: "Confirmed",
    datePurchased: "2025-11-22",
    estimatedDelivery: "2025-11-28",
    customerId: "CUST-002",
    customerName: "Ahmed Benali",
    customerPhone: "+213-555-0456",
    customerEmail: "ahmed.b@email.com",
    address: "45 Avenue de l'Indépendance, Oran 31000, Algeria",
    totalAmount: 5200,
    shippingFee: 600,
    tax: 520,
    grandTotal: 6320,
    paymentMethod: "Cash on Delivery",
    deliveryCompany: "Ecourier",
    shippingStatus: "Processing",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-22" },
      { title: "Order Confirmed", date: "2025-11-22", location: "Oran Warehouse" },
    ],
    numberOfProducts: 1,
    products: [
      { product: products[2], quantity: 1, price: 5200 },
    ],
  },
  {
    id: "ORD-2025-003",
    status: "Sent",
    datePurchased: "2025-11-18",
    estimatedDelivery: "2025-11-25",
    customerId: "CUST-003",
    customerName: "Fatima Meziane",
    customerPhone: "+213-555-0789",
    customerEmail: "fatima.m@email.com",
    address: "78 Boulevard Mohamed V, Constantine 25000, Algeria",
    totalAmount: 9500,
    shippingFee: 700,
    tax: 950,
    discount: 500,
    grandTotal: 10650,
    paymentMethod: "Bank Transfer",
    deliveryCompany: "Yalidine Express",
    shippingStatus: "In Transit",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-18" },
      { title: "Order Confirmed", date: "2025-11-18", location: "Constantine Warehouse" },
      { title: "Package Shipped", date: "2025-11-20", location: "Constantine Distribution Center" },
      { title: "In Transit", date: "2025-11-23", location: "En route to Constantine" },
    ],
    numberOfProducts: 2,
    products: [
      { product: products[0], quantity: 1, price: 4500 },
      { product: products[2], quantity: 1, price: 5200 },
    ],
    paymentProofImage: "/payment-proofs/ORD-2025-003.jpg",
  },
  {
    id: "ORD-2025-004",
    status: "Pending",
    datePurchased: "2025-11-24",
    estimatedDelivery: "2025-11-30",
    customerId: "CUST-004",
    customerName: "Karim Hammadi",
    customerPhone: "+213-555-0321",
    customerEmail: "karim.h@email.com",
    address: "12 Rue des Frères Bouadou, Annaba 23000, Algeria",
    totalAmount: 7000,
    shippingFee: 650,
    tax: 700,
    grandTotal: 8350,
    paymentMethod: "Cash on Delivery",
    deliveryCompany: "Ecourier",
    shippingStatus: "Awaiting Payment Confirmation",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-24" },
    ],
    numberOfProducts: 1,
    products: [
      { product: products[3], quantity: 1, price: 7000 },
    ],
  },
  {
    id: "ORD-2025-005",
    status: "Canceled",
    datePurchased: "2025-11-10",
    customerId: "CUST-005",
    customerName: "Leila Mansouri",
    customerPhone: "+213-555-0654",
    customerEmail: "leila.m@email.com",
    address: "34 Rue Larbi Ben M'hidi, Blida 09000, Algeria",
    totalAmount: 2500,
    shippingFee: 400,
    tax: 250,
    grandTotal: 3150,
    paymentMethod: "Credit Card",
    deliveryCompany: "Yalidine Express",
    shippingStatus: "Canceled by Customer",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-10" },
      { title: "Order Canceled", date: "2025-11-11" },
    ],
    numberOfProducts: 1,
    products: [
      { product: products[1], quantity: 1, price: 2500 },
    ],
  },
  {
    id: "ORD-2025-006",
    status: "Returned",
    datePurchased: "2025-11-05",
    dateDelivered: "2025-11-10",
    customerId: "CUST-006",
    customerName: "Yasmine Cherif",
    customerPhone: "+213-555-0987",
    customerEmail: "yasmine.c@email.com",
    address: "56 Avenue Ben Badis, Sétif 19000, Algeria",
    totalAmount: 5200,
    shippingFee: 550,
    tax: 520,
    grandTotal: 6270,
    paymentMethod: "Cash on Delivery",
    deliveryCompany: "Ecourier",
    shippingStatus: "Returned to Sender",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-05" },
      { title: "Order Confirmed", date: "2025-11-05", location: "Sétif Warehouse" },
      { title: "Package Shipped", date: "2025-11-07", location: "Sétif Distribution Center" },
      { title: "Delivered", date: "2025-11-10", location: "Customer Address" },
      { title: "Return Requested", date: "2025-11-12" },
      { title: "Return Received", date: "2025-11-16", location: "Sétif Warehouse" },
    ],
    numberOfProducts: 1,
    products: [
      { product: products[2], quantity: 1, price: 5200 },
    ],
  },
  {
    id: "ORD-2025-007",
    status: "Delivered",
    datePurchased: "2025-11-08",
    dateDelivered: "2025-11-14",
    estimatedDelivery: "2025-11-14",
    customerId: "CUST-007",
    customerName: "Rachid Boudiaf",
    customerPhone: "+213-555-0246",
    customerEmail: "rachid.b@email.com",
    address: "89 Rue Emir Abdelkader, Tlemcen 13000, Algeria",
    totalAmount: 14000,
    shippingFee: 800,
    tax: 1400,
    discount: 1500,
    grandTotal: 14700,
    paymentMethod: "Credit Card",
    deliveryCompany: "Yalidine Express",
    shippingStatus: "Completed",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-08" },
      { title: "Order Confirmed", date: "2025-11-08", location: "Tlemcen Warehouse" },
      { title: "Package Shipped", date: "2025-11-10", location: "Tlemcen Distribution Center" },
      { title: "Out for Delivery", date: "2025-11-14", location: "Tlemcen City" },
      { title: "Delivered", date: "2025-11-14", location: "Customer Address" },
    ],
    numberOfProducts: 3,
    products: [
      { product: products[0], quantity: 1, price: 4500 },
      { product: products[1], quantity: 2, price: 2500 },
      { product: products[2], quantity: 1, price: 5200 },
    ],
    paymentProofImage: "/payment-proofs/ORD-2025-007.jpg",
  },
  {
    id: "ORD-2025-008",
    status: "Sent",
    datePurchased: "2025-11-21",
    estimatedDelivery: "2025-11-27",
    customerId: "CUST-008",
    customerName: "Samira Kaddour",
    customerPhone: "+213-555-0135",
    customerEmail: "samira.k@email.com",
    address: "23 Boulevard de la Liberté, Béjaïa 06000, Algeria",
    totalAmount: 9700,
    shippingFee: 650,
    tax: 970,
    grandTotal: 11320,
    paymentMethod: "Bank Transfer",
    deliveryCompany: "Ecourier",
    shippingStatus: "In Transit",
    shipmentTimeline: [
      { title: "Order Placed", date: "2025-11-21" },
      { title: "Order Confirmed", date: "2025-11-21", location: "Béjaïa Warehouse" },
      { title: "Package Shipped", date: "2025-11-23", location: "Béjaïa Distribution Center" },
    ],
    numberOfProducts: 2,
    products: [
      { product: products[1], quantity: 1, price: 2500 },
      { product: products[3], quantity: 1, price: 7000 },
    ],
    paymentProofImage: "/payment-proofs/ORD-2025-008.jpg",
  },
];

