import { select, text } from "@clack/prompts"
import { isString, RetryAsync } from "./../common"
import { INIT_QUESTIONS } from "./../constants"
import { joinPaths } from "./../utils"

export const selectInitDestination = async (retries = 1) => {
	let selected: symbol | string

	const error = "Select installation destination!"
	const cb = () =>
		select({
			message: "Where should components be added by default?",
			options: INIT_QUESTIONS,
		})

	selected = await cb()

	if (!isString(selected))
		selected = await RetryAsync({
			cb: cb,
			error,
			retries,
		})

	if (isString(selected) && selected === "manual") {
		const cb = () =>
			text({
				message: "Enter destination...",
			})

		selected = await cb()

		if (!isString(selected))
			selected = await RetryAsync({
				cb: cb,
				error,
				retries,
			})
	}

	if (!isString(selected)) throw error

	return joinPaths("/", selected)
}
