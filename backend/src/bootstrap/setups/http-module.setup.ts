import { getRouterInfo } from '@core/decorators/http/method.decorator'
import type { HttpAdapter } from '@core/ports/http-adapter'
import type { HttpMethod } from '@core/shared/enums/http/http-methods'
import { inject, injectable } from 'tsyringe'
import type { AppModule } from '../../app-module'

@injectable()
export class HttpModuleSetup {
	constructor(
		@inject('AppModule') private readonly appModule: AppModule,
		@inject('HttpAdapter') private readonly httpAdapter: HttpAdapter,
	) {}

	execute(): void {
		const controllers = this.appModule.getAllControllers()

		for (const controller of controllers) {
			const instance = new controller()
			const routes = getRouterInfo(instance)

			for (const { path, method, handler } of routes) {
				this.httpAdapter.registerRouter(method as HttpMethod, path, handler)
			}
		}
	}
}
