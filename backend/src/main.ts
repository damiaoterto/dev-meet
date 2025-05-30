import 'reflect-metadata'
import { DevMeet } from '@bootstrap/dev-meet'
import { container } from 'tsyringe'

async function main() {
	const app = container.resolve(DevMeet)

	app.enableGracefulShutdown()

	await app.listen()
}
main()
