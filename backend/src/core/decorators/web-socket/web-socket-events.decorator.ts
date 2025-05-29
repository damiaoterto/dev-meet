import { WebSocketEvents } from '@core/shared/enums/web-socket/web-socket-events'
import { WS_CONNECTION_EVENT_METADATA } from '../constants'

export function OnConnection() {
	const event = WebSocketEvents.CONNECTION
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (target: any, propertyKey: string | symbol) => {
		Reflect.defineMetadata(
			WS_CONNECTION_EVENT_METADATA,
			event,
			target,
			propertyKey,
		)
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getOnConnectionEventFn(cls: any) {
	const prototype = Object.getPrototypeOf(cls)
	const [methodName] = Object.getOwnPropertyNames(prototype).filter(
		(methodName) => methodName !== 'constructor',
	)

	if (typeof cls[methodName] !== 'function') {
		throw new Error(`${methodName} is not a function}`)
	}

	const eventMetadata = Reflect.getMetadata(
		WS_CONNECTION_EVENT_METADATA,
		prototype,
		methodName,
	)

	if (eventMetadata && eventMetadata === WebSocketEvents.CONNECTION) {
		const methodFn = cls[methodName]
		if (typeof methodFn === 'function') return methodFn
	}
}
