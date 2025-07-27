import { useEffect, useMemo, useState } from "react";
import {
	getAllMarksBoundaries,
	updateBoundaryValues,
} from "../services/markservices";
import type { MarksBoundaries } from "../types/types";

export const MarksBoundariesView = () => {
	const [marksBoundaries, setMarksBoundaries] =
		useState<Array<MarksBoundaries> | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMarksBoundaries = async () => {
			try {
				const d = await getAllMarksBoundaries();
				setMarksBoundaries(d.boundaries);
			} catch (error) {
				if (typeof error === "string") {
					setError(error);
					return;
				}
				setError(`Error fetching mark boundaries: ${error}`);
			} finally {
				setLoading(false);
			}
		};

		fetchMarksBoundaries();
	}, []);

	const updateBoundary = async (
		subjectId: string,
		field: string,
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!marksBoundaries) return;
		const value = event.target.valueAsNumber;
		console.log(value);
		const updatedBoundaries = marksBoundaries.map((boundary) =>
			boundary.subjectId === subjectId
				? { ...boundary, [field]: value }
				: boundary,
		);
		setMarksBoundaries(updatedBoundaries);
	};

	const areAllFieldsFilled = useMemo(() => {
		if (!marksBoundaries) return false;
		for (const boundary of marksBoundaries) {
			if (
				!boundary.subjectId ||
				!boundary.forA ||
				!boundary.forB ||
				!boundary.forC
			)
				return false;
		}
		return true;
	}, [marksBoundaries]);

	const canUpdate = useMemo(() => {
		return !loading && areAllFieldsFilled;
	}, [areAllFieldsFilled, loading]);

	const syncBoundaryValues = async () => {
		if (!canUpdate || !marksBoundaries) {
			return;
		}
		setLoading(true);
		try {
			await updateBoundaryValues(marksBoundaries);
		} catch (error) {
			console.log(`Error syncing mark boundaries: ${error}`);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return (
		<section>
			<h2 className="text-title-md2 mt-5 mb-4 font-semibold text-black dark:text-white">
				Marks Boundaries
			</h2>
			<p className="mb-4 text-lg max-w-prose">
				The minimum required marks to achieve the specified result. These are
				set by the Organizing Committee after discussing with the teachers who
				were involved in the paper setting process.
			</p>

			{marksBoundaries != null ? (
				<>
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
							</tr>
						</thead>
						<tbody>
							{marksBoundaries.map((boundary) => (
								<tr key={boundary.subjectId}>
									<td className="py-5 px-4 text-left font-bold">
										{boundary.subjectName}
									</td>
									<td>
										<input
											type="number"
											className="border border-gray-300 rounded-sm px-2 py-1 bg-transparent w-[50%] min-w-25 max-w-30"
											value={boundary.forA}
											onChange={updateBoundary.bind(
												null,
												boundary.subjectId,
												"forA",
											)}
										/>
									</td>
									<td>
										<input
											type="number"
											className="border border-gray-300 rounded-sm px-2 py-1 bg-transparent w-[50%] min-w-25 max-w-30"
											value={boundary.forB}
											onChange={updateBoundary.bind(
												null,
												boundary.subjectId,
												"forB",
											)}
										/>
									</td>
									<td>
										<input
											type="number"
											className="border border-gray-300 rounded-sm px-2 py-1 bg-transparent w-[50%] min-w-25 max-w-30"
											value={boundary.forC}
											onChange={updateBoundary.bind(
												null,
												boundary.subjectId,
												"forC",
											)}
										/>
									</td>
									<td>
										<input
											type="number"
											className="border border-gray-300 rounded-sm px-2 py-1 bg-transparent w-[50%] min-w-25 max-w-30"
											value={boundary.forS}
											onChange={updateBoundary.bind(
												null,
												boundary.subjectId,
												"forS",
											)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<button
						className="block w-fit ml-auto mt-5 rounded-sm border border-primary bg-primary hover:bg-primary/90 py-2 px-3 text-center font-medium text-white transition disabled:opacity-50"
						type="button"
						onClick={syncBoundaryValues}
						disabled={!canUpdate}
					>
						{loading
							? "Loading..."
							: areAllFieldsFilled
								? "Save Changes"
								: "Fill all the fields"}
					</button>
				</>
			) : loading ? (
				<p>Loading...</p>
			) : (
				<p>{error}</p>
			)}
		</section>
	);
};
