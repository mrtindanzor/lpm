export const shuffleArray = <T>(arr: T[]) => {
	const getRandomIndex = () => Math.floor(Math.random() * arr.length)

	let temp: T

	for (let i = 0; i < arr.length; i++) {
		const randomIndex = getRandomIndex()
		temp = arr[i]
		arr[i] = arr[randomIndex]
		arr[randomIndex] = temp
	}

	return arr
}
