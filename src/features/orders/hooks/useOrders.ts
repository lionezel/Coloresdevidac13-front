import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";
import { Order } from "@/src/features/comanda/types/order.types";

export type OrderWithId = Order & { id: string };

export const useOrders = () => {
    const [orders, setOrders] = useState<OrderWithId[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query last 50 orders to avoid too much data, ordered by date desc
        const q = query(
            collection(db, "restaurants", RestaurantId, "orders"),
            orderBy("date", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetchedOrders: OrderWithId[] = snapshot.docs.map(doc => {
                    const data = doc.data() as Order;
                    return { ...data, id: doc.id };
                });
                setOrders(fetchedOrders);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { orders, loading };
};
