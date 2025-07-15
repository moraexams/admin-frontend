import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import Snackbar from "../../components/Snackbar";
import DefaultLayout from "../../layout/DefaultLayout";
import {
	getStudentVerificationMarksData,
	verifyMark,
} from "../../services/markservices";
import { convertUTCToIST } from "../../services/utils";
import toast from "react-hot-toast"
// import type { SnackBarConfig } from "../../types/snackbar";

const VerifyMarks = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	// Default values
	const defaultSubject = "s1";
	const defaultPart = "p1";

	// Set state for subject and part
	const [selectDisabled, setSelectDisabled] = useState(true);
	const subjects = ["s1", "s2", "s3"];
	const parts = ["p1", "p2"];

	const [subject, setSubject] = useState(
		searchParams.get("subject") || defaultSubject,
	);
	const [part, setPart] = useState(searchParams.get("part") || defaultPart);

	const [indexNo, setIndexNo] = useState<number>(
		Number(searchParams.get("index_no")) || 0,
	);
	const [studentMarks, setStudentMarks] = useState<any>({});
	const [loading, setLoading] = useState<boolean>(false);

	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [refresh, setRefresh] = useState(false);

	// Update URL query params when component mounts or when subject/part state changes
	useEffect(() => {
		if (!searchParams.get("subject") || !searchParams.get("part")) {
			// Update URL if the query parameters are not present
			setSearchParams({ subject, part });
		}
		if (!subjects.includes(subject) || !parts.includes(part)) {
			// Update URL if the query parameters are invalid
			setSearchParams({ subject: defaultSubject, part: defaultPart });
			setSubject(defaultSubject);
			setPart(defaultPart);
		}
	}, [subject, part, searchParams, setSearchParams]);

	// Handle changes in the subject select
	const handleSubjectChange = (event: { target: { value: any } }) => {
		const newSubject = event.target.value;
		setSubject(newSubject);
		setSearchParams({ subject: newSubject, part });
	};

	// Handle changes in the part select
	const handlePartChange = (event: { target: { value: any } }) => {
		const newPart = event.target.value;
		setPart(newPart);
		setSearchParams({ subject, part: newPart });
	};

	const handleSubmit = async () => {
		// if (indexNo < 110000 || indexNo > 360000) {
		// 	toast.error("Invalid Index No");
		// 	// showSnackBar(false, "Invalid Index No");
		// 	return;
		// }

		// Call the API to add the mark
		await verifyMark(indexNo, subject, part)
			.then(() => {
				toast.error("Mark Added Successfully");
				// showSnackBar(true, "Mark Added Successfully");
				setRefresh(!refresh);
			})
			.catch((error) => {
				toast.error(error)
				// showSnackBar(false, error);
			});
	};

	useEffect(() => {
		setLoading(true);
		setSubmitDisabled(true);
		setSearchParams({ subject, part, index_no: String(indexNo) });
		const fetchData = async () => {
			// if (indexNo < 110000 || indexNo > 360000) {
			// 	setLoading(false);
			// 	setStudentMarks({});
			// 	return;
			// }
			const studentMarks = await getStudentVerificationMarksData(
				indexNo,
				subject,
				part,
			);
			if (studentMarks) {
				setStudentMarks(studentMarks);
				if (studentMarks.entered_by && !studentMarks.verified_by) {
					setSubmitDisabled(false);
				}
			} else {
				setStudentMarks({});
			}
			setLoading(false);
		};

		fetchData();
	}, [indexNo, subject, part, refresh]);

	// const [snackBarConfig, setSnackBarConfig] = useState<SnackBarConfig>({
	// 	message: "",
	// 	type: false,
	// 	show: false,
	// });

	// const showSnackBar = (type: boolean, message: string) => {
	// 	setSnackBarConfig({ message: message, type: type, show: true });
	// 	setTimeout(() => {
	// 		setSnackBarConfig((prev) => ({ ...prev, show: false }));
	// 	}, 1000);
	// };

	const editMarks = () => {
		if (studentMarks.verified_by) {
			toast.error("Marks already verified");
			// showSnackBar(false, "Marks already verified");
			return;
		}
		navigate(
			`/marks/enter?subject=${subject}&part=${part}&index_no=${indexNo}`,
		);
	};

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Verify Marks" />
			<div className="w-full rounded-lg bg-white px-8 py-6 mt-6 dark:bg-boxdark md:px-17.5 md:py-8">
				<div>
					<div className="flex flex-wrap gap-x-4">
						<div className="mb-5.5">
							<select
								className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
								name="subject"
								value={subject}
								onChange={handleSubjectChange}
								disabled={selectDisabled}
							>
								<option value="s1">Math/Bio</option>
								<option value="s2">Physics</option>
								<option value="s3">Che/ICT</option>
							</select>
						</div>
						<div className="mb-5.5">
							<select
								className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
								name="part"
								value={part}
								onChange={handlePartChange}
								disabled={selectDisabled}
							>
								<option value="p1">I</option>
								<option value="p2">II</option>
							</select>
						</div>

						<div className="mb-6">
							<button
								onClick={() => setSelectDisabled(!selectDisabled)}
								className="block rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
							>
								{selectDisabled ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
					<div className="mb-4.5">
						<label className="mb-2.5 block text-black dark:text-white">
							Index No <span className="text-meta-1">*</span>
						</label>
						<input
							type="text"
							value={indexNo}
							onChange={(e) => setIndexNo(Number(e.target.value))}
							placeholder="Enter Index No"
							inputMode="numeric"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
					</div>

					<div className="mb-4.5">
						<input
							disabled
							type="text"
							value={
								loading
									? "Loading..."
									: studentMarks.name
										? studentMarks.name
										: "Not Found"
							}
							placeholder="Student Name"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
						<input
							disabled
							type="text"
							value={
								loading
									? "Loading..."
									: studentMarks.centre
										? studentMarks.centre
										: "Not Found"
							}
							placeholder="Student Name"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
						<input
							disabled
							type="text"
							value={
								loading
									? "Loading..."
									: studentMarks.stream
										? studentMarks.stream
										: "Not Found"
							}
							placeholder="Student Name"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
					</div>
					<div className="mb-4.5">
						<label className="mb-2.5 block text-black dark:text-white flex flex-wrap gap-4">
							<span>Marks</span>
							<div
								className="cursor-pointer hover:text-primary"
								onClick={editMarks}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
									/>
								</svg>
							</div>
						</label>
						<input
							disabled
							type="text"
							value={
								studentMarks.entered_by ? studentMarks.mark : "Not Entered Yet"
							}
							placeholder="Enter Index No"
							inputMode="numeric"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black font-bold outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
					</div>

					{studentMarks.entered_by && (
						<div className="mb-4.5">
							Entered by: {studentMarks.entered_by} at{" "}
							{convertUTCToIST(studentMarks.entered_at)}
						</div>
					)}
					{studentMarks.verified_by && (
						<div className="mb-4.5">
							Verified by: {studentMarks.verified_by} at{" "}
							{convertUTCToIST(studentMarks.verified_at)}
						</div>
					)}
				</div>

				<div className="-mx-3 flex flex-wrap gap-y-4">
					<div className="px-3 2xsm:w-1/4">
						<button
							onClick={() => setIndexNo(indexNo - 1)}
							className="block w-full rounded border border-stroke bg-stroke p-3 text-center font-medium text-black transition hover:bg-secondary hover:border-secondary hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-9 dark:hover:bg-meta-9 flex items-center justify-center"
						>
							<svg
								className="w-6 h-6 text-gray-800 dark:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m15 19-7-7 7-7"
								/>
							</svg>
						</button>
					</div>
					<div className="px-3 2xsm:w-1/4">
						<button
							onClick={() => setIndexNo(indexNo + 1)}
							className="block w-full rounded border border-stroke bg-stroke p-3 text-center font-medium text-black transition hover:bg-secondary hover:border-secondary hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-9 dark:hover:bg-meta-9 flex items-center justify-center"
						>
							<svg
								className="w-6 h-6 text-gray-800 dark:text-white"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m9 5 7 7-7 7"
								/>
							</svg>
						</button>
					</div>
					<div className="w-full px-3 2xsm:w-1/2">
						<button
							disabled={submitDisabled}
							onClick={handleSubmit}
							className={
								"block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition " +
								(submitDisabled
									? "bg-opacity-70 hover:bg-opacity-70"
									: "hover:bg-opacity-90")
							}
						>
							Verify Marks
						</button>
					</div>
				</div>
				<div className="w-full px-3 pt-4"></div>
			</div>

			{/* <Snackbar config={snackBarConfig} /> */}
		</DefaultLayout>
	);
};

export default VerifyMarks;
