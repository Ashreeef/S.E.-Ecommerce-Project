export interface ProductFormData {
  name: string;
  description: string;
  modelDetails: string;
  status: 'Available' | 'Unavailable' | 'Draft';
  size: string;
  color: string;
  gender: 'MEN' | 'WOMEN' | 'UNISEX';
  category: string;
  fit: string;
  basePrice: number;
  stock: number;
  discount: number; // percentage
  discountType: string;
  images: File[];
  imageUrls: string[]; // URLs after upload
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string; // type Jeans, T-shirts, Jackets, Dresses, etc.
  size: string[]; // S, M, L, XL, XXL, etc.
  description: string;
  availability: boolean;
  rating: number;
  modelDetails?: string;
  status?: 'Available' | 'Out-of-stock';
  color?: string;
  colors?: string[]; // available colors
  gender?: 'MEN' | 'WOMEN' | 'UNISEX';
  stock?: number; // QTY
  discount?: number; // percentage
  discountType?: string;
  date?: string; // date of creation
  sales?: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Blue Denim Jeans",
    price: 4500,
    originalPrice: 6000,
    image: "/products/jeans1/main.jpg",
    images: [
      "/products/jeans1/1.jpg",
      "/products/jeans1/2.jpg",
      "/products/jeans1/3.jpg",
    ],
    category: "Jeans",
    size: ["S", "M", "L", "XL"],
    description: "Comfortable straight-fit denim jeans with a timeless design.",
    availability: true,
    rating: 4.5,
    modelDetails: "Model is 180 cm tall and wears size M.",
    status: "Available",
    color: "Blue",
    colors: ["Blue", "Dark Blue", "Black"],
    gender: "UNISEX",
    stock: 25,
    discount: 25,
    discountType: "percentage",
    date: "2025-01-15",
    sales: 120,
  },
  {
    id: "2",
    name: "Oversized Black T-Shirt",
    price: 2500,
    originalPrice: 3000,
    image: "/products/tshirt1/main.jpg",
    images: [
      "/products/tshirt1/1.jpg",
      "/products/tshirt1/2.jpg",
    ],
    category: "T-shirts",
    size: ["M", "L", "XL", "XXL"],
    description: "Soft cotton oversized T-shirt perfect for everyday wear.",
    availability: true,
    rating: 4.8,
    status: "Available",
    color: "Black",
    colors: ["Black", "White", "Grey"],
    gender: "MEN",
    stock: 40,
    discount: 15,
    discountType: "percentage",
    date: "2025-02-02",
    sales: 90,
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    price: 5200,
    originalPrice: 6500,
    image: "/products/dress1/main.jpg",
    images: ["/products/dress1/1.jpg", "/products/dress1/2.jpg"],
    category: "Dresses",
    size: ["S", "M", "L"],
    description: "Lightweight floral-print dress ideal for summer outings.",
    availability: true,
    rating: 4.7,
    gender: "WOMEN",
    colors: ["Pink", "Yellow"],
    color: "Pink",
    stock: 15,
    status: "Available",
    discount: 20,
    discountType: "percentage",
    date: "2025-01-25",
    sales: 50,
  },
  {
    id: "4",
    name: "White Sneakers",
    price: 7000,
    image: "/products/shoes1/main.jpg",
    images: ["/products/shoes1/1.jpg", "/products/shoes1/2.jpg"],
    category: "Shoes",
    size: ["40", "41", "42", "43", "44"],
    description: "Minimalist white sneakers suitable for all outfits.",
    availability: true,
    rating: 4.6,
    gender: "UNISEX",
    colors: ["White", "Black"],
    color: "White",
    stock: 18,
    date: "2025-01-10",
    sales: 110,
    status: "Out-of-stock",
  },
  {
    id: "5",
    name: "Brown Leather Jacket",
    price: 15000,
    originalPrice: 18000,
    image: "/products/jacket1/main.jpg",
    images: ["/products/jacket1/1.jpg", "/products/jacket1/2.jpg"],
    category: "Jackets",
    size: ["M", "L", "XL"],
    description: "Premium genuine leather jacket with modern fit.",
    availability: true,
    rating: 4.9,
    gender: "MEN",
    colors: ["Brown", "Black"],
    color: "Brown",
    stock: 8,
    discount: 17,
    discountType: "percentage",
    date: "2025-01-03",
    sales: 70,
    status: "Out-of-stock",
  },
  {
    id: "6",
    name: "Beige Cargo Pants",
    price: 4800,
    originalPrice: 5500,
    image: "/products/cargo1/main.jpg",
    images: ["/products/cargo1/1.jpg", "/products/cargo1/2.jpg"],
    category: "Pants",
    size: ["S", "M", "L", "XL"],
    description: "Comfort-fit cargo pants with multiple pockets.",
    availability: true,
    rating: 4.4,
    gender: "MEN",
    colors: ["Beige", "Black", "Green"],
    color: "Beige",
    stock: 20,
    discount: 12,
    discountType: "percentage",
    date: "2025-02-01",
    sales: 40,
    status: "Available",
  },
  {
    id: "7",
    name: "Pink Hoodie",
    price: 4300,
    originalPrice: 5000,
    image: "/products/hoodie1/main.jpg",
    images: ["/products/hoodie1/1.jpg", "/products/hoodie1/2.jpg"],
    category: "Hoodies",
    size: ["M", "L", "XL"],
    description: "Soft fleece hoodie with adjustable drawstrings.",
    availability: true,
    rating: 4.5,
    gender: "WOMEN",
    colors: ["Pink", "White"],
    color: "Pink",
    stock: 30,
    discount: 14,
    discountType: "percentage",
    date: "2025-02-05",
    sales: 65,
    status: "Out-of-stock",
  },
  {
    id: "8",
    name: "Blue Polo Shirt",
    price: 3100,
    image: "/products/polo1/main.jpg",
    images: ["/products/polo1/1.jpg"],
    category: "T-shirts",
    size: ["S", "M", "L", "XL"],
    description: "Classic blue polo shirt with breathable fabric.",
    availability: true,
    rating: 4.3,
    gender: "MEN",
    colors: ["Blue", "Navy", "White"],
    color: "Blue",
    stock: 35,
    date: "2025-01-20",
    sales: 55,
    status: "Available",
  },
  {
    id: "9",
    name: "Black Maxi Skirt",
    price: 3900,
    image: "/products/skirt1/main.jpg",
    images: ["/products/skirt1/1.jpg"],
    category: "Skirts",
    size: ["S", "M", "L"],
    description: "Elegant flowy black maxi skirt perfect for evening wear.",
    availability: true,
    rating: 4.6,
    gender: "WOMEN",
    colors: ["Black", "Grey"],
    color: "Black",
    stock: 22,
    date: "2025-02-08",
    sales: 48,
    status: "Available",
  },
  {
    id: "10",
    name: "Unisex Grey Sweatpants",
    price: 3500,
    image: "/products/sweatpants1/main.jpg",
    images: ["/products/sweatpants1/1.jpg", "/products/sweatpants1/2.jpg"],
    category: "Pants",
    size: ["S", "M", "L", "XL", "XXL"],
    description: "Comfortable unisex sweatpants for daily wear.",
    availability: true,
    rating: 4.4,
    gender: "UNISEX",
    colors: ["Grey", "Black", "Dark Grey"],
    color: "Grey",
    stock: 28,
    date: "2025-01-12",
    sales: 60,
    status: "Out-of-stock",
  },
  {
    id: "14",
    name: "Unisex Grey Sweatpants",
    price: 3500,
    image: "/products/sweatpants1/main.jpg",
    images: ["/products/sweatpants1/1.jpg", "/products/sweatpants1/2.jpg"],
    category: "Pants",
    size: ["S", "M", "L", "XL", "XXL"],
    description: "Comfortable unisex sweatpants for daily wear.",
    availability: true,
    rating: 4.4,
    gender: "UNISEX",
    colors: ["Grey", "Black", "Dark Grey"],
    color: "Grey",
    stock: 28,
    date: "2025-01-12",
    sales: 60,
    status: "Out-of-stock",
  },
  {
    id: "13",
    name: "Unisex Grey Sweatpants",
    price: 3500,
    image: "/products/sweatpants1/main.jpg",
    images: ["/products/sweatpants1/1.jpg", "/products/sweatpants1/2.jpg"],
    category: "Pants",
    size: ["S", "M", "L", "XL", "XXL"],
    description: "Comfortable unisex sweatpants for daily wear.",
    availability: true,
    rating: 4.4,
    gender: "UNISEX",
    colors: ["Grey", "Black", "Dark Grey"],
    color: "Grey",
    stock: 28,
    date: "2025-01-12",
    sales: 60,
    status: "Out-of-stock",
  }
];


