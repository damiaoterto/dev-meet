import type { HttpMethod } from '@core/shared/enums/http/http-methods'

export type RouterHandler<Request = unknown, Response = unknown> = (
	req: Request,
	res: Response,
) => Promise<void>

export interface HttpAdapter {
	registerRouter(method: HttpMethod, path: string, handler: RouterHandler): void
	listen(port: number): Promise<void>
}
