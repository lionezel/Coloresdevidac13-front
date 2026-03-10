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
        <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        className="relative flex items-center bg-white rounded-[2rem] p-4 pl-24 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all group"
                    >
                        {/* Image Wrapper (Absolute like in RN snippet) */}
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 border-2 border-white">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-lg font-bold text-[#1a1a1a] truncate font-[Ubuntu]">
                                {item.productName}
                            </h3>

                            {/* Additions */}
                            {item.additions && item.additions.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {item.additions.map((add, idx) => (
                                        <span key={idx} className="text-[0.75rem] text-gray-400 italic">
                                            • {add.name}{idx < item.additions!.length - 1 ? "" : ""}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-2 text-xl font-black" style={{ color: ColorGlobal }}>
                                ${formatPrice(item.price * item.quantity)}
                            </div>
                        </div>

                        {/* Quantity Controls (Pill like in RN snippet) */}
                        <div className="flex flex-col items-center justify-center -mr-8">
                            <div className="flex flex-col items-center bg-white rounded-full border border-gray-100 shadow-sm overflow-hidden p-1">
                                <button
                                    onClick={() => increaseQuantity(item.id)}
                                    className="p-2 hover:bg-gray-50 active:scale-90 transition-all rounded-full"
                                    style={{ color: ColorGlobal }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 12h8" />
                                    </svg>
                                </button>

                                <span className="font-bold text-sm py-1">{item.quantity}</span>

                                <button
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="p-2 hover:bg-gray-50 active:scale-90 transition-all rounded-full text-gray-400 hover:text-red-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
