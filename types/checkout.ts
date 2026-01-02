export interface CartItem {
  id: string | number;
  name: string;
  size: string;
  color: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  wilaya: string;
  city: string;
  address: string;
  shippingMethod: string;
  orderNotes: string;
}

export interface OrderData extends FormData {
  items: CartItem[];
  total: number;
}

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export const SHIPPING_COSTS = {
  domicile: 600,
  yalidine: 400,
  default: 0,
} as const;

export const QUANTITY_LIMITS = {
  min: 1,
  max: 10,
} as const;
