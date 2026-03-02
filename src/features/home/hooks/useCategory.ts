import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { category } from "../types/category";

export function useCategory() {
    const [category, setCategory] = useState<category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "restaurants", RestaurantId, "category"), orderBy("name", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: category[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as category[];

            setCategory(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { category, loading };
}
