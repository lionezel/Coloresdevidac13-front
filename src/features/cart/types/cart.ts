export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    variantId: string;
    variantKey: string;
    variantLabel: string;
    price: number;
    image: string;
    quantity: number;
    userId: string;
    additions?: { id: string; name: string; price: number }[];
    addedAt: any;
}