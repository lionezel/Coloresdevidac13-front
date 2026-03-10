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
            className="flex min-h-screen flex-col"
            style={{ backgroundColor: BackgroundColor }}
        >
            {/* Header */}
            <header className="flex h-32 w-full items-center justify-between px-6 lg:px-12">
                <button
                    onClick={() => router.back()}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100/50 text-gray-600 transition-all hover:bg-gray-200"
                    aria-label="Volver"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>

                <h1
                    className="text-5xl font-black uppercase tracking-tight font-[Ubuntu] lg:text-6xl"
                    style={{ color: ColorCoffee }}
                >
                    Menu
                </h1>

                <CartIconWithBadge onPress={() => router.push('/cart')} />
            </header>

            {/* Contenido con animación */}
            <motion.main
                className="flex flex-1 flex-col items-center pt-10 pb-20"
                initial={{ opacity: 0, y: 50 }}
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
