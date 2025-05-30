import type { Server } from 'node:http'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SocketIoAdapter } from './socket-io-adapter'

type MockSocket = {
	on: (event: string, cb: (...args: unknown[]) => void) => void
	emit: (event: string, ...args: unknown[]) => void
}

const createMockSocket = (): MockSocket => ({
	on: vi.fn(),
	emit: vi.fn(),
})

const createMockIoServer = () => {
	const mockOn = vi.fn()
	const mockClose = vi.fn()

	return {
		on: mockOn,
		disconnectSockets: mockClose,
	}
}

const mockIoServer = createMockIoServer()

vi.mock('socket.io', () => ({
	Server: vi.fn(() => mockIoServer),
}))

describe('SocketIO Adapter', () => {
	let mockHttpServer: Server
	let adapter: SocketIoAdapter

	beforeEach(() => {
		mockHttpServer = {} as Server
		adapter = new SocketIoAdapter(mockHttpServer)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should be defined', () => {
		expect(adapter).toBeDefined()
	})

	it('should call the connection callback when a connection event occurs', async () => {
		const mockSocket = createMockSocket()
		const connectionCallback = vi.fn()

		adapter.onConnection(connectionCallback)

		const connectionHandler = mockIoServer.on.mock.calls.find(
			(call) => call[0] === 'connection',
		)?.[1]

		if (connectionHandler) {
			await connectionHandler(mockSocket)
		} else {
			throw new Error('Connection handler not registered')
		}

		expect(connectionCallback).toHaveBeenCalledWith(mockSocket)
	})

	it('should close the socket.io server without errors', async () => {
		await expect(adapter.close()).resolves.not.toThrow()
		expect(mockIoServer.disconnectSockets).toHaveBeenCalled()
	})
})
