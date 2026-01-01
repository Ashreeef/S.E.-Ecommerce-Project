export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    size: string[];
    colors?: string[];
    description: string;
    availability: boolean;
    rating: number;
}