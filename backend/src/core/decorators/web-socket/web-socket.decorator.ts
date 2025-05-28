import { WEB_SOCKET_METADATA } from '../constants'

export function WebSocket(namespace?: string) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (target: any) => {
		Reflect.defineMetadata(WEB_SOCKET_METADATA, namespace, target)
	}
}
