interface Props {
	headers: Array<string>;
	data?: Array<Array<string | number>>;
}

export default function Table(props: Props) {
	return (
		<table className="w-full table-auto">
			<thead>
				<tr className="bg-gray-2 dark:bg-meta-4">
					{props.headers.map((header) => (
						<th
							key={header}
							className="py-5 px-4 text-center font-medium text-black dark:text-white"
						>
							{header}
						</th>
					))}
				</tr>
			</thead>

			<tbody>
				{props.data?.map((row) => (
					<tr key={row.toString()}>
						{row.map((cell) => (
							<td
								key={cell.toString()}
								className="border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark"
							>
								{cell}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
