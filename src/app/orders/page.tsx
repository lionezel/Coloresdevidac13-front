import { Suspense } from "react";
import OrdersList from "@/src/features/orders/components/OrdersList";
import { BackgroundColor, ColorCoffee } from "@/src/global/colorGlobal";
import Link from "next/link";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";


export default function OrdersPage() {
    return (
        <ProtectedRoute>
            <div
                className="flex min-h-screen flex-col font-sans"
                style={{ backgroundColor: BackgroundColor }}
            >
                {/* Header */}
                <header className="flex h-24 sm:h-32 w-full items-center justify-between px-6 lg:px-12 sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-sm transition-all">
                    <Link
                        href="/home"
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-gray-600 transition-all hover:bg-gray-100"
                        aria-label="Volver"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>

                    <h1
                        className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-[Ubuntu] lg:text-6xl text-center"
                        style={{ color: ColorCoffee }}
                    >
                        Pedidos Activos
                    </h1>

                    <div className="w-10 sm:w-12"></div> {/* Spacer for centering */}
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col items-center pt-8 pb-24 px-4 sm:px-6 w-full max-w-screen-2xl mx-auto">
                    <Suspense fallback={
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: ColorCoffee }}></div>
                        </div>
                    }>
                        <OrdersList />
                    </Suspense>
                </main>
            </div>
        </ProtectedRoute>
    );
}

