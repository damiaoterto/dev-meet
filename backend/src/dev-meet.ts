import 'reflect-metadata'

import { exit } from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'
import { ProcessExit } from '@core/shared/enums/process-exit.enum'

type ListenPorts = {
	http?: number
	peer?: number
}

export class DevMeet {
	enableGracefulShutdown(timeout = 6000) {
		const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']

		for (const signal of signals) {
			process.on(signal, async () => {
				console.log(`Received signal ${signal}, init graceful shutdown`)

				const timer = setTimeout(() => {
					console.error('Time limit exceeded, forcing shutdown')
					exit(ProcessExit.ERROR)
				}, timeout)

				try {
					// TODO: implement services shutdown
					console.log('Shutdown completed successfully')
					exit(ProcessExit.SUCCESS)
				} catch (error) {
					console.log('Error on shutdown:', error)
					exit(ProcessExit.ERROR)
				} finally {
					clearTimeout(timer)
				}
			})
		}
	}

	async listen(ports?: ListenPorts): Promise<void> {
		const httpPort = ports?.http || 3000
		const peerPort = ports?.peer || 9000

		console.log(`Http service listen on port ${httpPort}`)
		console.log(`Peer service listen on port ${peerPort}`)

		// TODO: listen implementation
	}

	static createApp() {
		return new DevMeet()
		// TODO: implement
	}
}
