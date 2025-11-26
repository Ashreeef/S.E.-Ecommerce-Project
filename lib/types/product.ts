export interface ProductFormData {
  //name: string;
  //description: string; 
  //modelDetails: string;
  //status: 'Available' | 'Unavailable' | 'Draft';
  //size: string;
  //color: string;
  //gender: 'MEN' | 'WOMEN' | 'UNISEX';
  //category: string;
  //fit: string;
  basePrice: number;
  //stock: number;
  //discount: number; // percentage
  //discountType: string;
  images: File[];
  imageUrls: string[]; // URLs after upload
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: Array<{ id: string; url: string; alt: string }>;
  category: string; // type Jeans, T-shirts, Jackets, Dresses, etc.
  availableSizes: string[]; // S, M, L, XL, XXL, etc.
  description: string;
  isAvailable: boolean;
  rating: number;
  modelDetails?: string;
  status: 'Available' | 'Out-of-stock';
  color?: string;
  availableColors: Array<{ name: string; hex: string }>; // available colors
  gender: 'MEN' | 'WOMEN' | 'UNISEX';
  stock: number; // QTY
  discount?: number; // percentage
  discountType?: string;
  date: string; // date of creation
  sales: number;
  fit?: string; // type of fit like slim, regular, etc.
  reviewCount?: number; 
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Blue Denim Jeans",
    price: 4500,
    originalPrice: 6000,
    status: 'Available',
    image: "/products/jeans1/main.jpg",
    images: [
      { id: "1-1", url: "/products/jeans1/1.jpg", alt: "Front view" },
      { id: "1-2", url: "/products/jeans1/2.jpg", alt: "Side view" },
      { id: "1-3", url: "/products/jeans1/3.jpg", alt: "Back view" },
    ],
    category: "Jeans",
    availableSizes: ["S", "M", "L", "XL"],
    description: "Comfortable straight-fit denim jeans with a timeless design.",
    isAvailable: false,
    rating: 4.5,
    modelDetails: "Model is 180 cm and wears size M.",
    color: "Blue",
    availableColors: [
      { name: "Blue", hex: "#1D4E89" },
      { name: "Dark Blue", hex: "#0A1F44" },
      { name: "Black", hex: "#000000" },
    ],
    gender: "UNISEX",
    stock: 25,
    discount: 25,
    discountType: "percentage",
    date: "2025-01-15",
    sales: 120,
    fit: "Regular",
    reviewCount: 42,
  },
  {
    id: "2",
    name: "Oversized Black T-Shirt",
    price: 2500,
    originalPrice: 3000,
    status: 'Available',
    image: "/products/tshirt1/main.jpg",
    images: [
      { id: "2-1", url: "/products/tshirt1/1.jpg", alt: "Front view" },
      { id: "2-2", url: "/products/tshirt1/2.jpg", alt: "Close-up" },
    ],
    category: "T-shirts",
    availableSizes: ["M", "L", "XL", "XXL"],
    description: "Soft cotton oversized T-shirt perfect for everyday wear.",
    isAvailable: true,
    rating: 4.8,
    color: "Black",
    availableColors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Grey", hex: "#8E8E8E" },
    ],
    gender: "MEN",
    stock: 40,
    discount: 15,
    discountType: "percentage",
    date: "2025-02-02",
    sales: 90,
    fit: "Oversized",
    reviewCount: 63,
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    price: 5200,
    originalPrice: 6500,
    status: 'Available',
    image: "/products/dress1/main.jpg",
    images: [
      { id: "3-1", url: "/products/dress1/1.jpg", alt: "Front" },
      { id: "3-2", url: "/products/dress1/2.jpg", alt: "Detail" },
    ],
    category: "Dresses",
    availableSizes: ["S", "M", "L"],
    description: "Lightweight floral-print dress ideal for summer outings.",
    isAvailable: true,
    rating: 4.7,
    gender: "WOMEN",
    color: "Pink",
    availableColors: [
      { name: "Pink", hex: "#F9A8D4" },
      { name: "Yellow", hex: "#FDE047" },
    ],
    stock: 15,
    discount: 20,
    discountType: "percentage",
    date: "2025-01-25",
    sales: 50,
    fit: "Regular",
    reviewCount: 30,
  },
  {
    id: "4",
    name: "White Sneakers",
    price: 7000,
    status: 'Out-of-stock',
    image: "/products/shoes1/main.jpg",
    images: [
      { id: "4-1", url: "/products/shoes1/1.jpg", alt: "Side profile" },
      { id: "4-2", url: "/products/shoes1/2.jpg", alt: "Top view" },
    ],
    category: "Shoes",
    availableSizes: ["40", "41", "42", "43", "44"],
    description: "Minimalist white sneakers suitable for all outfits.",
    isAvailable: false,
    rating: 4.6,
    gender: "UNISEX",
    color: "White",
    availableColors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 0,
    date: "2025-01-10",
    sales: 110,
    reviewCount: 55,
  },
  {
    id: "38",
    name: "Floral Summer Dress",
    price: 5200,
    originalPrice: 6500,
    status: 'Available',
    image: "/products/dress1/main.jpg",
    images: [
      { id: "3-1", url: "/products/dress1/1.jpg", alt: "Front" },
      { id: "3-2", url: "/products/dress1/2.jpg", alt: "Detail" },
    ],
    category: "Dresses",
    availableSizes: ["S", "M", "L"],
    description: "Lightweight floral-print dress ideal for summer outings.",
    isAvailable: true,
    rating: 4.7,
    gender: "WOMEN",
    color: "Pink",
    availableColors: [
      { name: "Pink", hex: "#F9A8D4" },
      { name: "Yellow", hex: "#FDE047" },
    ],
    stock: 15,
    discount: 20,
    discountType: "percentage",
    date: "2025-01-25",
    sales: 50,
    fit: "Regular",
    reviewCount: 30,
  },
  {
    id: "47",
    name: "White Sneakers",
    price: 7000,
    status: 'Out-of-stock',
    image: "/products/shoes1/main.jpg",
    images: [
      { id: "4-1", url: "/products/shoes1/1.jpg", alt: "Side profile" },
      { id: "4-2", url: "/products/shoes1/2.jpg", alt: "Top view" },
    ],
    category: "Shoes",
    availableSizes: ["40", "41", "42", "43", "44"],
    description: "Minimalist white sneakers suitable for all outfits.",
    isAvailable: false,
    rating: 4.6,
    gender: "UNISEX",
    color: "White",
    availableColors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 0,
    date: "2025-01-10",
    sales: 110,
    reviewCount: 55,
  },
  {
    id: "16",
    name: "Floral Summer Dress",
    price: 5200,
    originalPrice: 6500,
    status: 'Available',
    image: "/products/dress1/main.jpg",
    images: [
      { id: "3-1", url: "/products/dress1/1.jpg", alt: "Front" },
      { id: "3-2", url: "/products/dress1/2.jpg", alt: "Detail" },
    ],
    category: "Dresses",
    availableSizes: ["S", "M", "L"],
    description: "Lightweight floral-print dress ideal for summer outings.",
    isAvailable: true,
    rating: 4.7,
    gender: "WOMEN",
    color: "Pink",
    availableColors: [
      { name: "Pink", hex: "#F9A8D4" },
      { name: "Yellow", hex: "#FDE047" },
    ],
    stock: 15,
    discount: 20,
    discountType: "percentage",
    date: "2025-01-25",
    sales: 50,
    fit: "Regular",
    reviewCount: 30,
  },
  {
    id: "444",
    name: "White Sneakers",
    price: 7000,
    status: 'Out-of-stock',
    image: "/products/shoes1/main.jpg",
    images: [
      { id: "4-1", url: "/products/shoes1/1.jpg", alt: "Side profile" },
      { id: "4-2", url: "/products/shoes1/2.jpg", alt: "Top view" },
    ],
    category: "Shoes",
    availableSizes: ["40", "41", "42", "43", "44"],
    description: "Minimalist white sneakers suitable for all outfits.",
    isAvailable: false,
    rating: 4.6,
    gender: "UNISEX",
    color: "White",
    availableColors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 0,
    date: "2025-01-10",
    sales: 110,
    reviewCount: 55,
  },
  {
    id: "301",
    name: "Floral Summer Dress",
    price: 5200,
    originalPrice: 6500,
    status: 'Available',
    image: "/products/dress1/main.jpg",
    images: [
      { id: "3-1", url: "/products/dress1/1.jpg", alt: "Front" },
      { id: "3-2", url: "/products/dress1/2.jpg", alt: "Detail" },
    ],
    category: "Dresses",
    availableSizes: ["S", "M", "L"],
    description: "Lightweight floral-print dress ideal for summer outings.",
    isAvailable: true,
    rating: 4.7,
    gender: "WOMEN",
    color: "Pink",
    availableColors: [
      { name: "Pink", hex: "#F9A8D4" },
      { name: "Yellow", hex: "#FDE047" },
    ],
    stock: 15,
    discount: 20,
    discountType: "percentage",
    date: "2025-01-25",
    sales: 50,
    fit: "Regular",
    reviewCount: 30,
  },
  {
    id: "490",
    name: "White Sneakers",
    price: 7000,
    status: 'Out-of-stock',
    image: "/products/shoes1/main.jpg",
    images: [
      { id: "4-1", url: "/products/shoes1/1.jpg", alt: "Side profile" },
      { id: "4-2", url: "/products/shoes1/2.jpg", alt: "Top view" },
    ],
    category: "Shoes",
    availableSizes: ["40", "41", "42", "43", "44"],
    description: "Minimalist white sneakers suitable for all outfits.",
    isAvailable: false,
    rating: 4.6,
    gender: "UNISEX",
    color: "White",
    availableColors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 0,
    date: "2025-01-10",
    sales: 110,
    reviewCount: 55,
  },
];
