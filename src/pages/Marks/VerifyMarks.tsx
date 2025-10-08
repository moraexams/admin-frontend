import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBJECTS, isValidSubjectId } from "@/lib/utils";
import {
	getStudentVerificationMarksData,
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

	const [studentDetails, setStudentDetails] = useState<
		| {
				name: string;
				nic: string;
				medium: string;
				marks: number;
		  }
		| undefined
	>(undefined);

	const [indexNo, setIndexNo] = useState<string>(
		searchParams.get("index_no") || "",
	);
	const [studentMarks, setStudentMarks] = useState<any>({});

	const [submitDisabled, setSubmitDisabled] = useState(true);

	const handleSubmit = async () => {
		if (subject === null || part === null) {
			toast.error("Please select subject and part");
			return;
		}
		
		Promise.allSettled([
			verifyMark(indexNo, subject, part)
		])
			.then((results) => {
				toast.dismiss();
				if (results[0].status === "fulfilled") {
					toast.success("Mark Added Successfully");
				} else {
					toast.error("Error verifying mark");
				}
			})
			.catch((error) => {
				toast.error(error);
			});
	};

	useEffect(() => {
		setSubmitDisabled(true);
		if (subject === null || part === null) {
			setStudentMarks({});
			return;
		}
		toast.loading("Loading...");

		Promise.allSettled([
			getStudentVerificationMarksData(indexNo, subject, part),
			createTimer(500),
		])
			.then((results) => {
				toast.dismiss();

				if (results[0].status === "fulfilled") {
					const studentMarks = results[0].value;
					if (studentMarks) {
						setStudentMarks(studentMarks);
						if (studentMarks.entered_by && !studentMarks.verified_by) {
							setSubmitDisabled(false);
						}
					} else {
						setStudentMarks({});
					}
				}
			})
			.catch((error) => {
				toast.dismiss();
				if (error instanceof AxiosError) {
					if (error.response?.status === 404) {
						toast.error("No marks found for this student");
						setStudentMarks({});
						setStudentDetails(undefined);
					}
				} else {
					toast.error("Error fetching data");
					setStudentMarks({});
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
								setIndexNo((Number.parseInt(indexNo) - 1).toString());
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
								setIndexNo((Number.parseInt(indexNo) + 1).toString());
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
						value={studentDetails === undefined ? "" : studentDetails.marks}
						step={0.01}
						className="w-48 !h-auto flex-1 !text-4xl"
					/>
				</div>
				<div className="col-start-3 flex gap-2 justify-between items-center">
					<Link
						to={`/marks/enter?subject=${subject}&part=${part}&index_no=${indexNo}`}
						className="ml-auto mt-5"
					>
						<Button
							disabled={indexNo.length !== 7 || studentMarks.verified_by !== undefined}
							variant="outline"
						>
							Edit
						</Button>
					</Link>
					<Button
						onClick={handleSubmit}
						disabled={submitDisabled}
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
