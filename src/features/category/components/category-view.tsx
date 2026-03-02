"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProducts } from "../hooks/useProducts";
import { useAdditions } from "../hooks/useAdditions";
import { useLoading } from "../../home/hooks/useLoading";
import { useFormatPrice } from "../hooks/useFormatPrice";
import { useCart } from "../hooks/useCart";

import { CartIconWithBadge } from "../../home/components/CartIconWithBadge";
import { BackgroundColor, ColorGlobal } from "../../../global/colorGlobal";
import { CardBox } from "./card-box";

interface CategoryViewProps {
    slug: string;
}

export function CategoryView({ slug }: CategoryViewProps) {
    const { products, loading: productsLoading } = useProducts(slug);
    const { additions, loading: additionsLoading } = useAdditions(slug);
    const { formatPrice } = useFormatPrice();
    const { addToCart } = useCart();
    const { Loading } = useLoading();
    const router = useRouter();

    const loading = productsLoading || additionsLoading;

    if (loading) {
        return <Loading />;
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: BackgroundColor }}
        >
            {/* Header */}
            <header className="flex h-32 w-full items-center justify-between px-6 lg:px-12 bg-white/50 backdrop-blur-md sticky top-0 z-30">
                <button
                    onClick={() => router.back()}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 text-gray-600 transition-all hover:bg-gray-200 active:scale-95"
                    aria-label="Volver"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <h1
                    className="text-4xl font-black uppercase tracking-tight font-[Ubuntu] lg:text-5xl text-center flex-1"
                    style={{ color: "#4b2c20" }}
                >
                    {slug}
                </h1>

                <CartIconWithBadge onPress={() => router.push('/cart')} />
            </header>

            {/* Content with Entry Animation */}
            <motion.main
                className="flex-1 w-full max-w-7xl mx-auto py-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Suggestions / Additions Section */}
                {additions.length > 0 && (
                    <div className="mb-12 px-6">
                        <h2 className="text-2xl font-black font-[Ubuntu] text-gray-800 mb-6 px-2">
                            Sugerencias / Adiciones
                        </h2>
                        <div className="flex overflow-x-auto gap-5 pb-6 snap-x no-scrollbar">
                            {additions.map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-shrink-0 w-48 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all text-left snap-start group"
                                    onClick={() => addToCart({
                                        productId: item.id,
                                        productName: item.name,
                                        variantId: 'addition',
                                        variantKey: `addition_${item.id}`,
                                        variantLabel: 'Adición',
                                        image: '',
                                        price: item.price,
                                        additions: []
                                    })}
                                >
                                    <p className="font-bold text-gray-800 text-lg mb-1 group-hover:text-[#eb3d06] transition-colors">
                                        {item.name}
                                    </p>
                                    <p className={`text-xl font-black ${item.price < 0 ? 'text-red-500' : 'text-[#eb3d06]'}`}>
                                        {item.price < 0 ? '-' : '+'} ${formatPrice(Math.abs(item.price))}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="px-2">
                    <CardBox
                        products={products}
                        additions={additions}
                    />
                </div>
            </motion.main>

            {/* Custom scrollbar style */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
