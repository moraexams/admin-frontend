export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function snakeCaseToNormalCase(str: string): string {
	return str
		.split("_")
		.map((word) => capitalize(word))
		.join(" ");
}
