import { type Server, createServer } from 'node:http'
import type { HttpAdapter, RouterHandler } from '@core/ports/http-adapter'
import type { HttpMethod } from '@core/shared/enums/http/http-methods'
import { json } from 'body-parser'
import cors from 'cors'
import express, { type Application, type Request, type Response } from 'express'
import helmet from 'helmet'
import { injectable } from 'tsyringe'

@injectable()
export class ExpressAdapter implements HttpAdapter {
	public readonly app: Application
	public readonly server: Server

	constructor() {
		this.app = express()
		this.server = createServer(this.app)

		this.setupDefaultMiddlewares()
	}

	getHttpServer(): Server {
		return this.server
	}

	private setupDefaultMiddlewares() {
		this.app.use(cors())
		this.app.use(json())
		this.app.use(helmet())
	}

	registerRouter(
		method: HttpMethod,
		path: string,
		handler: RouterHandler<Request, Response>,
	): void {
		const validMethods = [
			'get',
			'post',
			'put',
			'delete',
			'patch',
			'options',
			'head',
		] as const

		const httpMethod = method.toLowerCase()

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		if (!validMethods.includes(httpMethod as any)) {
			throw new Error(`Método HTTP inválido: ${method}`)
		}

		this.app[httpMethod as keyof typeof this.app](path, handler)
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
