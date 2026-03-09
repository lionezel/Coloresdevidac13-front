import { NextResponse } from "next/server"
import { Order } from "../../../features/comanda/types/order.types"
import { printOrder } from "../../../features/comanda/lib/printer"

export async function POST(req: Request) {

    try {

        const order: Order = await req.json()

        await printOrder(order)

        return NextResponse.json({
            success: true
        })

    } catch (error) {

        console.error(error)

        return NextResponse.json(
            { success: false },
            { status: 500 }
        )

    }

}