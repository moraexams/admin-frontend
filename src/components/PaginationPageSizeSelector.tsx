interface Props {
	id: string;
	value: number;
	onChange?: (size: number) => void;
}

export default function PaginationPageSizeSelector(props: Props) {
	const id = `paginated-page-size-selector-${props.id}`;

	return (
		<select
			className="cursor-pointer rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
			name={id}
			id={id}
			value={props.value}
			onChange={(e) => {
				props.onChange?.(Number.parseInt(e.target.value));
			}}
		>
			<option value="5">5</option>
			<option value="10">10</option>
			<option value="100">100</option>
			<option value="500">500</option>
		</select>
	);
}
