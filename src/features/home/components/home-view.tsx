"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCategory } from "../hooks/useCategory";
import { useLoading } from "../hooks/useLoading";
import { CategoryCard } from "./CardCategory";
import { CartIconWithBadge } from "./CartIconWithBadge";
import { BackgroundColor, ColorGlobal, ColorCoffee } from "../../../global/colorGlobal";

export default function HomeView() {
    const { category, loading } = useCategory();
    const router = useRouter();
    const { Loading } = useLoading();

    if (loading) {
        return <Loading />;
    }

    return (
        <div
            className="flex min-h-screen flex-col font-sans"
            style={{ backgroundColor: BackgroundColor }}
        >
            {/* Header */}
            <header className="flex h-24 sm:h-32 w-full items-center justify-between px-6 lg:px-12 sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-sm transition-all">
                <button
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-gray-600 transition-all hover:bg-gray-100"
                    aria-label="Volver"
                >
                </button>

                <h1
                    className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-[Ubuntu] lg:text-6xl text-center"
                    style={{ color: ColorCoffee }}
                >
                    Menu
                </h1>

                <CartIconWithBadge onPress={() => router.push('/cart')} />
            </header>

            {/* Contenido con animación */}
            <motion.main
                className="flex flex-1 flex-col items-center pt-8 pb-24 px-4 sm:px-6 w-full max-w-screen-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    opacity: { duration: 0.6 },
                    y: { type: "spring", stiffness: 80, damping: 15 }
                }}
            >
                <CategoryCard category={category} />
            </motion.main>
        </div>
    );
}
