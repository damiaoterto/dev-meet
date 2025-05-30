import { Server } from 'node:http'
import { HttpMethod } from '@core/shared/enums/http/http-methods'
import type { Request, Response } from 'express'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ExpressAdapter } from './express-adapter'

const createTestServer = () => new ExpressAdapter()

describe('ExpressAdapter', () => {
	let adapter: ExpressAdapter

	beforeEach(async () => {
		adapter = createTestServer()

		const handler = async (req: Request, res: Response) => {
			res.status(200).send('pong')
		}

		adapter.registerRouter(HttpMethod.GET, '/ping', handler)
		adapter.listen(9000)
	})

	afterEach(async () => {
		await adapter.close()
	})

	it('should be defined', () => {
		expect(adapter).toBeDefined()
	})

	it('should start the server and handle requests on the specified port', async () => {
		const response = await fetch('http://localhost:9000/ping', {
			method: 'GET',
		})
		const responseText = await response.text()

		expect(response.status).toBe(200)
		expect(responseText).toBe('pong')
	})

	it('should return error if server is not running', async () => {
		const app = createTestServer()

		await app.listen(5000)
		await app.close()

		try {
			await app.close()
		} catch (error) {
			expect(error).instanceOf(Error)
			expect((error as Error).message).toBe('Server is not running.')
		}
	})

	it('should return node:http Server instance', () => {
		expect(adapter.getHttpServer()).toBeDefined()
		expect(adapter.getHttpServer()).toBeInstanceOf(Server)
	})
})
