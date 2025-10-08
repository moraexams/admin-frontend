import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBJECTS, isValidPart, isValidSubjectId } from "@/lib/utils";
import { createTimer } from "@/services/utils";
import { AxiosError } from "axios";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { enterMark, getStudentMarksData } from "../../services/markservices";

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
		| {
				name: string;
				nic: string;
				medium: string;
				marks: number | null;
		  }
		| undefined
	>(undefined);
	const [mark, setMark] = useState<number | undefined>(undefined);

	const [submitDisabled, setSubmitDisabled] = useState(
		subject === null || part === null || indexNo.length != 7,
	);

	const handleSubmit = async () => {
		if (subject === null || part === null) {
			toast.error("Please select subject and part");
			return;
		}
		if (mark) {
			if (mark < 0 || mark > 100) {
				toast.error("Invalid Mark");
				return;
			}
		} else {
			if (mark !== 0) {
				toast.error("Invalid Mark");
				return;
			}
		}

		await enterMark(indexNo, subject, part, mark)
			.then(() => {
				toast.success("Mark Added Successfully");
				setMark(undefined);
			})
			.catch((error) => {
				toast.error(error);
			});
	};

	useEffect(() => {
		setStudentDetails(undefined);
		if (
			indexNo.length !== 7 ||
			!isValidSubjectId(subject) ||
			part === null ||
			!isValidPart(part)
		) {
			setSubmitDisabled(true);
			return;
		}

		toast.loading("Loading...");

		Promise.allSettled([
			getStudentMarksData(indexNo, subject, part),
			createTimer(500),
		])
			.then((d) => {
				toast.dismiss();
				if (d[0].status === "fulfilled") {
					const response = d[0].value;
					setStudentDetails(response);
					setSubmitDisabled(false);
					if (studentDetails?.marks != undefined) {
						setMark(studentDetails?.marks);
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
		if (!isValidSubjectId(subject)) {
			navigate("/marks");
			return;
		}
		if (part === null || !isValidPart(part)) {
			navigate("/marks");
			return;
		}
	}, [subject, part]);

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

			<section className="flex flex-col gap-2 mt-5 mx-auto">
				<div>
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

				<p className="text-muted-foreground max-w-prose">
					After entering the index no, the student details will be fetched
					automatically and shown below.
				</p>

				<div className="mt-5">
					<Label className="mb-1">Name</Label>
					<Input
						tabIndex={-1}
						type="text"
						readOnly
						className="cursor-not-allowed pointer-events-none !h-fit !text-lg"
						value={studentDetails === undefined ? "" : studentDetails.name}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3 mt-2">
					<div>
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
				</div>

				<p className="text-muted-foreground max-w-prose">
					Once you have verified the student details, enter the marks below.
				</p>

				<div className="flex gap-2 justify-between items-center">
					<div className="mt-5">
						<Label className="mb-2">Marks</Label>
						<Input
							tabIndex={2}
							type="number"
							value={mark}
							step={0.01}
							onChange={(e) => {
								if (e.target.value === "") {
									setMark(undefined);
								} else {
									setMark(Number.parseFloat(e.target.value));
								}
							}}
							className="w-48 !h-20 !text-5xl"
						/>
					</div>

					<Button
						onClick={handleSubmit}
						disabled={submitDisabled}
						className="mt-5 ml-auto"
					>
						Submit
					</Button>
				</div>
			</section>
		</>
	);
};

export default EnterMarks;
