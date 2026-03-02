import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Addition } from "../types/addition";
import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";

export function useAdditions(categoryName: string) {
    const [additions, setAdditions] = useState<Addition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try both 'additions' and 'adiciones' to see which one contains data
        const collectionsToTry = ["additions", "adiciones"];
        let unsubscribes: (() => void)[] = [];

        collectionsToTry.forEach(collName => {
            const q = query(collection(db, "restaurants", RestaurantId, collName));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                console.log(`Collection [${collName}] fetched size:`, snapshot.size);
                if (snapshot.size > 0) {
                    const docData = snapshot.docs[0].data();
                    console.log(`Doc keys in [${collName}]:`, Object.keys(docData));

                    const items: Addition[] = snapshot.docs.map((docSnap) => {
                        const data = docSnap.data();
                        // Try to find the category value in common fields if 'category' doesn't exist
                        const catValue = data.category || data.categoryName || data.cat || data.id_category;

                        return {
                            id: docSnap.id,
                            name: data.name || "",
                            price: data.price || 0,
                            category: String(catValue || ""),
                        } as Addition;
                    });

                    // Filter by category name (case-insensitive)
                    const filtered = items.filter(a =>
                        a.category?.toLowerCase() === categoryName?.toLowerCase()
                    );

                    console.log(`Filtered additions for [${categoryName}] in [${collName}]:`, filtered);

                    if (filtered.length > 0 || collName === "additions") {
                        setAdditions(filtered);
                        setLoading(false);
                    }
                } else if (collName === "additions") {
                    setLoading(false);
                }
            }, (error) => {
                console.error(`Error fetching [${collName}]:`, error);
                if (collName === "additions") setLoading(false);
            });
            unsubscribes.push(unsubscribe);
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, [categoryName]);

    return { additions, loading };
}
