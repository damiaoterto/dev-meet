import { getOnConnectionEventFn } from '@core/decorators/web-socket/web-socket-events.decorator'
import type { WebSocketAdapter } from '@core/ports/web-socket-adapter'
import { Server as IoServerType } from 'socket.io'
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import type { AppModule } from '../../app-module'
import { WebSocketModuleSetup } from './websocket-module.setup'

vi.mock('socket.io', () => ({
	Server: vi.fn().mockImplementation(() => {
		return {
			on: vi.fn(),
			disconnectSockets: vi.fn((_close) => Promise.resolve()),
		}
	}),
}))

const mockAppModule = {
	getAllControllers: vi.fn().mockReturnValue([class MockController {}]),
	getAllEvents: vi.fn().mockReturnValue([class MockEvent {}]),
} as AppModule

const mockWebSocketAdapter = {
	close: vi.fn().mockResolvedValue(undefined),
	onConnection: vi.fn(),
} as WebSocketAdapter

vi.mock('@core/decorators/web-socket/web-socket-events.decorator', () => ({
	getOnConnectionEventFn: vi.fn(),
}))

describe('WebSocket Module Setup', async () => {
	let webSocketModuleSetup: WebSocketModuleSetup

	const MockIoServer = vi.mocked((await import('socket.io')).Server, true)

	beforeEach(() => {
		webSocketModuleSetup = new WebSocketModuleSetup(
			mockAppModule,
			mockWebSocketAdapter,
		)
	})

	afterEach(() => {
		vi.clearAllMocks()
		MockIoServer.mockClear()
	})

	it('should be defined', () => {
		expect(webSocketModuleSetup).toBeDefined()
	})

	it('should register all on connection event by decorator', async () => {
		const mockFn = () => undefined
		;(getOnConnectionEventFn as Mock).mockReturnValue(mockFn)

		webSocketModuleSetup.execute()

		const connectionHandler = vi.mocked(mockWebSocketAdapter.onConnection).mock
			.calls[0][0]

		await connectionHandler(mockFn)

		expect(mockWebSocketAdapter.onConnection).toBeCalledTimes(1)
		expect(getOnConnectionEventFn).toBeCalledTimes(1)
	})
})
