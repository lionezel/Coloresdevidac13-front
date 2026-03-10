export type OrderProduct = {
    productId: string;
    productName: string;
    variantId: string;
    variantLabel: string;
    price: number;
    image: string;
    quantity: number;
    additions: any[];
}

export type Order = {
    date: any;
    name: string;
    notes: string;
    paymentMethod: string;
    products: OrderProduct[];
    total: number;
    mesa?: number;
    mesera?: string;
}