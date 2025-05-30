import type {
	P2PConnectionCallback,
	WebRTCAdapter,
} from '@core/ports/web-rtc-adapter'
import { type IClient, PeerServer, type PeerServerEvents } from 'peer'
import { injectable } from 'tsyringe'

@injectable()
export class PeerAdapter implements WebRTCAdapter<PeerServerEvents> {
	private peer: PeerServerEvents

	createPeerServer(port: number, path: string): PeerServerEvents {
		this.peer = PeerServer({ port, path })
		return this.peer
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
