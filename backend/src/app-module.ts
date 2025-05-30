import { RoomController } from '@application/controllers/room-controller'
import { RoomWsEvent } from '@application/events/room-event'
import type { GenericClass } from '@core/shared/types/generic-class.type'
import { injectable } from 'tsyringe'

@injectable()
export class AppModule {
	getAllControllers(): Array<GenericClass> {
		return [RoomController]
	}

	getAllEvents(): Array<GenericClass> {
		return [RoomWsEvent]
	}
}
