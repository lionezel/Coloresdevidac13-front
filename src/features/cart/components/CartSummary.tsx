"use client";

import React from "react";
import { useCart } from "../hooks/useCart";
import { useFormatPrice } from "../../category/hooks/useFormatPrice";
import { ColorGlobal } from "@/src/global/colorGlobal";

export const CartSummary: React.FC = () => {
    const { cart } = useCart();
    const { formatPrice } = useFormatPrice();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0; // Could be dynamic
    const total = subtotal + shipping;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#1a1a1a] font-[Ubuntu]">Resumen</h2>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1a1a1a]">${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                    <span>Envío</span>
                    <span className="font-bold text-green-500">Gratis</span>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#1a1a1a]">Total</span>
                        <div className="text-right">
                            <span className="text-3xl font-black block" style={{ color: ColorGlobal }}>
                                ${formatPrice(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="w-full py-5 rounded-[1.5rem] text-white font-bold text-xl shadow-xl active:scale-95 transition-all text-center mt-4"
                style={{ backgroundColor: ColorGlobal, boxShadow: `0 12px 24px ${ColorGlobal}30` }}
            >
                Confirmar Pedido
            </button>
        </div>
    );
};
