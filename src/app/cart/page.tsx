"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CardCart } from "@/src/features/category/components/CardCart";
import { CartSummary } from "@/src/features/category/components/CartSummary";
import { useCart } from "@/src/features/category/hooks/useCart";
import { ColorGlobal } from "@/src/global/colorGlobal";

export default function CartPage() {
    const router = useRouter();
    const { cart, loading } = useCart();

    return (
        <div className="min-h-screen bg-[#f8f8f8] relative overflow-hidden">
            {/* Header / Appbar Background */}
            <div
                className="absolute top-0 left-0 right-0 h-[40vh] transition-all duration-700"
                style={{ backgroundColor: ColorGlobal }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-3 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-black text-white font-[Ubuntu]">Carrito</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cart List Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] min-h-[60vh] flex flex-col"
                    >
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-xl font-bold text-gray-400 animate-pulse">Cargando...</p>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="text-8xl">🛒</div>
                                <p className="text-2xl font-bold text-gray-400">Tu carrito está vacío</p>
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Ir a comprar
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                                <CardCart />
                            </div>
                        )}
                    </motion.div>

                    {/* Summary Container */}
                    {cart.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sticky top-8"
                        >
                            <CartSummary />
                        </motion.div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
            `}</style>
        </div>
    );
}
