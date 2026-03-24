"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ColorGlobal } from "@/src/global/colorGlobal";
import { sendToKitchen } from "@/src/features/comanda/services/printService";

export default function OrderSuccessPage() {
    const router = useRouter();

    const handlePrint = async () => {
        try {
            const lastOrderStr = sessionStorage.getItem("lastOrder");
            if (lastOrderStr) {
                // You can do your print job here:
                // const lastOrder = JSON.parse(lastOrderStr);
                // await sendToKitchen(lastOrder);
                sessionStorage.removeItem("lastOrder");
            }
        } catch (error) {
            console.error("Error al imprimir:", error);
            // Non-blocking error for navigation
        } finally {
            router.push("/home");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl"
                style={{ backgroundColor: ColorGlobal }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black text-[#333] mb-4 font-[Ubuntu]"
            >
                ¡Pedido Realizado!
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 mb-10 max-w-sm font-[Ubuntu]"
            >
                Tu orden ha sido enviada con éxito. Estaremos procesándola en breve.
            </motion.p>

            <motion.button
                onClick={handlePrint}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-all"
                style={{ backgroundColor: ColorGlobal, boxShadow: `0 10px 20px ${ColorGlobal}4D` }}
            >
                Volver al Menú
            </motion.button>
        </div>
    );
}
