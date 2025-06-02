import { getRouterInfo } from '@core/decorators/http/method.decorator'
import type { HttpAdapter } from '@core/ports/http-adapter'
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import type { AppModule } from '../app-module'
import { HttpModuleSetup } from './http-module.setup'

const mockAppModule = {
	getAllControllers: vi.fn().mockReturnValue([class MockController {}]),
	getAllEvents: vi.fn().mockReturnValue([class MockEvent {}]),
} as AppModule

const mockHttpAdapter = {
	registerRouter: vi.fn(),
	getHttpServer: vi.fn(),
	close: vi.fn(),
	listen: vi.fn().mockResolvedValue(undefined),
} as HttpAdapter

const mockControllerHandler = vi.fn()

vi.mock('@core/decorators/http/method.decorator', () => ({
	getRouterInfo: vi.fn(),
}))

describe('HttpModuleSetup', () => {
	let httpModuleSetup: HttpModuleSetup

	beforeEach(() => {
		httpModuleSetup = new HttpModuleSetup(mockAppModule, mockHttpAdapter)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should be defined', () => {
		expect(httpModuleSetup).toBeDefined()
	})

	it('should register all routes on http adapter', () => {
		;(getRouterInfo as Mock).mockReturnValue([
			{ path: '/', method: 'GET', handler: mockControllerHandler },
		])

		httpModuleSetup.execute()
		expect(getRouterInfo).toBeCalledTimes(1)
		expect(mockHttpAdapter.registerRouter).toBeCalledTimes(1)
	})
})
