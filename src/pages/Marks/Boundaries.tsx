import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	getAllMarksBoundaries,
	updateBoundaryValues,
} from "@/services/markservices";
import type { MarksBoundaries } from "@/types/types";
import { useEffect, useMemo, useState } from "react";

export default function MarksBoundaries() {
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
		<>
			<Breadcrumb pageName="Marks Boundaries" />
			<PageTitle title="Marks Boundaries | Mora Exams" />

			<section>
				<p className="mb-4 text-lg max-w-prose">
					The minimum required marks to achieve the specified result. These are
					set by the Organizing Committee after discussing with the teachers who
					were involved in the paper setting process.
				</p>

				{marksBoundaries != null ? (
					<>
						<Table className="w-full table-auto">
							<TableHeader>
								<TableRow className="text-left">
									<TableHead className="min-w-[120px] py-4 pl-4 font-medium">
										Subject
									</TableHead>
									<TableHead className="min-w-[120px] py-4 font-medium">
										For A
									</TableHead>
									<TableHead className="min-w-[120px] py-4 font-medium">
										For B
									</TableHead>
									<TableHead className="min-w-[120px] py-4 font-medium">
										For C
									</TableHead>
									<TableHead className="min-w-[120px] py-4 font-medium">
										For S
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{marksBoundaries.map((boundary) => (
									<TableRow key={boundary.subjectId}>
										<TableCell className="py-5 px-4 text-left font-bold">
											{boundary.subjectName}
										</TableCell>

										{Object.entries(boundary).map(([key, value]) =>
											!key.startsWith("for") ||
											boundary.subjectId === null ? null : (
												<TableCell
													key={boundary.subjectId.toString().concat(key)}
												>
													<Input
														type="number"
														className="w-fit min-w-25 max-w-30"
														value={value}
														onChange={updateBoundary.bind(
															null,
															boundary.subjectId,
															key,
														)}
													/>
												</TableCell>
											),
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>

						<Button
							type="button"
							onClick={syncBoundaryValues}
							disabled={!canUpdate}
							className="ml-auto block mt-5"
						>
							{loading ? "Loading..." : "Save Changes"}
						</Button>
					</>
				) : loading ? (
					<p>Loading...</p>
				) : (
					<p>{error}</p>
				)}
			</section>
		</>
	);
}
