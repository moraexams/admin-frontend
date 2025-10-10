import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBJECTS, isValidPart, isValidSubjectId } from "@/lib/utils";
import { LOCAL_STORAGE__USERNAME } from "@/services/authServices";
import {
	getStudentMarksData,
	nextStudentForMarksEntry,
	previousStudentForMarksEntry,
	verifyMark,
} from "@/services/markservices";
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

	const [indexNo, setIndexNo] = useState<string>(
		searchParams.get("index_no") || "",
	);

	const handleSubmit = async () => {
		if (subject === null || part === null) {
			toast.error("Please select subject and part");
			return;
		}

		Promise.allSettled([
			verifyMark(indexNo, subject, part),
			createTimer(500),
		]).then((results) => {
			toast.dismiss();
			if (results[0].status === "fulfilled") {
				toast.success("Marks verified successfully");
				setStudentDetails(results[0].value);
			} else {
				toast.error(
					results[0].reason.response.data.message || "Error verifying marks",
				);
			}
		});
	};

	useEffect(() => {
		if (
			subject === null ||
			part === null ||
			indexNo.length !== 7 ||
			!isValidSubjectId(subject) ||
			!isValidPart(part)
		) {
			return;
		}
		toast.loading("Loading...");

		Promise.allSettled([
			getStudentMarksData(indexNo, subject, part),
			createTimer(500),
		])
			.then((results) => {
				toast.dismiss();

				if (results[0].status === "fulfilled") {
					const studentMarks = results[0].value;
					if (studentMarks) {
						setStudentDetails(studentMarks);
					}
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

	if (
		!isValidSubjectId(subject) ||
		part === null ||
		!["p1", "p2"].includes(part)
	) {
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

			<section className="grid grid-cols-3 gap-x-5 gap-y-2 mt-5 mx-auto">
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

				<p className="text-muted-foreground max-w-prose col-span-full">
					After entering the index no, the student details and marks will be
					fetched automatically and shown below. Once you have verified the
					student details and their marks, press 'verify'.
				</p>

				<div className="col-span-2">
					<Label className="mb-1">Name</Label>
					<Input
						tabIndex={-1}
						type="text"
						readOnly
						className="cursor-not-allowed pointer-events-none !h-fit !text-lg"
						value={studentDetails === undefined ? "" : studentDetails.name}
					/>
				</div>

				<div className="col-start-1">
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

				<div className="col-start-3 row-start-3 row-span-2 h-full flex flex-col">
					<Label className="mb-2">Marks</Label>
					<Input
						readOnly
						tabIndex={-1}
						type="number"
						value={studentDetails?.marks ? studentDetails.marks : ""}
						step={0.01}
						className="w-48 !h-auto flex-1 !text-4xl pointer-events-none"
					/>
				</div>
				<div className="col-start-1 col-span-full flex gap-2 justify-between items-center">
					<p
						className="text-muted-foreground"
						dangerouslySetInnerHTML={{
							__html:
								studentDetails?.marks === null ||
								studentDetails?.entered_by === undefined
									? "Marks not entered yet."
									: studentDetails.entered_by === username
										? "You <b>cannot</b> verify your own entered marks."
										: studentDetails?.verified_by
											? `Marks already verified by ${studentDetails.verified_by}.`
											: `Marks entered by ${studentDetails?.entered_by}${studentDetails?.verified_by ? ` and verified by ${studentDetails.verified_by}` : ""}.`,
						}}
					/>
					<Link
						to={`/marks/enter?subject=${subject}&part=${part}&index_no=${indexNo}`}
						className="ml-auto mt-5"
						target="_blank"
					>
						<Button disabled={indexNo.length !== 7} variant="outline">
							Edit
						</Button>
					</Link>
					<Button
						onClick={handleSubmit}
						disabled={
							part === null ||
							subject === null ||
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
