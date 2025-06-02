import { exit } from 'node:process'
import container from '@bootstrap/di'
import { getOnConnectionEventFn } from '@core/decorators/web-socket/web-socket-events.decorator'
import type { HttpAdapter } from '@core/ports/http-adapter'
import type { WebRTCAdapter } from '@core/ports/web-rtc-adapter'
import type { WebSocketAdapter } from '@core/ports/web-socket-adapter'
import { ProcessExit } from '@core/shared/enums/process-exit.enum'
import type { Socket } from 'socket.io'
import { inject, injectable } from 'tsyringe'
import type { AppModule } from '../app-module'
import type { HttpModuleSetup } from './http-module.setup'
import type { WebSocketModuleSetup } from './websocket-module.setup'

type ListenPorts = {
	http?: number
	peer?: number
}

@injectable()
export class DevMeet {
	constructor(
		@inject('AppModule')
		private readonly appModule: AppModule,

		@inject('HttpAdapter')
		private readonly httpAdapter: HttpAdapter,

		@inject('WebSocketAdapter')
		private readonly wsAdapter: WebSocketAdapter,

		@inject('WebRTCAdapter')
		private readonly webRTCAdapter: WebRTCAdapter,

		@inject('HttpModuleSetup')
		private readonly httpModuleSetup: HttpModuleSetup,

		@inject('WebSocketModuleSetup')
		private readonly webSocketModuleSetup: WebSocketModuleSetup,
	) {
		this.bootstrap()
	}

	private bootstrap() {
		this.httpModuleSetup.execute()
		this.webSocketModuleSetup.execute()
	}

	private listenPeerEvents(port: number, path = '/peer') {
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

		this.webRTCAdapter.createPeerServer(peerPort, '/peer')

		this.listenPeerEvents(peerPort)

		await this.httpAdapter.listen(httpPort)

		console.log(`Http service listen on port ${httpPort}`)
		console.log(`Peer service listen on port ${peerPort}`)
	}

	static createApp() {
		return container.resolve(DevMeet)
	}
}
