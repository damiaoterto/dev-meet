import 'reflect-metadata'
import { DevMeet } from '@bootstrap/dev-meet'
import { AppModule } from './app-module'

async function main() {
	const module = new AppModule()
	const app = DevMeet.createApp(module)

	app.enableGracefulShutdown()

	await app.listen()
}
main()
