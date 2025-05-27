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
	const mockClose = vi.fn((cb) => cb())

	return {
		on: mockOn,
		close: mockClose,
	}
}

const mockIoServer = {
	on: vi.fn(),
	close: vi.fn((cb) => cb()),
}

vi.mock('socket.io', () => ({
	Server: vi.fn(() => mockIoServer),
}))

describe('SocketIO Adapter', () => {
	let mockHttpServer: Server
	let mockIoServer: ReturnType<typeof createMockIoServer>
	let adapter: SocketIoAdapter

	beforeEach(() => {
		mockHttpServer = {} as Server
		mockIoServer = createMockIoServer()

		adapter = new SocketIoAdapter(mockHttpServer)
	})

	it('should be defined', () => {
		expect(adapter).toBeDefined()
	})
})
