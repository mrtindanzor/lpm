export default async function tryCatch<T, E = Error>(
	promise: Promise<T>,
): Promise<readonly [T, null] | readonly [null, E]> {
	try {
		return [(await promise) as T, null] as const
	} catch (error) {
		return [null, error as E] as const
	}
}
