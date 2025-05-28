import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PeerAdapter } from './peer-adapter'

type MockPeer = {
	on: (event: string, cb: (...args: unknown[]) => void) => void
}

const createMockSocket = (): MockPeer => ({
	on: vi.fn(),
})

const createMockPeerServer = () => {
	const mockOn = vi.fn()
	const mockListen = vi.fn()

	return {
		on: mockOn,
		listen: mockListen,
	}
}

const mockPeerServer = createMockPeerServer()

vi.mock('peer', () => ({
	PeerServer: vi.fn(() => mockPeerServer),
}))

describe('PeerAdapter', () => {
	let adapter: PeerAdapter

	beforeEach(() => {
		adapter = new PeerAdapter()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should be defined', () => {
		expect(adapter).toBeDefined()
	})

	it('should call the connection callback when a connection event occurs', async () => {
		const mockPeer = createMockSocket()
		const connectionCallback = vi.fn()

		adapter.onConnection(connectionCallback)

		const connectionHandler = mockPeerServer.on.mock.calls.find(
			(call) => call[0] === 'connection',
		)?.[1]

		if (connectionHandler) {
			await connectionHandler(mockPeer)
		} else {
			throw new Error('Connection handler not registered')
		}

		expect(connectionCallback).toHaveBeenCalledWith(mockPeer)
	})
})
