export const filterIt = <T = unknown>(
	arr: Array<T>,
	searchKey: string,
): Array<T> => {
	// @ts-expect-error
	return arr.filter((obj: { [x: string]: string | string[] }) =>
		Object.keys(obj).some((key) =>
			JSON.stringify(obj[key]).toLowerCase().includes(searchKey.toLowerCase()),
		),
	);
};

export const sortByKey = (arr: Array<unknown>, key: string) => {
	return arr.sort(dynamicSort(key));
};

function dynamicSort(property: string) {
	let sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substring(1);
	}
	return (a: unknown, b: unknown) => {
		/* next line works with strings and numbers,
		 * and you may want to customize it to your needs
		 */
		const result =
			// @ts-expect-error
			a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
		return result * sortOrder;
	};
}

export const convertUTCToIST = (dateString: string): string => {
	const date = new Date(dateString);
	const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
	const istDate = new Date(date.getTime() + istOffset);
	return istDate.toISOString().replace("T", " ").substring(0, 19);
};
