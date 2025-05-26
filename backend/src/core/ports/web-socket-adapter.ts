// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type WsConnectionCallback<T = any> = (socket: T) => Promise<void>

export interface WebSocketAdapter {
	onConnection(cb: WsConnectionCallback): void
}
