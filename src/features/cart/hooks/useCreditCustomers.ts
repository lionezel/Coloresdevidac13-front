import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CreditCustomer } from "../types/customer";

export const useCreditCustomers = () => {
    const [customers, setCustomers] = useState<CreditCustomer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const customersRef = collection(db, "restaurants", RestaurantId, "credit_customers");
        const q = query(customersRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CreditCustomer[];
            setCustomers(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { customers, loading };
};
