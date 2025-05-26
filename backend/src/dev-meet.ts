import 'reflect-metadata'

import { exit } from 'node:process'
import type { HttpAdapter } from '@core/ports/http-adapter'
import { ProcessExit } from '@core/shared/enums/process-exit.enum'
import { ExpressAdapter } from './adapters/http/express-adapter'

type ListenPorts = {
	http?: number
	peer?: number
}

interface DevMeetOptions {
	adapter?: HttpAdapter
}

export class DevMeet {
	private readonly httpAdapter: HttpAdapter

	constructor(options?: DevMeetOptions) {
		this.httpAdapter = !options?.adapter
			? new ExpressAdapter()
			: options?.adapter
	}

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
					await this.httpAdapter.close()
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

		await this.httpAdapter.listen(httpPort)
	}

	static createApp() {
		return new DevMeet()
		// TODO: implement
	}
}
