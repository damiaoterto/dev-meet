import type { Server as HttpServer } from 'node:http'
import type { HttpAdapter } from '@core/ports/http-adapter'
import type { Server as IoServerType, Socket } from 'socket.io'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SocketIoAdapter } from './socket-io-adapter'

vi.mock('socket.io', () => ({
	Server: vi.fn().mockImplementation(() => {
		return {
			on: vi.fn(),
			disconnectSockets: vi.fn((_close) => Promise.resolve()), // Mock disconnectSockets to return a resolved promise
		}
	}),
}))

describe('SocketIO Adapter', async () => {
	let mockHttpAdapter: HttpAdapter
	let mockNodeHttpServer: HttpServer
	let adapter: SocketIoAdapter
	let mockIoServerInstance: IoServerType

	const MockIoServer = vi.mocked((await import('socket.io')).Server, true)

	beforeEach(() => {
		mockNodeHttpServer = {} as HttpServer // Minimal mock for Node's HttpServer
		mockHttpAdapter = {
			getHttpServer: vi.fn(() => mockNodeHttpServer),
			listen: vi.fn(),
			close: vi.fn(),
			getInstance: vi.fn(),
		} as unknown as HttpAdapter // Cast to HttpAdapter, mocking only used methods

		adapter = new SocketIoAdapter(mockHttpAdapter)
		// The instance created by `new Server()` in the constructor
		mockIoServerInstance = MockIoServer.mock.results[0].value
	})

	afterEach(() => {
		vi.clearAllMocks()
		MockIoServer.mockClear()
	})

	it('should be defined', () => {
		expect(adapter).toBeDefined()
	})

	it('should create a socket.io server with the http server from HttpAdapter', () => {
		expect(mockHttpAdapter.getHttpServer).toHaveBeenCalledTimes(1)
		expect(MockIoServer).toHaveBeenCalledWith(mockNodeHttpServer)
		expect(adapter.io).toBeDefined()
		expect(adapter.io).toBe(mockIoServerInstance)
	})

	it('should call the connection callback when a connection event occurs', async () => {
		const mockSocket = { id: 'test-socket' } as Socket // Minimal mock for Socket
		const connectionCallback = vi.fn()

		adapter.onConnection(connectionCallback)

		// Simulate a connection event
		const connectionHandler = vi
			.mocked(mockIoServerInstance.on)
			.mock.calls.find((call) => call[0] === 'connection')?.[1]

		if (connectionHandler) {
			await connectionHandler(mockSocket) // Pass the mock socket to the handler
		} else {
			throw new Error('Connection handler not registered')
		}

		expect(connectionCallback).toHaveBeenCalledWith(mockSocket)
	})

	it('should close the socket.io server without errors', async () => {
		await expect(adapter.close()).resolves.not.toThrow()
		expect(
			vi.mocked(mockIoServerInstance.disconnectSockets),
		).toHaveBeenCalledWith(true)
	})
})
