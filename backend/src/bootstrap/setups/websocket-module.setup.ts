import { getOnConnectionEventFn } from '@core/decorators/web-socket/web-socket-events.decorator'
import type { WebSocketAdapter } from '@core/ports/web-socket-adapter'
import type { Socket } from 'socket.io'
import type { AppModule } from 'src/app-module'
import { inject, injectable } from 'tsyringe'

@injectable()
export class WebSocketModuleSetup {
	constructor(
		@inject('AppModule')
		private readonly appModule: AppModule,

		@inject('WebSocketAdapter')
		private readonly webSocketAdapter: WebSocketAdapter,
	) {}

	execute() {
		const events = this.appModule.getAllEvents().map((event) => new event())
		this.webSocketAdapter.onConnection(async (socket: Socket) => {
			for (const event of events) {
				const fn = getOnConnectionEventFn(event)
				if (fn) await fn(socket)
			}
		})
	}
}
