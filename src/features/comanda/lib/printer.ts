import escpos from 'escpos'
import Network from 'escpos-network'
import { Order } from '../types/order.types'

export const printOrder = async (order: Order) => {
    return new Promise((resolve, reject) => {
        // IP de la impresora (esto debería venir de una config)
        const device = new Network('192.168.1.15')
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
                    .text(`MESA: ${order.mesa}`)
                    .text(`MESERA: ${order.mesera}`)
                    .text('--------------------------------')
                    .align('LT')

                order.items.forEach(item => {
                    printer.text(`${item.qty} x ${item.name}`)
                })

                printer
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