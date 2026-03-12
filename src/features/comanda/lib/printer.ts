import escpos from 'escpos'
import Network from 'escpos-network'
import { Order } from '../types/order.types'

export const printOrder = async (order: Order) => {
    return new Promise((resolve, reject) => {
        // IP de la impresora (esto debería venir de una config)
        const device = new Network('192.168.0.15')
        const printer = new escpos.Printer(device)

        device.open((err) => {
            if (err) {
                console.error('Error opening device:', err)
                return reject(err)
            }

            try {
                printer
                    .font('A')
                    .align('CT')
                    .style('BU')
                    .size(1, 1)
                    .text('COMANDA')
                    .text(`CLIENTE: ${order.name}`)
                if (order.mesa) printer.text(`MESA: ${order.mesa}`)

                printer
                    .text('--------------------------------')
                    .align('LT')

                order.products.forEach(product => {
                    printer.text(`${product.quantity} x ${product.productName}`)
                    if (product.variantLabel) printer.text(`  (${product.variantLabel})`)
                    if (product.additions && product.additions.length > 0) {
                        product.additions.forEach(add => {
                            printer.text(`   + ${add.name}`)
                        })
                    }
                })

                if (order.notes) {
                    printer.text('--------------------------------')
                    printer.text('NOTAS:')
                    printer.text(order.notes)
                }

                printer
                    .text('--------------------------------')
                    .text(`PAGO: ${order.paymentMethod}`)
                    .text(`TOTAL: $${order.total}`)
                    .text('--------------------------------')
                    .cut()
                    .close(() => {
                        resolve(true)
                    })
            } catch (error) {
                console.error('Error during printing:', error)
                reject(error)
            }
        })
    })
}