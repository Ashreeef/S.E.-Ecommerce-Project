import { Product } from './product';

export interface OrderItem {
  name: string;
  size: string;
  color: string;
  image: string;
  price: number;
  quantity: number;
  productId: string;
}

export interface OrderItemWithProduct extends OrderItem {
  productDetails?: Product;
}

export type OrderStatus =
  | "Delivered"
  | "Confirmed"
  | "Returned"
  | "Canceled"
  | "Pending"
  | "Sent";

export interface Order {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  wilaya: string;
  city: string;
  shipping_method: string;
  bureau?: string;
  order_notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
}
