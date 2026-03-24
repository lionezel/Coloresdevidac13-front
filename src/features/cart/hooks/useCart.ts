import { auth, db } from "@/src/firebase/config";
import { RestaurantId } from "@/src/global/id";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CartItem } from "../types/cart";

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cartRef = collection(db, "restaurants", RestaurantId, "cart");
        const q = query(cartRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CartItem[];
            setCart(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addToCart = async (item: Omit<CartItem, "id" | "userId" | "quantity" | "addedAt">, quantity: number = 1) => {
        try {
            const cartRef = collection(db, "restaurants", RestaurantId, "cart");
            const q = query(
                cartRef,
                where("productId", "==", item.productId),
                where("variantKey", "==", item.variantKey),
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const cartItem = querySnapshot.docs[0];
                const currentQuantity = cartItem.data().quantity || 1;

                await updateDoc(
                    doc(db, "restaurants", RestaurantId, "cart", cartItem.id),
                    {
                        quantity: currentQuantity + quantity,
                    }
                );
            } else {
                await addDoc(cartRef, {
                    ...item,
                    quantity: quantity,
                    addedAt: new Date(),
                });
            }
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    };

    const increaseQuantity = async (itemId: string) => {
        try {
            const itemRef = doc(db, "restaurants", RestaurantId, "cart", itemId);
            const item = cart.find(i => i.id === itemId);
            if (item) {
                await updateDoc(itemRef, {
                    quantity: (item.quantity || 1) + 1
                });
            }
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const decreaseQuantity = async (itemId: string) => {
        try {
            const itemRef = doc(db, "restaurants", RestaurantId, "cart", itemId);
            const item = cart.find(i => i.id === itemId);
            if (item) {
                if (item.quantity > 1) {
                    await updateDoc(itemRef, {
                        quantity: item.quantity - 1
                    });
                } else {
                    await deleteDoc(itemRef);
                }
            }
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const clearCart = async () => {
        try {
            const cartRef = collection(db, "restaurants", RestaurantId, "cart");
            const snapshot = await getDocs(cartRef);
            
            if (snapshot.empty) return;

            const batch = writeBatch(db);
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    return { cart, loading, addToCart, increaseQuantity, decreaseQuantity, clearCart };
};
