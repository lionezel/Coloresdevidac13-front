"use client";

import { db } from "@/src/firebase/config";
import { BackgroundColor, ColorGlobal } from "@/src/global/colorGlobal";
import { RestaurantId } from "@/src/global/id";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useCreditCustomers } from "@/src/features/cart/hooks/useCreditCustomers";
import { useFormatPrice } from "@/src/features/category/hooks/useFormatPrice";
import { CreditCustomer } from "@/src/features/cart/types/customer";
import { useRouter } from "next/navigation";
import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import React, { useMemo, useState } from "react";

export default function CheckoutSummary() {
    const { cart, loading, clearCart } = useCart();
    const { customers, loading: loadingCustomers } = useCreditCustomers();
    const { formatPrice } = useFormatPrice();
    const router = useRouter();

    console.log("customers", customers);

    const [name, setName] = useState("");
    const [mesa, setMesa] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<
        "efectivo" | "tarjeta" | "transferencia" | ""
    >("");
    const [orderNotes, setOrderNotes] = useState("");

    // Credit customer selection states
    const [selectedCustomer, setSelectedCustomer] = useState<CreditCustomer | null>(null);
    const [showCustomerSelection, setShowCustomerSelection] = useState(false);

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

        if (name === "Crédito" && !selectedCustomer) {
            return alert("Por favor selecciona un cliente para el crédito.");
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

            const orderData = {
                name: selectedCustomer ? selectedCustomer.name : name,
                mesa,
                paymentMethod,
                notes: orderNotes,
                products: safeProducts,
                total,
                date: new Date().toISOString(),
                creditCustomerId: selectedCustomer?.id || null,
                creditCustomerName: selectedCustomer?.name || null,
            };

            console.log("ORDEN A GUARDAR:", orderData);

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
                                        setSelectedCustomer(null);
                                        setShowCustomerSelection(false);
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
                            setShowCustomerSelection(!showCustomerSelection);
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

                    {/* Customer Selection Modal/List */}
                    {showCustomerSelection && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-[15px] border border-black/5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Selecciona el cliente:</p>
                            {loadingCustomers ? (
                                <p className="text-sm text-gray-400">Cargando clientes...</p>
                            ) : customers.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                                    {customers.map((customer) => (
                                        <button
                                            key={customer.id}
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setShowCustomerSelection(false);
                                            }}
                                            className={`py-2 px-3 rounded-[10px] text-xs font-semibold border transition-all ${selectedCustomer?.id === customer.id
                                                ? "text-white"
                                                : "bg-white border-black/5 text-gray-600 hover:bg-white/80"
                                                }`}
                                            style={{
                                                backgroundColor: selectedCustomer?.id === customer.id ? ColorGlobal : undefined,
                                                borderColor: selectedCustomer?.id === customer.id ? ColorGlobal : undefined,
                                            }}
                                        >
                                            {customer.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-2">No hay clientes registrados.</p>
                            )}
                        </div>
                    )}

                    {name && (
                        <p className="mt-2 text-xs font-[Ubuntu]" style={{ color: ColorGlobal }}>
                            Seleccionado: <span className="font-bold">
                                {selectedCustomer ? selectedCustomer.name : name}
                            </span>
                        </p>
                    )}
                </div>

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
