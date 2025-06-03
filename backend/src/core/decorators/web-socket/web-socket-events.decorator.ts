import { WebSocketEvents } from '@core/shared/enums/web-socket/web-socket-events'
import { WS_CONNECTION_EVENT_METADATA, WS_EVENT_METADATA } from '../constants'

type EventMethod = {
	event: string
	callback: () => void | Promise<void>
}

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

export function OnEvent(event: string) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (target: any, propertyKey: string | symbol) => {
		Reflect.defineMetadata(WS_EVENT_METADATA, event, target, propertyKey)
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getMethodsName(prototype: any): string[] {
	return Object.getOwnPropertyNames(prototype).filter(
		(methodName) => methodName !== 'constructor',
	)
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getOnConnectionEventFn(cls: any) {
	const prototype = Object.getPrototypeOf(cls)
	const methodName = getMethodsName(prototype).find((methodName) => {
		const eventMetadata = Reflect.getMetadata(
			WS_CONNECTION_EVENT_METADATA,
			prototype,
			methodName,
		)

		return eventMetadata === WebSocketEvents.CONNECTION
	})

	if (!methodName || typeof cls[methodName] !== 'function') {
		return undefined
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getOnEventMethod(cls: any): EventMethod[] {
	const prototype = Object.getPrototypeOf(cls)
	const methodsName = getMethodsName(prototype)
	const methods: EventMethod[] = []

	for (const methodName of methodsName) {
		const event = Reflect.getMetadata(WS_EVENT_METADATA, prototype, methodName)
		if (!event || typeof cls[methodName] !== 'function') continue
		const callback = cls[methodName]

		methods.push({ event, callback })
	}

	return methods
}
