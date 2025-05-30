export type P2PConnectionCallback<T = unknown> = (client: T) => Promise<void>

export interface WebRTCAdapter<T = unknown> {
	createPeerServer(port: number, path: string): T
	onConnection(cb: P2PConnectionCallback): void
	onError(cb: P2PConnectionCallback<Error>): void
}
