import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	PATTERN__INDEX_NO,
	SUBJECTS,
	isValidPart,
	isValidSubjectId,
} from "@/lib/utils";
import {
	type SubjectPartMarksStats,
	getSubjectPartMarksStats,
} from "@/services/statsServices";
import { createTimer } from "@/services/utils";
import { AxiosError } from "axios";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import {
	type MarksEntryData,
	enterMark,
	getStudentMarksData,
	nextStudentForMarksEntry,
	previousStudentForMarksEntry,
} from "../../services/markservices";

const EnterMarks = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const subject = searchParams.get("subject");
	const part = searchParams.get("part");
	const indexNoParam = searchParams.get("index_no");

	const [indexNo, setIndexNo] = useState<string>(
		indexNoParam !== null ? indexNoParam : "",
	);
	const [studentDetails, setStudentDetails] = useState<
		MarksEntryData | undefined
	>(undefined);
	const [mark, setMark] = useState<number | undefined>(undefined);
	const [stats, setStats] = useState<SubjectPartMarksStats | null>(null);

	const handleSubmit = async () => {
		if (!isValidSubjectId(subject) || !isValidPart(part)) {
			toast.error("Please select subject and part");
			return;
		}

		if (mark === undefined) {
			toast.error("Please enter a marks");
			return;
		}

		if (mark !== -1 && (mark < 0 || mark > 100)) {
			toast.error("Marks must be between 0 and 100");
			return;
		}

		toast.loading("Submitting...");
		Promise.allSettled([
			enterMark(indexNo, subject, part, mark),
			createTimer(),
		]).then((data) => {
			toast.dismiss();
			if (data[0].status === "fulfilled") {
				toast.success("Marks entered successfully");
				setMark(undefined);
				setStudentDetails(data[0].value);
				setStats({
					total_entered: data[0].value.total_entered,
					total_verified: data[0].value.total_verified,
				});
				setMark(data[0].value.marks === null ? undefined : data[0].value.marks);
			} else {
				toast.error(
					data[0].reason.response?.data?.message || "Error submitting marks",
				);
			}
		});
	};

	useEffect(() => {
		setStudentDetails(undefined);
		setMark(undefined);
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
			.then((d) => {
				toast.dismiss();
				if (d[0].status === "fulfilled") {
					const response = d[0].value;
					setStats({
						total_entered: response.total_entered,
						total_verified: response.total_verified,
					});
					setStudentDetails(response);
					if (response.marks != undefined) {
						setMark(response.marks);
					}
				} else if (
					d[0].status === "rejected" &&
					d[0].reason instanceof AxiosError &&
					d[0].reason.response
				) {
					toast.error(
						d[0].reason.response.data.message ||
							"Error fetching student details",
					);
				}
			})
			.catch((e) => {
				console.log(e);
				toast.dismiss();
				toast.error("Error fetching student details");
			});
	}, [indexNo, subject, part]);

	useEffect(() => {
		if (!isValidSubjectId(subject) || !isValidPart(part)) {
			navigate("/marks");
			return;
		}
	}, [subject, part]);

	useEffect(() => {
		if (!isValidSubjectId(subject) || !isValidPart(part)) {
			return;
		}
		const subjectAsInt = Number.parseInt(subject);

		getSubjectPartMarksStats(subjectAsInt, part)
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
			<Breadcrumb pageName="Enter Marks" />

			<Alert variant="default" className="text-base">
				<Info className="1lh" />
				<AlertTitle className="overflow-visible h-auto block">
					You are entering marks for{" "}
					<b className="font-bold text-xl block">
						{SUBJECTS[subject]} {part === "p1" ? "Part 1" : "Part 2"}
					</b>
				</AlertTitle>
			</Alert>

			<section className="grid grid-cols-[auto_1fr_1fr_1fr] grid-rows-[repeat(5,auto)] gap-y-3 gap-x-5 mt-5 mx-auto">
				<div className="col-start-1 row-start-1 bg-muted/40 h-full px-4 py-5 row-span-full min-w-[220px] rounded-md flex flex-col items-center justify-center">
					<div className="text-6xl tabular-nums mb-2">
						{stats?.total_entered == 0
							? "0"
							: stats?.total_entered.toString().padStart(2, "0")}
					</div>
					<span className="text-muted-foreground">Total Marks Entered</span>
				</div>
				<div className="col-start-2 col-span-full">
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
										setMark(data.marks === null ? undefined : data.marks);
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
										setMark(data.marks === null ? undefined : data.marks);
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
					After entering the index no, the student details will be fetched
					automatically and shown below.
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

				<p className="text-muted-foreground max-w-prose col-start-2 col-span-2 text-pretty h-fit">
					{studentDetails === undefined
						? null
						: studentDetails.marks !== null
							? studentDetails.verified_by !== null
								? `Marks has already been entered (${studentDetails.marks === -1 ? "AB" : studentDetails.marks}) by ${studentDetails.entered_by} and verified by ${studentDetails.verified_by}.`
								: `Marks has already been entered (${studentDetails.marks === -1 ? "AB" : studentDetails.marks}) by ${studentDetails.entered_by}.`
							: "Make sure all the details above are correct and enter the marks."}
				</p>

				<div className="col-start-4 row-start-3 row-span-2 flex items-center gap-5">
					<div className="flex flex-col h-full">
						<Label className="mb-2">Marks</Label>
						<Input
							tabIndex={2}
							type={mark === -1 ? "text" : "number"}
							value={mark === undefined ? "" : mark == -1 ? "AB" : mark}
							disabled={
								!isValidSubjectId(subject) ||
								!isValidPart(part) ||
								studentDetails === undefined ||
								indexNo.length !== 7 ||
								mark === -1
							}
							step={0.01}
							onInput={(e) => {
								if (!(e.target instanceof HTMLInputElement)) {
									return;
								}
								if (Number.isNaN(e.target.valueAsNumber)) {
									e.target.value = "";
									setMark(undefined);
								}

								switch (e.target.value) {
									case "":
										setMark(undefined);
										break;
									default:
										setMark(Number.parseFloat(e.target.value));
								}
							}}
							className="w-48 !h-auto flex-1 !text-5xl"
						/>
					</div>
					<span>OR</span>
					<div className="inline-flex items-center gap-2 h-full">
						<Checkbox
							id="is-absent"
							className="!h-6 aspect-square w-auto disabled:pointer-events-none cursor-pointer"
							disabled={
								!isValidSubjectId(subject) ||
								!isValidPart(part) ||
								studentDetails === undefined ||
								indexNo.length !== 7 ||
								(mark !== undefined && mark !== -1)
							}
							checked={mark === -1}
							onCheckedChange={(v) => {
								if (v) {
									setMark(-1);
								} else {
									setMark(undefined);
								}
							}}
						/>
						<Label
							className="inline-block text-lg cursor-pointer"
							htmlFor="is-absent"
						>
							Absent
						</Label>
					</div>
				</div>
				<Button
					onClick={handleSubmit}
					disabled={
						subject === null ||
						part === null ||
						indexNo.length !== 7 ||
						studentDetails === undefined ||
						mark === undefined ||
						studentDetails.marks === mark
					}
					className="col-start-4 row-start-5 ml-auto"
				>
					Submit
				</Button>
			</section>
		</>
	);
};

export default EnterMarks;
