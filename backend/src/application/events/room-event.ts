import { OnConnection } from '@core/decorators/web-socket/web-socket-events.decorator'
import { WebSocket } from '@core/decorators/web-socket/web-socket.decorator'
import type { Socket } from 'socket.io'

@WebSocket()
export class RoomWsEvent {
	@OnConnection()
	onConnection(socket: Socket) {
		console.log('Connected client', socket.id)
	}
}
