import {
	ROLE_EXAM_COORDINATOR,
	ROLE_PRESIDENT,
	ROLE_TECH_COORDINATOR,
} from "@/common/roles";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { OverallMarksStatsCard } from "@/components/overall-marks-stats";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type OverallMarksStats,
	downloadMarksStatsInPercentagesForSubject,
	getOverallMarksStats,
} from "@/services/statsServices";
import { CopyCheck, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const SUBJECTS = [
	{
		id: 4,
		name: "Combined Maths",
	},
	{
		id: 3,
		name: "Bio",
	},
	{
		id: 1,
		name: "Physics",
	},
	{
		id: 2,
		name: "Chemistry",
	},
	{
		id: 5,
		name: "ICT",
	},
];
const PARTS = new Array(2).fill("0");

const PERMISSION_FOR_STATS = [
	ROLE_TECH_COORDINATOR,
	ROLE_EXAM_COORDINATOR,
	ROLE_PRESIDENT,
];

export default function MarksDashboard() {
	const role = localStorage.getItem("role");
	const [overallStats, setOverallStats] = useState<null | OverallMarksStats>(
		null,
	);
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

	useEffect(() => {
		if (typeof role !== "string" || !PERMISSION_FOR_STATS.includes(role)) {
			return;
		}

		getOverallMarksStats()
			.then((stats) => {
				setOverallStats(stats);
			})
			.then()
			.catch(console.error);
	}, []);

	return (
		<>
			<Breadcrumb pageName="Marks" />
			<h2 className="text-xl font-bold mb-5">Enter/Verify Marks</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Subject</TableHead>
						<TableHead className="text-center">Part 1</TableHead>
						<TableHead className="text-center">Part 2</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{SUBJECTS.map((subject) => {
						return (
							<TableRow key={subject.id}>
								<TableCell className="font-medium">{subject.name}</TableCell>

								{PARTS.map((_, index) => {
									return (
										<TableCell key={index.toString()}>
											<div className="flex items-center justify-center space-x-3.5">
												<Link
													to={`/marks/enter?subject=${subject.id}&part=p${index + 1}`}
												>
													<Button variant="secondary">
														<Pen />
														<span className="font-semibold">Enter</span>
													</Button>
												</Link>
												<Link
													to={`/marks/verify?subject=${subject.id}&part=p${index + 1}`}
												>
													<Button variant="secondary">
														<CopyCheck />
														<span className="font-semibold">Verify</span>
													</Button>
												</Link>
											</div>
										</TableCell>
									);
								})}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			<div className="my-4">
				{PERMISSION_FOR_STATS.includes(
					localStorage.getItem("role") as string,
				) ? (
					overallStats === null ? (
						"Loading..."
					) : (
						<>
							<section className="grid grid-cols-1 grid-rows-[auto_auto_auto] xl:grid-cols-[1fr_auto] xl:grid-rows-[auto_auto] my-6">
								<h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
									Download Marks Stats in Percentages
								</h2>
								<p className="text-lg max-w-prose col-start-1">
									You can download a CSV file containing a table of marks, and
									number of students who scores above that mark in percentages
									for each subject.
								</p>
								<Select
									onValueChange={(value) => setSelectedSubject(value)}
									value={
										selectedSubject === null
											? undefined
											: selectedSubject.toString()
									}
								>
									<SelectTrigger className="w-[180px] mt-2 mb-6 cursor-pointer">
										<SelectValue placeholder="Select Subject" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="4">Combined Mathematics</SelectItem>
										<SelectItem value="3">Biology</SelectItem>
										<SelectItem value="1">Physics</SelectItem>
										<SelectItem value="2">Chemistry</SelectItem>
										<SelectItem value="5">ICT</SelectItem>
									</SelectContent>
								</Select>

								<Button
									className="xl:col-start-2 xl:row-span-2 xl:row-start-1 font-medium"
									size="lg"
									disabled={selectedSubject === null}
									onClick={async () => {
										if (selectedSubject === null) {
											toast.error("Please select a subject");
											return;
										}
										try {
											toast.loading("Downloading...");
											await downloadMarksStatsInPercentagesForSubject(
												selectedSubject,
											).then(() => {
												toast.dismiss();
												toast.success("Downloaded!");
											});
										} catch (error) {
											toast.error(
												typeof error === "string"
													? error
													: "Failed to download the file",
											);
										}
									}}
								>
									Download
								</Button>
							</section>
							<OverallMarksStatsCard stats={overallStats} />
						</>
					)
				) : null}
			</div>
		</>
	);
}
