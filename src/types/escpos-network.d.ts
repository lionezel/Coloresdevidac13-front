declare module 'escpos-network' {
    import { EventEmitter } from 'events';
    import { Socket } from 'net';

    export default class Network extends EventEmitter {
        constructor(address: string, port?: number);
        address: string;
        port: number;
        device: Socket | null;
        open(callback?: (err: Error | null, device: Socket) => void): this;
        write(data: Buffer | Uint8Array, callback?: (err?: Error) => void): this;
        read(callback?: (data: Buffer) => void): this;
        close(callback?: (err: Error | null, device: Socket | null) => void): this;
    }
}
