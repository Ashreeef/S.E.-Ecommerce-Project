import { Order } from "./types/orders";

export const mockOrders: Order[] = [
    {
        id: "ord_1",
        order_number: "ORD-20260102-001",
        customer_first_name: "Sarah",
        customer_last_name: "Johnson",
        customer_phone: "05550123456",
        customer_email: "sarah@example.com",
        address: "123 Rue Didouche Mourad",
        wilaya: "Alger",
        city: "Alger Centre",
        shipping_method: "home",
        order_notes: "Please call before delivery",
        items: [
            {
                name: "Classic Blue Denim Jeans",
                size: "M",
                color: "Blue",
                image: "/products/jeans1/main.jpg",
                price: 4500,
                quantity: 1,
                productId: "1"
            }
        ],
        subtotal: 4500,
        shipping_fee: 600,
        total: 5100,
        status: "Pending",
        created_at: "2026-01-02T10:00:00Z"
    }
];
