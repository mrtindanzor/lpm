export const arrangeObjectKeys = <T extends object>(
	data: T,
	sort: "asc" | "desc" = "asc",
) => {
	return Object.fromEntries(
		Object.entries(data).sort(([key], [bKey]) =>
			sort === "asc" ? key.localeCompare(bKey) : bKey.localeCompare(key),
		),
	)
}
