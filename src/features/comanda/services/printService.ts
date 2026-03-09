import { Order } from "../types/order.types"

export const sendToKitchen = async (order: Order) => {

    const res = await fetch("/api/print", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    })

    if (!res.ok) {
        throw new Error("Error enviando comanda")
    }

}