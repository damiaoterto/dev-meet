import { Controller } from '@core/decorators/http/controller.decorator'
import { Get } from '@core/decorators/http/method.decorator'
import type { Request, Response } from 'express'

@Controller('rooms')
export class RoomController {
	@Get('/')
	async createRoom(req: Request, res: Response) {
		return res.json({ room: null })
	}
}
