import type { Server as HttpServer } from 'node:http'
import type { HttpAdapter } from '@core/ports/http-adapter'
import type {
	WebSocketAdapter,
	WsConnectionCallback,
} from '@core/ports/web-socket-adapter'
import { Server as IoServer, type Socket } from 'socket.io'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SocketIoAdapter implements WebSocketAdapter {
	public readonly io: IoServer

	constructor(
		@inject('HttpAdapter') private readonly httpAdapter: HttpAdapter,
	) {
		this.io = new IoServer(this.httpAdapter.getHttpServer())
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
