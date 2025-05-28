import type {
	P2PConnectionCallback,
	WebRTCAdapter,
} from '@core/ports/web-rtc-adapter'
import { type IClient, PeerServer, type PeerServerEvents } from 'peer'

export class PeerAdapter implements WebRTCAdapter {
	private readonly peer: PeerServerEvents

	constructor() {
		this.peer = PeerServer({ port: 9000, path: '/peer' })
	}

	async onConnection(cb: P2PConnectionCallback<IClient>): Promise<void> {
		this.peer.on('connection', async (client: IClient) => {
			await cb(client)
		})
	}
}
