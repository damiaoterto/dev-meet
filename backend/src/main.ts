import 'reflect-metadata'
import { AppModule } from './app-module'
import { DevMeet } from './dev-meet'

async function main() {
	const module = new AppModule()
	const app = DevMeet.createApp(module)
	app.enableGracefulShutdown()
	await app.listen()
}
main()
