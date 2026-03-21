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
        <div className="space-y-6 sm:space-y-8 bg-white/40 p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-black text-[#1a1a1a] font-[Ubuntu] tracking-tight">Resumen</h2>

            <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-gray-500 text-sm sm:text-base">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold text-gray-800">${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-sm sm:text-base">
                    <span className="font-medium">Envío</span>
                    <span className="font-bold text-green-500 px-3 py-1 bg-green-50 rounded-full text-xs sm:text-sm">Gratis</span>
                </div>

                <div className="pt-5 mt-2 border-t border-dashed border-gray-200/80">
                    <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-bold text-gray-800 tracking-wide uppercase">Total</span>
                        <div className="text-right flex items-baseline gap-1">
                            <span className="text-3xl sm:text-4xl font-black tabular-nums transition-colors" style={{ color: ColorGlobal }}>
                                ${formatPrice(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="w-full py-4 sm:py-5 rounded-[1.2rem] text-white font-bold text-lg sm:text-xl shadow-xl active:scale-95 hover:scale-[1.02] transition-all duration-300 tracking-wide mt-2"
                style={{ backgroundColor: ColorGlobal, boxShadow: `0 8px 25px ${ColorGlobal}40` }}
            >
                Confirmar Pedido
            </button>
        </div>
    );
};
