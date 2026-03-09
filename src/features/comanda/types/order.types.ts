export type OrderItem = {
    name: string
    qty: number
}

export type Order = {
    mesa: number
    mesera: string
    items: OrderItem[]
}