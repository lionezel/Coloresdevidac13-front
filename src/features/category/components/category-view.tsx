"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProducts } from "../hooks/useProducts";
import { useAdditions } from "../hooks/useAdditions";
import { useLoading } from "../../home/hooks/useLoading";
import { useFormatPrice } from "../hooks/useFormatPrice";
import { useCart } from "../../cart/hooks/useCart";

import { CartIconWithBadge } from "../../home/components/CartIconWithBadge";
import { BackgroundColor, ColorGlobal, ColorCoffee } from "../../../global/colorGlobal";
import { CardBox } from "./card-box";
import { useCategory } from "../../home/hooks/useCategory";

interface CategoryViewProps {
    slug: string;
}

export function CategoryView({ slug }: CategoryViewProps) {
    const { category, loading: categoryLoading } = useCategory();

    const exactCategoryName = useMemo(() => {
        if (!category || category.length === 0) return "";
        const found = category.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === slug);
        return found ? found.name : slug.replace(/-/g, ' ');
    }, [category, slug]);

    const { products, loading: productsLoading } = useProducts(exactCategoryName);
    const { additions, loading: additionsLoading } = useAdditions(exactCategoryName);
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
            className="min-h-screen flex flex-col font-sans"
            style={{ backgroundColor: BackgroundColor }}
        >
            {/* Header */}
            <header className="flex h-24 sm:h-32 w-full items-center justify-between px-4 sm:px-6 lg:px-12 bg-white/70 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all">
                <button
                    onClick={() => router.back()}
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:bg-gray-200 hover:scale-105 active:scale-95 shadow-sm"
                    aria-label="Volver"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-[Ubuntu] text-center flex-1 mx-4 truncate"
                    style={{ color: ColorCoffee }}
                >
                    {slug}
                </h1>

                <CartIconWithBadge onPress={() => router.push('/cart')} />
            </header>

            {/* Content with Entry Animation */}
            <motion.main
                className="flex-1 w-full max-w-screen-2xl mx-auto py-8 sm:py-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Suggestions / Additions Section */}
                {additions.length > 0 && (
                    <div className="mb-8 sm:mb-12 px-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-black font-[Ubuntu] text-gray-800 mb-4 sm:mb-6 tracking-tight">
                            Sugerencias / Adiciones
                        </h2>
                        <div className="flex overflow-x-auto gap-4 sm:gap-5 pb-6 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                            {additions.map((item) => (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="flex-shrink-0 w-40 sm:w-48 bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgb(0,0,0,0.06)] transition-all text-left snap-start group outline-none"
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
                                    <p
                                        className="font-bold text-gray-800 text-base sm:text-lg mb-1 leading-tight transition-colors duration-300"
                                        style={{ color: 'inherit' }} // Fallback
                                        onMouseEnter={(e) => (e.currentTarget.style.color = ColorGlobal)}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                                    >
                                        {item.name}
                                    </p>
                                    <p className={`text-lg sm:text-xl font-black ${item.price < 0 ? 'text-red-500' : ''}`} style={{ color: item.price < 0 ? undefined : ColorGlobal }}>
                                        {item.price < 0 ? '-' : '+'} ${formatPrice(Math.abs(item.price))}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="px-0 sm:px-2 w-full">
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
