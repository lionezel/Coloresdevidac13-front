"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCategory } from "../hooks/useCategory";
import { useLoading } from "../hooks/useLoading";
import { CategoryCard } from "./CardCategory";
import { CartIconWithBadge } from "./CartIconWithBadge";
import { BackgroundColor, ColorGlobal, ColorCoffee } from "../../../global/colorGlobal";
import { useAuth } from "@/src/context/AuthContext";

export default function HomeView() {
    const { category, loading } = useCategory();
    const router = useRouter();
    const { Loading } = useLoading();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

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
                    onClick={() => router.push('/orders')}
                    className="flex h-10 px-4 sm:h-12 items-center justify-center rounded-full bg-white font-bold shadow-sm transition-all hover:bg-gray-50 border border-black/10"
                    style={{ color: ColorCoffee }}
                    aria-label="Ver Pedidos Activos"
                >
                    <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="hidden sm:inline font-[Ubuntu]">Pedidos</span>
                </button>

                <h1
                    className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-[Ubuntu] lg:text-6xl text-center"
                    style={{ color: ColorCoffee }}
                >
                    Menu
                </h1>

                <div className="flex items-center gap-3">
                    {/* Waitress info + logout */}
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-500 max-w-[120px] truncate">
                            {user?.email}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Cerrar sesión"
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-sm border border-black/10 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                    <CartIconWithBadge onPress={() => router.push('/cart')} />
                </div>
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

