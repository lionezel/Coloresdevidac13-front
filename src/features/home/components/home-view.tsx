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
                    className="flex h-12 w-12 items-center justify-center rounded-full  text-gray-600 transition-all "
                    aria-label="Volver"
                >
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
