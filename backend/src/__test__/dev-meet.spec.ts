import { ProcessExit } from '@core/shared/enums/process-exit.enum'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { DevMeet } from '../dev-meet'

const mockLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockError = vi.spyOn(console, 'error').mockImplementation(() => {})

vi.mock('node:process', async () => {
	const originalProcess =
		await vi.importActual<typeof import('node:process')>('node:process')
	return {
		...originalProcess,
		exit: vi.fn().mockImplementation(() => {}),
	}
})

import { exit } from 'node:process'

describe('DevMeet Factory Class', () => {
	beforeAll(() => {
		mockLog.mockClear()
		mockError.mockClear()
		vi.mocked(exit).mockClear()
	})

	afterAll(() => {
		mockLog.mockRestore()
		mockError.mockRestore()
		vi.mocked(exit).mockClear()
	})

	describe('enableGracefulShutdown', () => {
		it('should handle SIGTERM and SIGINT signals correctly', async () => {
			const devMeet = new DevMeet()

			devMeet.enableGracefulShutdown(500)

			process.emit('SIGTERM' as NodeJS.Signals)

			expect(mockLog).toHaveBeenCalledWith(
				'Received signal SIGTERM, init graceful shutdown',
			)
			expect(mockLog).toHaveBeenCalledWith(
				'Received signal SIGTERM, init graceful shutdown',
			)
		})
	})

	describe('listen', () => {
		it('should use default ports if none are provided', async () => {
			const devMeet = new DevMeet()

			await devMeet.listen()

			expect(mockLog).toHaveBeenCalledWith('Http service listen on port 3000')
			expect(mockLog).toHaveBeenCalledWith('Peer service listen on port 9000')
		})

		it('should use custom ports if provided', async () => {
			const devMeet = new DevMeet()

			await devMeet.listen({ http: 4000, peer: 9090 })

			expect(mockLog).toHaveBeenCalledWith('Http service listen on port 4000')
			expect(mockLog).toHaveBeenCalledWith('Peer service listen on port 9090')
		})
	})

	describe('createApp', () => {
		it('should create an instance of DevMeet', () => {
			const app = DevMeet.createApp()
			expect(app).toBeDefined()
		})
	})
})
