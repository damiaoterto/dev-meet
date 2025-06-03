import { describe, expect, it } from 'vitest'
import {
	OnConnection,
	OnEvent,
	getOnConnectionEventFn,
	getOnEventMethod,
} from './web-socket-events.decorator'
import { WebSocket } from './web-socket.decorator'

enum MockWebSocketEvents {
	JOIN_ROOM = 'custom-join-event',
	LEAVE_ROOM = 'custom-leave-event',
}

@WebSocket()
class MockEvent {
	@OnEvent(MockWebSocketEvents.JOIN_ROOM)
	async joinRoom() {}

	@OnEvent(MockWebSocketEvents.LEAVE_ROOM)
	async leaveRoom() {}

	@OnConnection()
	onConnection() {}

	otherMethod() {}
}

@WebSocket()
class MockEmptyEvent {}

describe('WebSocket Decorators', () => {
	describe('OnConnection Decorator', () => {
		it('should get on connection method by decorated class', () => {
			const eventCls = new MockEvent()
			const method = getOnConnectionEventFn(eventCls)

			expect(method).toBeDefined()
		})

		it('should return undefined if not exists on connection method', () => {
			const eventCls = new MockEmptyEvent()
			const method = getOnConnectionEventFn(eventCls)

			expect(method).toBeUndefined()
		})
	})

	describe('OnEvent Decorator', () => {
		it('should return empty array if not method decorate', () => {
			const eventCls = new MockEmptyEvent()
			const methods = getOnEventMethod(eventCls)

			expect(methods).toBeInstanceOf(Array)
			expect(methods).toHaveLength(0)
		})

		it('should get all decorated methods and ignore non-decorated ones', () => {
			const eventCls = new MockEvent()
			const methods = getOnEventMethod(eventCls)

			expect(methods).toHaveLength(2)
			expect(methods).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						event: MockWebSocketEvents.JOIN_ROOM,
					}),
					expect.objectContaining({
						event: MockWebSocketEvents.LEAVE_ROOM,
					}),
				]),
			)
		})
	})
})
