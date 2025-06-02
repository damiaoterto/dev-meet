import { randomUUID } from 'node:crypto'
import type { WebRTCAdapter } from '@core/ports/web-rtc-adapter'
import { PeerServer, type PeerServerEvents } from 'peer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PeerAdapter } from './peer-adapter'

vi.mock('peer', () => ({
	PeerServer: vi.fn().mockImplementation(() => {
		return {
			on: vi.fn(),
		}
	}),
}))

const mockedPeerServer = vi.mocked(PeerServer)

describe('PeerAdapter', () => {
	let adapter: WebRTCAdapter<PeerServerEvents>
	let server: PeerServerEvents
	let mockPeerInstance: { on: ReturnType<typeof vi.fn> }

	beforeEach(() => {
		adapter = new PeerAdapter()

		mockPeerInstance = { on: vi.fn() }
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		mockedPeerServer.mockReturnValue(mockPeerInstance as any)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should be defined', () => {
		expect(adapter).toBeDefined()
	})

	it('should create a peer server with correct path and port', () => {
		const port = 9090
		const path = '/p2p-path'

		const peer = adapter.createPeerServer(port, path)

		expect(mockedPeerServer).toBeCalledTimes(1)
		expect(mockedPeerServer).toHaveBeenCalledWith({ port, path })

		expect(peer).toBe(mockPeerInstance)
	})

	it('should register a callback for "error" event and trigger it', () => {
		const errorCallback = vi.fn()
		const testError = new Error('Error on connection')

		adapter.createPeerServer(9090, '/peer')
		adapter.onError(errorCallback)

		expect(mockPeerInstance.on).toHaveBeenCalledWith(
			'error',
			expect.any(Function),
		)

		const errorListener = mockPeerInstance.on.mock.calls.find(
			(call) => call[0] === 'error',
		)?.[1]

		expect(errorListener).toBeDefined()
		errorListener(testError)

		expect(errorCallback).toHaveBeenCalledTimes(1)
		expect(errorCallback).toHaveBeenCalledWith(testError)
	})

	it('should register a callback for "connection" event and trigger it', () => {
		const connectionCallback = vi.fn().mockResolvedValue(undefined)
		const mockClient = {
			getId: vi.fn().mockReturnValue(randomUUID().toString()),
		}

		adapter.createPeerServer(9090, '/peer')
		adapter.onConnection(connectionCallback)

		expect(mockPeerInstance.on).toHaveBeenCalledWith(
			'connection',
			expect.any(Function),
		)

		const connectionListener = mockPeerInstance.on.mock.calls.find(
			(call) => call[0] === 'connection',
		)?.[1]

		expect(connectionListener).toBeDefined()
		connectionListener(mockClient)

		expect(connectionCallback).toBeCalledTimes(1)
		expect(connectionCallback).toHaveBeenCalledWith(mockClient)
	})
})
