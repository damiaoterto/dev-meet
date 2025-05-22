import { DevMeet } from './dev-meet'

async function main() {
	const app = DevMeet.createApp()
	app.enableGracefulShutdown()
	await app.listen()
}
main()
