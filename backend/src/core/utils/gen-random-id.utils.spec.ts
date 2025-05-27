import { describe, expect, it } from 'vitest'
import { generateClientId } from './gen-random-id.utils'

describe('generateClientId', () => {
	it('should generate random token with default length', () => {
		const token = generateClientId()
		expect(typeof token === 'string').toBeTruthy()
	})

	it('should generate random token with custom length', () => {
		const token = generateClientId(54)
		expect(typeof token === 'string').toBeTruthy()
	})
})
