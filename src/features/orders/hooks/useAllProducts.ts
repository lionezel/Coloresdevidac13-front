import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Product } from "../../category/types/products";

export function useAllProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "restaurants", RestaurantId, "products"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: Product[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[];

            setProducts(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { products, loading };
}
