import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Product } from "../types/products";

export function useProducts(categoryName: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryName) return;

        // Note: The React Native code filtering was done on the client, 
        // but it's better to filter in the query if possible.
        const q = query(
            collection(db, "restaurants", RestaurantId, "products"),
            where("category", "==", categoryName)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: Product[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[];

            setProducts(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [categoryName]);

    return { products, loading };
}
