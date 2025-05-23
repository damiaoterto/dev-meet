import { describe, expect, it } from 'vitest'
import { PATH_METADATA } from '../constants'
import { Controller } from './controller.decorator'
import { Get, Post } from './method.decorator'

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

describe('Controller Decorator', () => {
	it('should define base path metadata for the controller', () => {
		const controller = new TestController()
		const controllerConstructor = controller.constructor

		const basePath = Reflect.getMetadata(PATH_METADATA, controllerConstructor)

		expect(basePath).toBe('/api')
	})
})
