interface Props {
	headers: Array<string>;
	data?: Array<Array<string | number>>;
}

export default function Table(props: Props) {
	return (
		<table className="w-full table-auto">
			<thead>
				<tr className="bg-gray-2 text-left dark:bg-meta-4">
					{props.headers.map((header, index) => (
						<th
							key={index}
							className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
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
								className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
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
