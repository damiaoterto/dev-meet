import { exit } from 'node:process'
import { ExpressAdapter } from '@adapters/http/express-adapter'
import { PeerAdapter } from '@adapters/web-rtc/peer-adapter'
import { SocketIoAdapter } from '@adapters/ws/socket-io-adapter'
import { getRouterInfo } from '@core/decorators/http/method.decorator'
import { getOnConnectionEventFn } from '@core/decorators/web-socket/web-socket-events.decorator'
import type { HttpAdapter } from '@core/ports/http-adapter'
import type { WebRTCAdapter } from '@core/ports/web-rtc-adapter'
import type { WebSocketAdapter } from '@core/ports/web-socket-adapter'
import type { HttpMethod } from '@core/shared/enums/http/http-methods'
import { ProcessExit } from '@core/shared/enums/process-exit.enum'
import type { Socket } from 'socket.io'
import type { AppModule } from '../app-module'

type ListenPorts = {
	http?: number
	peer?: number
}

interface DevMeetOptions {
	httpAdapter?: HttpAdapter
	wsAdapter?: WebSocketAdapter
	webRTCAdapter?: WebRTCAdapter
}

export class DevMeet {
	private readonly httpAdapter: HttpAdapter

	private readonly wsAdapter: WebSocketAdapter

	private webRTCAdapter: WebRTCAdapter

	private options?: DevMeetOptions

	private appModule: AppModule

	constructor(module: AppModule, options?: DevMeetOptions) {
		this.options = options
		this.httpAdapter = !options?.httpAdapter
			? new ExpressAdapter()
			: options?.httpAdapter

		this.wsAdapter = !options?.wsAdapter
			? new SocketIoAdapter(this.httpAdapter.getHttpServer())
			: options.wsAdapter

		this.appModule = module
		this.registerRoutes()
	}

	registerRoutes() {
		const controllers = this.appModule.getAllControllers()

		for (const controller of controllers) {
			const instance = new controller()
			const routes = getRouterInfo(instance)

			for (const route of routes) {
				this.httpAdapter.registerRouter(
					route.method as HttpMethod,
					route.path,
					route.handler,
				)
			}
		}
	}

	private listenWsEvents() {
		const events = this.appModule.getAllEvents().map((event) => new event())
		this.wsAdapter.onConnection(async (socket: Socket) => {
			for (const event of events) {
				const fn = getOnConnectionEventFn(event)
				if (!fn) continue
				await fn(socket)
			}
		})
	}

	private listenPeerEvents(port: number, path = '/peer') {
		if (!this.options?.webRTCAdapter) {
			this.webRTCAdapter = new PeerAdapter(port, path)
		}

		this.webRTCAdapter.onConnection(async (client) => {
			// TODO: peer events handler implementation here
		})

		this.webRTCAdapter.onError(async (error) => {
			console.error(error)
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

		this.listenWsEvents()
		this.listenPeerEvents(peerPort)

		await this.httpAdapter.listen(httpPort)

		console.log(`Http service listen on port ${httpPort}`)
		console.log(`Peer service listen on port ${peerPort}`)
	}

	static createApp(module: AppModule, options?: DevMeetOptions) {
		return new DevMeet(module, options)
	}
}
