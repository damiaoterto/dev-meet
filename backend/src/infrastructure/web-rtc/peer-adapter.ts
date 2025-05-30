import type {
	P2PConnectionCallback,
	WebRTCAdapter,
} from '@core/ports/web-rtc-adapter'
import { type IClient, PeerServer, type PeerServerEvents } from 'peer'

export class PeerAdapter implements WebRTCAdapter {
	private readonly peer: PeerServerEvents

	constructor(port: number, path: string) {
		this.peer = PeerServer({ port, path, allow_discovery: true })
	}

	onError(cb: P2PConnectionCallback<Error>): void {
		this.peer.on('error', (error) => {
			cb(error)
		})
	}

	onConnection(cb: P2PConnectionCallback<IClient>): void {
		this.peer.on('connection', async (client: IClient) => {
			await cb(client)
		})
	}
}
