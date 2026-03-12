"use client";

import { db } from "@/src/firebase/config";
import { BackgroundColor, ColorGlobal } from "@/src/global/colorGlobal";
import { RestaurantId } from "@/src/global/id";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useFormatPrice } from "@/src/features/category/hooks/useFormatPrice";
import { useRouter } from "next/navigation";
import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import React, { useMemo, useState } from "react";

export default function CheckoutSummary() {
    const { cart, loading, clearCart } = useCart();
    const { formatPrice } = useFormatPrice();
    const router = useRouter();

    const [name, setName] = useState("");
    const [mesa, setMesa] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<
        "efectivo" | "tarjeta" | "transferencia" | ""
    >("");
    const [orderNotes, setOrderNotes] = useState("");

    /**
     * Totales
     */
    const { totalItems, total } = useMemo(() => {
        const totalItems = cart.reduce(
            (sum, item) => sum + (item.quantity ?? 1),
            0
        );

        const total = cart.reduce(
            (sum, item) =>
                sum + (item.price ?? 0) * (item.quantity ?? 1),
            0
        );

        return { totalItems, total };
    }, [cart]);

    /**
     * Checkout
     */
    const handleCheckout = async () => {
        if (!name.trim()) {
            return alert("Por favor ingresa tu nombre.");
        }

        // if (!paymentMethod) {
        //     return alert("Por favor selecciona un método de pago.");
        // }

        if (cart.length === 0) {
            return alert("El carrito está vacío.");
        }

        // Validar que no haya datos inválidos en el carrito
        const hasInvalidItem = cart.some(
            (item) =>
                !item.productId ||
                !item.variantId ||
                item.price === undefined
        );

        if (hasInvalidItem) {
            console.error("Carrito inválido:", cart);
            return alert(
                "Hay productos inválidos en el carrito. Vuelve a agregarlos."
            );
        }

        try {
            setSaving(true);

            const safeProducts = cart.map((item) => ({
                productId: item.productId ?? "",
                productName: item.productName ?? "",
                variantId: item.variantId ?? "",
                variantLabel: item.variantLabel ?? "",
                price: item.price ?? 0,
                image: item.image ?? "",
                quantity: item.quantity ?? 1,
                additions: item.additions ?? [],
            }));

            console.log("ORDEN A GUARDAR:", {
                name,
                paymentMethod,
                notes: orderNotes,
                products: safeProducts,
                total,
            });

            const orderData = {
                name,
                mesa,
                paymentMethod,
                notes: orderNotes,
                products: safeProducts,
                total,
                date: new Date().toISOString(), // Using ISO string for easier storage
            };

            await addDoc(
                collection(db, "restaurants", RestaurantId, "orders"),
                {
                    ...orderData,
                    date: serverTimestamp(),
                }
            );

            sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
            await clearCart();
            router.push("/ordersuccess");
        } catch (error) {
            console.error("Error creando orden:", error);
            alert("No se pudo crear la orden.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 justify-center items-center py-10">
                <p className="text-gray-500 font-medium">Cargando el carrito...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white lg:bg-transparent">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#333] font-[Ubuntu]">
                Resumen de compra
            </h2>

            <div className="flex-1 space-y-6">
                {/* Resumen Card */}
                <div className="bg-black/5 rounded-[20px] p-6 border border-black/10 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600 font-[Ubuntu]">Cantidad de productos:</span>
                        <span className="text-base font-semibold text-[#333] font-[Ubuntu]">{totalItems}</span>
                    </div>

                    <div className="mt-2 pt-4 border-t border-black/10 flex justify-between items-center">
                        <span className="text-lg font-bold" style={{ color: ColorGlobal }}>Total a pagar:</span>
                        <span className="text-3xl font-extrabold" style={{ color: ColorGlobal }}>
                            ${formatPrice(total)}
                        </span>
                    </div>
                </div>

                {/* Ubicación / Identificación */}
                <div>
                    <label className="block text-[15px] font-semibold text-[#333] mb-4 font-[Ubuntu] tracking-wide ml-1">
                        ¿Dónde estás? / Identificación:
                    </label>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                            const isActive = mesa === num;
                            return (
                                <button
                                    key={num}
                                    onClick={() => {
                                        setMesa(num);
                                        setName(`Mesa ${num}`);
                                    }}
                                    className={`py-3 rounded-[12px] text-sm font-bold border transition-all duration-300 ${isActive
                                        ? "text-white shadow-md scale-[1.05]"
                                        : "bg-white border-black/10 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    style={{
                                        backgroundColor: isActive ? ColorGlobal : undefined,
                                        borderColor: isActive ? ColorGlobal : undefined,
                                        boxShadow: isActive ? `0 4px 10px ${ColorGlobal}4D` : undefined
                                    }}
                                >
                                    {num}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => {
                            setMesa(null);
                            setName("Crédito");
                        }}
                        className={`w-full py-3 rounded-[12px] text-sm font-bold border transition-all duration-300 ${name === "Crédito"
                            ? "text-white shadow-md scale-[1.02]"
                            : "bg-white border-black/10 text-gray-500 hover:bg-gray-50"
                            }`}
                        style={{
                            backgroundColor: name === "Crédito" ? ColorGlobal : undefined,
                            borderColor: name === "Crédito" ? ColorGlobal : undefined,
                            boxShadow: name === "Crédito" ? `0 4px 10px ${ColorGlobal}4D` : undefined
                        }}
                    >
                        USUARIO CRÉDITO
                    </button>
                    {name && (
                        <p className="mt-2 text-xs font-[Ubuntu]" style={{ color: ColorGlobal }}>
                            Seleccionado: <span className="font-bold">{name}</span>
                        </p>
                    )}
                </div>

                {/* Métodos de pago */}
                {/* <div>
                    <p className="text-[15px] font-semibold text-[#333] mb-4 font-[Ubuntu] tracking-wide ml-1">
                        Método de pago:
                    </p>
                    <div className="flex gap-3">
                        {[
                            { id: "efectivo", label: "Efectivo", iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.57-.31-2.92-1.34-3.13-2.97h2.01c.21.73.91 1.29 1.95 1.29 1.14 0 2.05-.62 2.05-1.55 0-.85-.63-1.42-2.19-1.95-2-.69-3.53-1.5-3.53-3.08 0-1.4 1.1-2.45 2.67-2.77V5h2.82v1.9c1.39.29 2.5 1.29 2.73 2.69h-2c-.22-.68-.84-1.12-1.87-1.12-1.1 0-1.8.52-1.8 1.43 0 .82.72 1.34 2.27 1.93 2.11.81 3.47 1.69 3.47 3.2 0 1.52-1.15 2.65-2.8 2.94z" },
                            { id: "transferencia", label: "Transfér", iconPath: "M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" },
                            { id: "tarjeta", label: "Tarjeta", iconPath: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" }
                        ].map((method) => {
                            const isActive = paymentMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id as any)}
                                    className={`flex-1 py-4 px-2 border rounded-[15px] flex flex-col items-center justify-center gap-2 transition-all duration-300 ${isActive
                                        ? "text-white shadow-lg scale-[1.02]"
                                        : "bg-white border-black/10 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    style={{
                                        backgroundColor: isActive ? ColorGlobal : undefined,
                                        borderColor: isActive ? ColorGlobal : undefined,
                                        boxShadow: isActive ? `0 4px 10px ${ColorGlobal}4D` : undefined
                                    }}
                                >
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d={method.iconPath} />
                                    </svg>
                                    <span className={`text-[10px] font-bold uppercase ${isActive ? "text-white" : "text-gray-400"}`}>
                                        {method.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div> */}

                {/* Notas del pedido */}
                <div>
                    <label className="block text-[15px] font-semibold text-[#333] mb-3 font-[Ubuntu] tracking-wide ml-1">
                        Notas del pedido:
                    </label>
                    <textarea
                        className="w-full border border-black/10 rounded-[15px] p-4 text-[15px] text-[#333] bg-white font-[Ubuntu] shadow-sm focus:outline-none focus:ring-2 min-h-[120px] resize-none"
                        style={{ '--tw-ring-color': ColorGlobal } as any}
                        placeholder="Ej: Sin cebolla, recoger a las 8pm..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                    />
                </div>

                {/* Botón */}
                <button
                    onClick={handleCheckout}
                    disabled={saving}
                    className={`w-full py-5 rounded-[20px] text-white font-extrabold text-base tracking-[2px] uppercase shadow-lg transition-all duration-300 active:scale-95 ${saving ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"
                        }`}
                    style={{
                        backgroundColor: ColorGlobal,
                        boxShadow: `0 8px 15px ${ColorGlobal}66`
                    }}
                >
                    {saving ? "Procesando..." : "Checkout"}
                </button>
            </div>
        </div>
    );
}
