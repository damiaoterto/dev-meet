import { exit } from 'node:process'
import { ExpressAdapter } from '@adapters/http/express-adapter'
import { SocketIoAdapter } from '@adapters/ws/socket-io-adapter'
import type { HttpAdapter } from '@core/ports/http-adapter'
import type { WebSocketAdapter } from '@core/ports/web-socket-adapter'
import { ProcessExit } from '@core/shared/enums/process-exit.enum'
import type { Socket } from 'socket.io'

type ListenPorts = {
	http?: number
	peer?: number
}

interface DevMeetOptions {
	httpAdapter?: HttpAdapter
	wsAdapter?: WebSocketAdapter
}

export class DevMeet {
	private readonly httpAdapter: HttpAdapter
	private readonly wsAdapter: WebSocketAdapter

	constructor(options?: DevMeetOptions) {
		this.httpAdapter = !options?.httpAdapter
			? new ExpressAdapter()
			: options?.httpAdapter

		this.wsAdapter = !options?.wsAdapter
			? new SocketIoAdapter(this.httpAdapter.getHttpServer())
			: options.wsAdapter

		this.listenWsEvents()
	}

	private listenWsEvents() {
		this.wsAdapter.onConnection(async (socket: Socket) => {
			// TODO: events handler implementation here
		})
	}

	enableGracefulShutdown(timeout = 5000) {
		const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']

		for (const signal of signals) {
			process.on(signal, async () => {
				console.log(`Received signal ${signal}, init graceful shutdown`)

				const timer = setTimeout(() => {
					console.error('Time limit exceeded, forcing shutdown')
					exit(ProcessExit.ERROR)
				}, timeout)

				try {
					await this.wsAdapter.close()
					await this.httpAdapter.close()
					console.log('Shutdown completed successfully')
					exit(ProcessExit.SUCCESS)
				} catch (error) {
					console.log('Error on shutdown:', error)
					exit(ProcessExit.ERROR)
				} finally {
					clearTimeout(timer)
				}
			})
		}
	}

	async listen(ports?: ListenPorts): Promise<void> {
		const httpPort = ports?.http || 3000
		const peerPort = ports?.peer || 9000

		console.log(`Http service listen on port ${httpPort}`)
		console.log(`Peer service listen on port ${peerPort}`)

		await this.httpAdapter.listen(httpPort)
	}

	static createApp() {
		return new DevMeet()
		// TODO: implement
	}
}
