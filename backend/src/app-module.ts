import type { GenericClass } from '@core/shared/types/generic-class.type'
import { RoomController } from './controllers/room-controller'
import { RoomWsEvent } from './events/room-event'

export class AppModule {
	getAllControllers(): Array<GenericClass> {
		return [RoomController]
	}

	getAllEvents(): Array<GenericClass> {
		return [RoomWsEvent]
	}
}
