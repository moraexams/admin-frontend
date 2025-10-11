import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	PATTERN__INDEX_NO,
	SUBJECTS,
	cn,
	isValidPart,
	isValidSubjectId,
} from "@/lib/utils";
import { LOCAL_STORAGE__USERNAME } from "@/services/authServices";
import {
	getStudentMarksData,
	nextStudentForMarksEntry,
	previousStudentForMarksEntry,
	verifyMark,
} from "@/services/markservices";
import { type MarksStats, getMarksStats } from "@/services/statsServices";
import { createTimer } from "@/services/utils";
import { AxiosError } from "axios";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

const VerifyMarks = () => {
	const [searchParams] = useSearchParams();
	const subject = searchParams.get("subject");
	const part = searchParams.get("part");
	const username = localStorage.getItem(LOCAL_STORAGE__USERNAME);

	const [studentDetails, setStudentDetails] = useState<
		| {
				name: string;
				nic: string;
				medium: string;
				marks: number | null;
				entered_by: string | null;
				verified_by: string | null;
		  }
		| undefined
	>(undefined);

	const [stats, setStats] = useState<MarksStats | null>(null);
	const [indexNo, setIndexNo] = useState<string>(
		searchParams.get("index_no") || "",
	);

	const handleSubmit = async () => {
		if (!isValidSubjectId(subject) || !isValidPart(part)) {
			toast.error("Please select subject and part");
			return;
		}
		toast.loading("Verifying...");
		Promise.allSettled([
			verifyMark(indexNo, subject, part),
			createTimer(),
		]).then((results) => {
			toast.dismiss();
			if (results[0].status === "fulfilled") {
				toast.success("Marks verified successfully");
				setStudentDetails(results[0].value);
				setStats({
					total_entered: results[0].value.total_entered,
					total_verified: results[0].value.total_verified,
				});
			} else {
				toast.error(
					results[0].reason.response.data.message || "Error verifying marks",
				);
			}
		});
	};

	useEffect(() => {
		setStudentDetails(undefined);
		if (
			PATTERN__INDEX_NO.test(indexNo) === false ||
			!isValidSubjectId(subject) ||
			!isValidPart(part)
		) {
			return;
		}
		toast.loading("Loading...");
		Promise.allSettled([
			getStudentMarksData(indexNo, subject, part),
			createTimer(),
		])
			.then((results) => {
				toast.dismiss();

				if (results[0].status === "fulfilled") {
					const studentMarks = results[0].value;
					setStudentDetails(studentMarks);
					setStats({
						total_entered: studentMarks.total_entered,
						total_verified: studentMarks.total_verified,
					});
				}
			})
			.catch((error) => {
				toast.dismiss();
				if (error instanceof AxiosError) {
					if (error.response?.status === 404) {
						toast.error("No marks found for this student");
						setStudentDetails(undefined);
					}
				} else {
					toast.error("Error fetching data");
					setStudentDetails(undefined);
				}
			});
	}, [indexNo, subject, part]);

	useEffect(() => {
		if (!isValidSubjectId(subject) || !isValidPart(part)) {
			return;
		}
		const subjectAsInt = Number.parseInt(subject || "");

		getMarksStats(subjectAsInt, part)
			.then((data) => {
				setStats(data);
			})
			.catch((error) => {
				console.error("Error fetching marks stats:", error);
			});
	}, []);

	if (!isValidSubjectId(subject) || !isValidPart(part)) {
		return (
			<>
				<Breadcrumb pageName="Enter Marks" />
				<Alert variant="destructive" className="text-base">
					<Info />
					<AlertTitle>Invalid Subject or Part. Please select again.</AlertTitle>
				</Alert>
			</>
		);
	}

	return (
		<>
			<Breadcrumb pageName="Verify Marks" />

			<Alert variant="default" className="text-base">
				<Info className="1lh" />
				<AlertTitle className="overflow-visible h-auto block">
					You are verifying marks for{" "}
					<b className="font-bold text-xl block">
						{SUBJECTS[subject]} {part === "p1" ? "Part 1" : "Part 2"}
					</b>
				</AlertTitle>
			</Alert>

			<section className="grid grid-cols-[auto_1fr_1fr_1fr] grid-rows-[repeat(5,auto)] gap-y-3 gap-x-5 mt-5 mx-auto">
				<div className="col-start-1 row-start-1 row-span-full flex flex-col gap-2 min-w-[220px]">
					<div className="bg-muted/40 h-full px-4 py-5 rounded-md flex flex-col items-center justify-center">
						<div className="text-6xl tabular-nums mb-2">
							{stats === null || stats.total_verified == 0
								? "0"
								: stats.total_verified.toString().padStart(2, "0")}
						</div>
						<span className="text-muted-foreground">Total Marks Verified</span>
					</div>
					<div className="bg-muted/40 h-full px-4 py-5 rounded-md flex flex-col items-center justify-center">
						<div className="text-6xl tabular-nums mt-5 mb-2">
							{stats === null || stats.total_entered - stats.total_verified == 0
								? "0"
								: (stats.total_entered - stats.total_verified)
										.toString()
										.padStart(2, "0")}
						</div>
						<span className="text-muted-foreground">Remaining to Verify</span>
					</div>
				</div>
				<div className="col-span-3">
					<Label className="mb-2">Index No</Label>
					<div className="flex gap-2 h-12">
						<Input
							type="text"
							value={indexNo}
							className="!h-12 !text-2xl"
							onChange={(e) => setIndexNo(e.target.value)}
							tabIndex={1}
						/>

						<Button
							variant="outline"
							className="h-full w-12"
							tabIndex={3}
							disabled={indexNo.length !== 7}
							onClick={() => {
								previousStudentForMarksEntry(indexNo, subject, part)
									.then((data) => {
										setIndexNo(data.index_no);
										setStudentDetails(data);
									})
									.catch((error) => {
										if (error instanceof AxiosError && error.response) {
											toast.error(
												error.response.data.message ||
													"Error fetching previous student",
											);
										} else {
											toast.error("Error fetching previous student");
										}
									});
							}}
						>
							<ChevronLeft className="size-5" />
						</Button>
						<Button
							variant="outline"
							className="h-full w-12 tabular-nums"
							tabIndex={4}
							disabled={indexNo.length !== 7}
							onClick={() => {
								nextStudentForMarksEntry(indexNo, subject, part)
									.then((data) => {
										setIndexNo(data.index_no);
										setStudentDetails(data);
									})
									.catch((error) => {
										if (error instanceof AxiosError && error.response) {
											toast.error(
												error.response.data.message ||
													"Error fetching previous student",
											);
										} else {
											toast.error("Error fetching previous student");
										}
									});
							}}
						>
							<ChevronRight className="size-5" />
						</Button>
					</div>
				</div>

				<p className="text-muted-foreground max-w-prose col-start-2 col-span-full">
					After entering the index no, the student details and marks will be
					fetched automatically and shown below. Once you have verified the
					student details and their marks, press 'verify'.
				</p>

				<div className="col-start-2 col-span-2">
					<Label className="mb-1">Name</Label>
					<Input
						tabIndex={-1}
						type="text"
						readOnly
						className="cursor-not-allowed pointer-events-none !h-fit !text-lg"
						value={studentDetails === undefined ? "" : studentDetails.name}
					/>
				</div>

				<div className="col-start-2">
					<Label className="mb-1">NIC</Label>
					<Input
						tabIndex={-1}
						type="text"
						readOnly
						className="cursor-not-allowed pointer-events-none !h-fit tabular-nums !text-lg"
						value={studentDetails === undefined ? "" : studentDetails.nic}
					/>
				</div>
				<div>
					<Label className="mb-1">Medium</Label>
					<Input
						tabIndex={-1}
						type="text"
						readOnly
						className="cursor-not-allowed pointer-events-none !h-fit !text-lg"
						value={studentDetails === undefined ? "" : studentDetails.medium}
					/>
				</div>

				<div className="col-start-4 row-start-3 row-span-2 h-full flex flex-col">
					<Label className="mb-2">Marks</Label>
					<Input
						readOnly
						tabIndex={-1}
						value={
							studentDetails === undefined || studentDetails.marks === null
								? ""
								: studentDetails.marks === -1
									? "AB"
									: studentDetails.marks
						}
						step={0.01}
						className="w-48 !h-auto flex-1 !text-4xl pointer-events-none"
					/>
				</div>
				<p
					className="text-muted-foreground col-start-2"
					dangerouslySetInnerHTML={{
						__html:
							studentDetails === undefined
								? ""
								: studentDetails?.marks === null ||
										studentDetails?.entered_by === undefined
									? "Marks not entered yet."
									: studentDetails.entered_by === username
										? "You <b>cannot</b> verify your own entered marks."
										: studentDetails?.verified_by
											? `Marks already verified by ${studentDetails.verified_by}.`
											: `Marks entered by ${studentDetails?.entered_by}${studentDetails?.verified_by ? ` and verified by ${studentDetails.verified_by}` : ""}.`,
					}}
				/>
				<div className="col-start-4 flex gap-2 justify-between items-center">
					<Link
						to={
							indexNo.length !== 7 || studentDetails === undefined
								? "#"
								: `/marks/enter?subject=${subject}&part=${part}&index_no=${indexNo}`
						}
						className={cn(
							"ml-auto mt-5",
							indexNo.length !== 7 || studentDetails === undefined
								? "pointer-events-none"
								: "",
						)}
						target="_blank"
					>
						<Button
							disabled={indexNo.length !== 7 || studentDetails === undefined}
							variant="outline"
						>
							Edit
						</Button>
					</Link>
					<Button
						onClick={handleSubmit}
						disabled={
							!isValidSubjectId(subject) ||
							!isValidPart(part) ||
							indexNo.length !== 7 ||
							studentDetails === undefined ||
							studentDetails.marks === null ||
							studentDetails.verified_by !== null ||
							username === studentDetails.entered_by
						}
						className="mt-5"
					>
						Verify
					</Button>
				</div>
			</section>
		</>
	);
};

export default VerifyMarks;
