"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormatPrice } from "../hooks/useFormatPrice";
import { useCart } from "../../cart/hooks/useCart";
import { Product, Variant } from "../types/products";
import { Addition } from "../types/addition";
import { ColorGlobal } from "@/src/global/colorGlobal";

interface CardBoxProps {
    products: Product[];
    additions: Addition[];
}

export const CardBox: React.FC<CardBoxProps> = ({ products, additions }) => {
    const { formatPrice } = useFormatPrice();
    const { addToCart } = useCart();

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [selectedAdditions, setSelectedAdditions] = useState<Addition[]>([]);

    const openSelectionModal = (product: Product, variant: Variant) => {
        setSelectedProduct(product);
        setSelectedVariant(variant);
        setSelectedAdditions([]);
        setIsModalVisible(true);
    };

    const toggleAddition = (addition: Addition) => {
        setSelectedAdditions((prev) =>
            prev.find((a) => a.id === addition.id)
                ? prev.filter((a) => a.id !== addition.id)
                : [...prev, addition]
        );
    };

    const handleConfirmAddToCart = async () => {
        if (!selectedProduct || !selectedVariant) return;

        let finalName = selectedProduct.name;
        let finalPrice = selectedVariant.price;

        if (selectedAdditions.length > 0) {
            const additionsList = selectedAdditions.map((a) => a.name).join(", ");
            finalName = `${selectedProduct.name} (${additionsList})`;
            const additionsPrice = selectedAdditions.reduce((acc, curr) => acc + curr.price, 0);
            finalPrice += additionsPrice;
        }

        const additionIds = selectedAdditions.map((a) => a.id).sort().join("_");
        const variantKey = `${selectedVariant.id}_${additionIds}`;

        await addToCart({
            productId: selectedProduct.id,
            productName: finalName,
            variantId: selectedVariant.id,
            variantKey: variantKey,
            variantLabel: selectedVariant.label,
            price: finalPrice,
            image: selectedVariant.image,
            additions: selectedAdditions.map((a) => ({ id: a.id, name: a.name, price: a.price })),
        });

        setIsModalVisible(false);
    };

    const defaultVariant = (product: Product) => product.variants[0];

    return (
        <div className="w-full">
            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-6">
                {products.map((product) => {
                    const variant = defaultVariant(product);
                    if (!variant) return null;

                    return (
                        <motion.div
                            key={product.id}
                            className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.05),0_6px_6px_rgba(0,0,0,0.05)] border border-gray-100/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all cursor-pointer flex flex-col h-full"
                            whileHover={{ y: -8 }}
                            onClick={() => openSelectionModal(product, variant)}
                        >
                            <div className="w-full aspect-square bg-[#f9f9f9] overflow-hidden relative">
                                <img
                                    src={variant.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-7 flex flex-col flex-1">
                                <h3 className="text-xl font-bold font-[Ubuntu] text-[#1a1a1a] mb-2">
                                    {product.name}
                                </h3>
                                {product.description && (
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
                                        {product.description}
                                    </p>
                                )}
                                <div className="mt-auto flex items-center justify-between">
                                    <span
                                        className="text-2xl font-black"
                                        style={{ color: ColorGlobal }}
                                    >
                                        $ {formatPrice(variant.price)}
                                    </span>
                                    <button
                                        className="h-12 w-12 flex items-center justify-center rounded-[1.2rem] text-white shadow-lg active:scale-90 transition-all"
                                        style={{ backgroundColor: ColorGlobal, boxShadow: `0 8px 16px ${ColorGlobal}40` }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openSelectionModal(product, variant);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Selection Modal */}
            <AnimatePresence>
                {isModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setIsModalVisible(false)}
                        />
                        <motion.div
                            initial={{ y: "100%", opacity: 1 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 1 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-8 pb-4">
                                <h2 className="text-2xl font-black font-[Ubuntu] text-[#333]">
                                    {selectedProduct?.name}
                                </h2>
                                <button
                                    onClick={() => setIsModalVisible(false)}
                                    className="p-2 text-gray-400 hover:text-black transition-colors bg-gray-100 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 pt-0 overflow-y-auto custom-scrollbar">
                                <p className="text-gray-500 mb-8 leading-relaxed text-base">
                                    {selectedProduct?.description}
                                </p>

                                {additions.length > 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-[#333]">Personaliza tu pedido</h3>
                                        <div className="space-y-4">
                                            {additions.map((addition) => {
                                                const isSelected = selectedAdditions.some((a) => a.id === addition.id);
                                                return (
                                                    <button
                                                        key={addition.id}
                                                        onClick={() => toggleAddition(addition)}
                                                        className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${isSelected
                                                            ? "border-transparent text-white"
                                                            : "bg-[#f8f8f8] border-[#eee] text-[#333] hover:border-gray-300"
                                                            }`}
                                                        style={isSelected ? { backgroundColor: ColorGlobal } : {}}
                                                    >
                                                        <div className="text-left">
                                                            <p className="font-bold text-[1.05rem]">
                                                                {addition.name}
                                                            </p>
                                                            <p className={`text-sm mt-0.5 ${isSelected ? "text-white/90" : "text-gray-500"}`}>
                                                                {addition.price < 0 ? "-" : "+"} ${formatPrice(Math.abs(addition.price))}
                                                            </p>
                                                        </div>
                                                        <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${isSelected ? "bg-white" : "text-gray-300"
                                                            }`}>
                                                            {isSelected ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: ColorGlobal }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" style={{ color: ColorGlobal }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-gray-100 bg-[#f9f9f9]/50 flex items-center gap-6">
                                <div className="flex-1">
                                    <p className="text-[0.8rem] text-gray-400 font-bold uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-3xl font-black" style={{ color: ColorGlobal }}>
                                        $ {formatPrice(
                                            (selectedVariant?.price || 0) +
                                            selectedAdditions.reduce((acc, curr) => acc + curr.price, 0)
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={handleConfirmAddToCart}
                                    className="px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-95 transition-all text-center"
                                    style={{ backgroundColor: ColorGlobal, boxShadow: `0 12px 24px ${ColorGlobal}30` }}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
};
