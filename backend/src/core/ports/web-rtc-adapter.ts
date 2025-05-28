type P2PConnectionCallback<T = unknown> = (socket: T) => Promise<void>

export interface WebRTCAdapter {
	onConnection(cb: P2PConnectionCallback): Promise<void>
}
