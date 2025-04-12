import { useEffect, useState } from "react";
import { getAllMarksBoundaries } from "../services/markservices";

interface MarksBoundaries {
	subjectId: string;
	subjectName: string;
	forA: number;
	forB: number;
	forC: number;
	forS: number;
	forW: number;
}

export const MarksBoundariesView = () => {
	const [marksBoundaries, setMarksBoundaries] = useState<
		Array<MarksBoundaries>
	>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchMarksBoundaries = async () => {
			try {
				const d = await getAllMarksBoundaries();
				setMarksBoundaries(d.boundaries);
			} catch (error) {
				console.log(`Error fetching mark boundaries: ${error}`);
				throw error;
			} finally {
				setLoading(false);
			}
		};

		fetchMarksBoundaries();
	}, []);

	return (
		<section>
			<h2 className="text-title-md2 mt-5 mb-8 font-semibold text-black dark:text-white">
				Marks Boundaries
			</h2>

			{loading ? (
				<p>Loading...</p>
			) : (
				<table className="w-full table-auto">
					<thead>
						<tr className="bg-gray-2 dark:bg-meta-4 text-left">
							<th className="min-w-[120px] py-4 pl-4 font-medium text-black dark:text-white">
								Subject
							</th>
							<th className="min-w-[120px] py-4 font-medium text-black dark:text-white">
								For A
							</th>
							<th className="min-w-[120px] py-4 font-medium text-black dark:text-white">
								For B
							</th>
							<th className="min-w-[120px] py-4 font-medium text-black dark:text-white">
								For C
							</th>
							<th className="min-w-[120px] py-4 font-medium text-black dark:text-white">
								For S
							</th>
							<th className="min-w-[120px] py-4 font-medium text-black dark:text-white">
								For W
							</th>
						</tr>
					</thead>
					<tbody>
						{marksBoundaries.map((boundary) => (
							<tr key={boundary.subjectId}>
								<td className="py-5 px-4 text-left font-bold">
									{boundary.subjectName}
								</td>
								<td>{boundary.forA}</td>
								<td>{boundary.forB}</td>
								<td>{boundary.forC}</td>
								<td>{boundary.forS}</td>
								<td>{boundary.forW}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</section>
	);
};
