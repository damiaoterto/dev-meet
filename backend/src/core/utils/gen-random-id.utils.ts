import { randomBytes } from 'node:crypto'

export function generateClientId(length = 32) {
	const buffer = randomBytes(length)
	return buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
}
