export function toCapitalized(text: string) {
	return (text || "")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

export function syncTryCatch<T, E = Error>(
	callback: () => T,
): readonly [T, null] | readonly [null, E] {
	try {
		return [callback() as T, null] as const
	} catch (error) {
		return [null, error as E] as const
	}
}

export default async function tryCatch<T, E = Error>(
	promise: Promise<T>,
): Promise<readonly [T, null] | readonly [null, E]> {
	try {
		return [(await promise) as T, null] as const
	} catch (error) {
		return [null, error as E] as const
	}
}

export function printLines(total = 2) {
	console.log("")

	for (let i = 0; i < total; i++)
		console.log("-----------------------------------------")

	console.log("")
}
