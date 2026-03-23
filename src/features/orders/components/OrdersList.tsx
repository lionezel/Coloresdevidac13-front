"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useOrders } from "../hooks/useOrders";
import { ColorGlobal } from "@/src/global/colorGlobal";
import { useFormatPrice } from "@/src/features/category/hooks/useFormatPrice";
import { OrderWithId } from "../hooks/useOrders";

export default function OrdersList() {
    const { orders, loading } = useOrders();
    const router = useRouter();
    const { formatPrice } = useFormatPrice();

    const handleAddToOrder = (order: OrderWithId) => {
        // Save the order details in sessionStorage to be used during the next checkout
        sessionStorage.setItem("editingOrderId", order.id);
        const orderIdentifier = order.mesa ? `Mesa ${order.mesa}` : (order.name || "Pedido sin nombre");
        sessionStorage.setItem("editingOrderName", orderIdentifier);

        // Redirect to home to let the user add items to the cart
        router.push("/home");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: ColorGlobal }}></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm mt-8">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-xl font-bold text-gray-400 font-[Ubuntu]">No hay pedidos activos</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#333] font-[Ubuntu] mb-6">Pedidos Recientes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order, index) => {
                    const orderIdentifier = order.mesa ? `Mesa ${order.mesa}` : (order.name || "Sin nombre");
                    const dateStr = order.date?.toDate ? order.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Ahora";

                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative"
                        >
                            {/* Status Badge */}
                            <div className="absolute -top-3 -right-3">
                                {order.state === 'listo / caja' ? (
                                    <div className="px-4 py-1.5 rounded-full text-xs font-bold shadow-md text-white font-[Ubuntu] bg-green-500 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Listo / Caja
                                    </div>
                                ) : (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-bold shadow-md text-white font-[Ubuntu] bg-blue-500">
                                        En Orden
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-start mb-4 mt-2">
                                <div>
                                    <h3 className="text-xl font-bold text-[#333] font-[Ubuntu]">{orderIdentifier}</h3>
                                    <p className="text-sm text-gray-500 font-[Ubuntu]">{dateStr}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black font-[Ubuntu]" style={{ color: ColorGlobal }}>
                                        ${formatPrice(order.total || 0)}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-500 font-[Ubuntu]">
                                        {order.products?.length || 0} items
                                    </p>
                                </div>
                            </div>

                            {/* Products preview */}
                            <div className="mb-6 flex-1">
                                <ul className="space-y-2">
                                    {order.products?.slice(0, 3).map((prod, i) => (
                                        <li key={i} className="flex justify-between text-sm text-gray-600 font-[Ubuntu]">
                                            <span className="truncate pr-4">
                                                <span className="font-bold mr-1">{prod.quantity}x</span>
                                                {prod.productName}
                                            </span>
                                        </li>
                                    ))}
                                    {order.products?.length > 3 && (
                                        <li className="text-xs text-gray-400 font-bold mt-2 font-[Ubuntu]">
                                            + {order.products.length - 3} productos más
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleAddToOrder(order)}
                                className="w-full py-3 rounded-2xl flex items-center justify-center font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-md"
                                style={{ backgroundColor: ColorGlobal }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="font-[Ubuntu]">Añadir a este pedido</span>
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
