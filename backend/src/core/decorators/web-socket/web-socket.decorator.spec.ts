import { describe, expect, it } from 'vitest'
import { WEB_SOCKET_METADATA } from '../constants'
import { WebSocket } from './web-socket.decorator'

@WebSocket('meet')
class TestController {}

describe('Websocket Decorator', () => {
	it('should define base path metadata for the controller', () => {
		const controller = new TestController()
		const controllerConstructor = controller.constructor

		const webSocketNamespace = Reflect.getMetadata(
			WEB_SOCKET_METADATA,
			controllerConstructor,
		)

		expect(webSocketNamespace).toBe('meet')
	})
})
