import { HttpMethod } from '@core/shared/enums/http/http-methods'
import { METHOD_METADATA, PATH_METADATA } from '../constants'

export interface Route {
	method: string
	path: string
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	handler: Function
}

export function Get(path: string): MethodDecorator {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (target: any, propertyKey: string | symbol) => {
		const method = HttpMethod.GET.toUpperCase()

		Reflect.defineMetadata(PATH_METADATA, path, target, propertyKey)
		Reflect.defineMetadata(METHOD_METADATA, method, target, propertyKey)
	}
}

export function Post(path: string): MethodDecorator {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (target: any, propertyKey: string | symbol) => {
		const method = HttpMethod.POST.toUpperCase()

		Reflect.defineMetadata(PATH_METADATA, path, target, propertyKey)
		Reflect.defineMetadata(METHOD_METADATA, method, target, propertyKey)
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getRouterInfo(controller: any): Route[] {
	const prototype = Object.getPrototypeOf(controller)
	const routes: Route[] = []

	for (const methodName of Object.getOwnPropertyNames(prototype)) {
		if (methodName === 'constructor') continue

		const basePath = Reflect.getMetadata(PATH_METADATA, controller.constructor)
		const methodPath = Reflect.getMetadata(PATH_METADATA, prototype, methodName)

		const methodType = Reflect.getMetadata(
			METHOD_METADATA,
			prototype,
			methodName,
		)

		if (methodPath && methodType) {
			routes.push({
				method: methodType,
				path: `/${basePath}${methodPath}`.replace(/\/+/g, '/'),
				handler: prototype[methodName],
			})
		}
	}

	return routes
}
