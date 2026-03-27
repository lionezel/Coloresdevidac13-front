import React, { forwardRef } from "react";
import { Order } from "../../comanda/types/order.types";
import { ColorGlobal } from "@/src/global/colorGlobal";

interface InvoiceReceiptProps {
    order: (Order & {
        subTotal?: number;
        discountAmount?: number;
        tipAmount?: number;
        isGuiaPlan?: boolean;
        guiaDiscount?: number;
    }) | null;
}

export const InvoiceReceipt = forwardRef<HTMLDivElement, InvoiceReceiptProps>(
    ({ order }, ref) => {
        if (!order) return null;

        return (
            <div ref={ref} className="p-6 bg-white text-black max-w-sm mx-auto font-mono text-sm">
                <div className="text-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold uppercase" style={{ color: ColorGlobal }}>Recibo de Venta</h2>
                    <p className="text-gray-500 mt-1">Orden: {order.name || (order.mesa ? `Mesa ${order.mesa}` : "Sin nombre")}</p>
                    <p className="text-gray-500">{new Date().toLocaleString()}</p>
                </div>

                <div className="mb-6 space-y-2">
                    {order.products.map((p, idx) => (
                        <div key={idx} className="flex justify-between">
                            <span>{p.quantity}x {p.productName}</span>
                            <span>${(p.price * p.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 space-y-2 font-bold mb-6">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${(order.subTotal || 0).toLocaleString()}</span>
                    </div>

                    {order.discountAmount ? (
                        <div className="flex justify-between text-red-600">
                            <span>Descuento {order.isGuiaPlan ? "(+ Guía)" : ""}</span>
                            <span>-${order.discountAmount.toLocaleString()}</span>
                        </div>
                    ) : null}

                    {order.tipAmount ? (
                        <div className="flex justify-between text-green-600">
                            <span>Propina</span>
                            <span>+${order.tipAmount.toLocaleString()}</span>
                        </div>
                    ) : null}

                    <div className="flex justify-between text-lg mt-2 pt-2 border-t">
                        <span>TOTAL</span>
                        <span style={{ color: ColorGlobal }}>${(order.total || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-8">
                    <p>Método de Pago: {order.paymentMethod}</p>
                    <p className="mt-2">¡Gracias por su compra!</p>
                </div>
            </div>
        );
    }
);

InvoiceReceipt.displayName = "InvoiceReceipt";
