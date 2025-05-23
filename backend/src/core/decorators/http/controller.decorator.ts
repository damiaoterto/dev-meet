import { PATH_METADATA } from '../constants'

export function Controller(path: string): ClassDecorator {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (target: any) => {
		Reflect.defineMetadata(PATH_METADATA, path, target)
	}
}
