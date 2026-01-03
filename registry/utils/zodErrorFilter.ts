import { z } from "zod"

export const zodErrorFilter = <T>(data: z.ZodSafeParseResult<T>) => {
	if (!data.success) {
		const errors = z.flattenError(data.error).fieldErrors

		return (
			(Object.values(errors).flat().filter(Boolean)[0] as string) ||
			"Something went wrong"
		)
	}
}
