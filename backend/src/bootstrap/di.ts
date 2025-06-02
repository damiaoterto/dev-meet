import type { HttpAdapter } from '@core/ports/http-adapter'
import type { WebSocketAdapter } from '@core/ports/web-socket-adapter'
import { ExpressAdapter } from '@infrastructure/http/express-adapter'
import { PeerAdapter } from '@infrastructure/web-rtc/peer-adapter'
import { SocketIoAdapter } from '@infrastructure/ws/socket-io-adapter'
import { container } from 'tsyringe'
import { AppModule } from '../app-module'
import { HttpModuleSetup } from './http-module.setup'

container.register<AppModule>('AppModule', AppModule)
container.registerSingleton<HttpAdapter>('HttpAdapter', ExpressAdapter)
container.registerSingleton<WebSocketAdapter>(
	'WebSocketAdapter',
	SocketIoAdapter,
)
container.registerSingleton('WebRTCAdapter', PeerAdapter)
container.registerSingleton('HttpModuleSetup', HttpModuleSetup)

export default container
