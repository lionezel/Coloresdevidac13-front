"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { useFormatPrice } from "../../category/hooks/useFormatPrice";
import { ColorGlobal } from "@/src/global/colorGlobal";

export const CardCart: React.FC = () => {
    const { cart, increaseQuantity, decreaseQuantity } = useCart();
    const { formatPrice } = useFormatPrice();

    return (
        <div className="flex flex-col gap-3 w-full">
            <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -16 }}
                        className="flex items-center gap-3 sm:gap-4 bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 w-full"
                    >
                        {/* Image */}
                        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] truncate font-[Ubuntu] leading-tight">
                                {item.productName}
                            </h3>

                            {item.additions && item.additions.length > 0 && (
                                <div className="mt-0.5 flex flex-wrap gap-x-1">
                                    {item.additions.map((add, idx) => (
                                        <span key={idx} className="text-[0.65rem] text-gray-400 italic">
                                            • {add.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-1.5 text-base sm:text-lg font-black" style={{ color: ColorGlobal }}>
                                ${formatPrice(item.price * item.quantity)}
                            </div>

                            {item.quantity > 1 && (
                                <p className="text-[0.65rem] text-gray-400 mt-0.5">
                                    ${formatPrice(item.price)} × {item.quantity}
                                </p>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="shrink-0 flex flex-col items-center gap-1 bg-gray-50 rounded-xl border border-gray-100 p-1 sm:p-1.5">
                            <button
                                onClick={() => increaseQuantity(item.id)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white active:scale-90 transition-all shadow-sm"
                                style={{ color: ColorGlobal }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16M4 12h16" />
                                </svg>
                            </button>

                            <span className="font-bold text-sm text-[#1a1a1a] w-6 text-center tabular-nums">{item.quantity}</span>

                            <button
                                onClick={() => decreaseQuantity(item.id)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white active:scale-90 transition-all shadow-sm text-gray-400 hover:text-red-400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
