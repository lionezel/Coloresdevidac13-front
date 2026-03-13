import escpos from 'escpos'
import Network from 'escpos-network'
import { Order } from '../types/order.types'
import { Socket } from 'net'

// Caché para no tener que escanear la red cada vez que se imprime
let cachedPrinterIp: string | null = null;

const checkPrinterPort = (ip: string, port: number = 9100, timeout: number = 1000): Promise<boolean> => {
    return new Promise((resolve) => {
        const socket = new Socket();
        socket.setTimeout(timeout);
        
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.connect(port, ip);
    });
};

const findPrinterIp = async (): Promise<string | null> => {
    // Si ya tenemos una IP en caché, primero verificamos si la impresora sigue ahí
    if (cachedPrinterIp) {
        const isActive = await checkPrinterPort(cachedPrinterIp);
        if (isActive) return cachedPrinterIp;
    }

    // Si no está en caché o cambió, escaneamos el rango de la red actual (192.168.1.1 - 192.168.1.254)
    const baseIp = '192.168.1.';
    const scanPromises: Promise<{ ip: string; isOpen: boolean }>[] = [];

    // Saltamos el 0 y 255 (red y broadcast)
    for (let i = 1; i <= 254; i++) {
        const ip = `${baseIp}${i}`;
        scanPromises.push(
            checkPrinterPort(ip).then(isOpen => ({ ip, isOpen }))
        );
    }

    try {
        // Promise.any retorna la primera promesa que se resuelva exitosamente
        const firstFoundIp = await Promise.any(
            scanPromises.map(p => p.then(result => {
                if (result.isOpen) return result.ip;
                throw new Error('Not the printer');
            }))
        );
        
        cachedPrinterIp = firstFoundIp;
        return firstFoundIp;
    } catch (e) {
        // Si todas las promesas fallan (ninguna IP tiene el puerto 9100 abierto)
        return null;
    }
};

export const printOrder = async (order: Order) => {
    const printerIp = await findPrinterIp();
    
    return new Promise((resolve, reject) => {
        if (!printerIp) {
            console.error('No se pudo encontrar ninguna impresora en el rango 192.168.1.1 - 192.168.1.254');
            return reject(new Error('Impresora no encontrada en la red local.'));
        }

        const device = new Network(printerIp)
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
                    .text('')
                    .text('')
                    .text('')
                    .text('')
                    .text(order.isDelivery ? `COMANDA - DOMICILIO #${order.orderNumber ?? ''}` : `COMANDA #${order.orderNumber ?? ''}`)
                    .text(`CLIENTE: ${order.name}`)
                if (order.mesa) printer.text(`MESA: ${order.mesa}`)
                if (order.isDelivery) printer.text('*** PARA DOMICILIO ***')

                printer
                    .text('--------------------------------')
                    .align('LT')

                order.products.forEach(product => {
                    printer.text(`${product.quantity} x ${product.productName}`)
                })

                if (order.notes) {
                    printer.text('--------------------------------')
                    printer.text('NOTAS:')
                    printer.text(order.notes)
                }

                printer
                    .text('--------------------------------')
                    .text(`PAGO: ${order.paymentMethod}`)

                if (order.isDelivery && order.shippingCost) {
                    printer.text(`SUBTOTAL: $${order.subtotal || (order.total - order.shippingCost)}`)
                    printer.text(`DOMICILIO: $${order.shippingCost}`)
                }

                printer
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