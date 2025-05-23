import { HttpMethod } from '@core/shared/enums/http/http-methods'
import { describe, expect, it } from 'vitest'
import { METHOD_METADATA, PATH_METADATA } from '../constants'
import { Controller } from './controller.decorator'
import { Get, Post, getRouterInfo } from './method.decorator'

@Controller('/api')
class TestController {
	@Get('/test-get')
	getMethod() {
		return 'GET response'
	}

	@Post('/test-post')
	postMethod() {
		return 'POST response'
	}
}

describe('Method Decorators', () => {
	describe('Decorators', () => {
		it('should define metadata for @Get', () => {
			const prototype = Object.getPrototypeOf(new TestController())
			const path = Reflect.getMetadata(PATH_METADATA, prototype, 'getMethod')
			const method = Reflect.getMetadata(
				METHOD_METADATA,
				prototype,
				'getMethod',
			)

			expect(path).toBe('/test-get')
			expect(method).toBe(HttpMethod.GET.toUpperCase())
		})

		it('should define metadata for @Post', () => {
			const prototype = Object.getPrototypeOf(new TestController())
			const path = Reflect.getMetadata(PATH_METADATA, prototype, 'postMethod')
			const method = Reflect.getMetadata(
				METHOD_METADATA,
				prototype,
				'postMethod',
			)

			expect(path).toBe('/test-post')
			expect(method).toBe(HttpMethod.POST.toUpperCase())
		})
	})

	describe('getRouterInfo', () => {
		it('should return router info with correct routes', () => {
			const controller = new TestController()
			const routes = getRouterInfo(controller)

			const [getRoute, postRoute] = routes

			expect(routes).toHaveLength(2)
			expect(getRoute.method).toBe(HttpMethod.GET.toUpperCase())
			expect(getRoute.path).toBe('/api/test-get')
			expect(getRoute.handler()).toBe('GET response')

			expect(postRoute.method).toBe(HttpMethod.POST.toUpperCase())
			expect(postRoute.path).toBe('/api/test-post')
			expect(postRoute.handler()).toBe('POST response')
		})
	})
})
