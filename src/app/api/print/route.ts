import { NextResponse } from "next/server"
import { Order } from "../../../features/comanda/types/order.types"
import { printOrder } from "../../../features/comanda/lib/printer"
import { getNextOrderNumber } from "../../../features/comanda/lib/orderCounter"

export async function POST(req: Request) {

    try {

        const order: Order = await req.json()

        // Assign a daily-resetting order number from Firestore
        order.orderNumber = await getNextOrderNumber()

        await printOrder(order)

        return NextResponse.json({
            success: true,
            orderNumber: order.orderNumber
        })

    } catch (error) {

        console.error(error)

        return NextResponse.json(
            { success: false },
            { status: 500 }
        )

    }

}