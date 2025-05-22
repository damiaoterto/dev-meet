import 'reflect-metadata'

import { exit } from 'node:process'
import { ProcessExit } from '@core/shared/enums/process-exit.enum'

type ListenPorts = {
	http?: number
	peer?: number
}

export class DevMeet {
	enableGracefulShutdown() {
		const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']

		for (const signal of signals) {
			process.on(signal, () => {
				console.log(`Received signal ${signal}`)
				exit(ProcessExit.SUCCESS)
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
