import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, limit, where } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";
import { Order } from "@/src/features/comanda/types/order.types";
import { useAuth } from "@/src/context/AuthContext";

export type OrderWithId = Order & { id: string };

export const useOrders = () => {
    const [orders, setOrders] = useState<OrderWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setOrders([]);
            setLoading(false);
            return;
        }

        // Filter orders by waitressId so each mesera only sees her own orders
        const q = query(
            collection(db, "restaurants", RestaurantId, "orders"),
            where("waitressId", "==", user.uid),
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
                setError(null);
            },
            (err) => {
                console.error("Error fetching orders:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    return { orders, loading, error };
};


