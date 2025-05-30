import type { Server as HttpServer } from 'node:http'
import type {
	WebSocketAdapter,
	WsConnectionCallback,
} from '@core/ports/web-socket-adapter'
import { Server as IoServer, type Socket } from 'socket.io'

export class SocketIoAdapter implements WebSocketAdapter {
	public readonly io: IoServer

	constructor(server: HttpServer) {
		this.io = new IoServer(server)
	}

	onConnection(cb: WsConnectionCallback<Socket>): void {
		this.io.on('connection', async (socket: Socket) => {
			await cb(socket)
		})
	}

	async close(): Promise<void> {
		return new Promise((resolve) => {
			this.io.disconnectSockets(true)
			resolve()
		})
	}
}
