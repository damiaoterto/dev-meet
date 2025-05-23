import { type Server, createServer } from 'node:http'
import type { HttpAdapter, RouterHandler } from '@core/ports/http-adapter'
import type { HttpMethod } from '@core/shared/enums/http/http-methods'
import cors from 'cors'
import express, { type Application, type Request, type Response } from 'express'

export class ExpressAdapter implements HttpAdapter {
	public readonly app: Application
	private readonly server: Server

	constructor() {
		this.app = express()
		this.server = createServer(this.app)

		this.setupDefaultMiddlewares()
	}

	private setupDefaultMiddlewares() {
		this.app.use(cors())
	}

	registerRouter(
		method: HttpMethod,
		path: string,
		handler: RouterHandler<Request, Response>,
	): void {
		this.app[method](path, handler)
	}

	async listen(port: number): Promise<void> {
		this.server.listen(port)
	}

	close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.server.close((err) => {
				if (err) reject(err)
				resolve()
			})
		})
	}
}
