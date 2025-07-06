import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
// import Snackbar from "../../components/Snackbar";
import DefaultLayout from "../../layout/DefaultLayout";
import {
	getStudentbyIndex,
	verifyStudent,
} from "../../services/studentService";
// import type { SnackBarConfig } from "../../types/snackbar";
import type { Student } from "../../types/types";
import toast from "react-hot-toast";

const VerifyStudent = () => {
	const [indexNo, setIndexNo] = useState<number>(0);
	const [student, setStudent] = useState<Student | null>(null);
	const [showVerify, setShowVerify] = useState<boolean>(true);

	// const [snackBarConfig, setSnackBarConfig] = useState<SnackBarConfig>({
	// 	message: "",
	// 	type: false,
	// 	show: false,
	// });

	const handleVerifyStudent = async () => {
		if (student) {
			verifyStudent(Number(student.index_no))
				.then(() => {
					// showSnackBar(true, "Verified");
					toast.success("Student Verified Successfully");
					setShowVerify(false);
				})
				.catch((error) => {
					// showSnackBar(false, error);
					toast.error(`Failed to verify student: ${error.message}`);
				});
		}
	};

	const searchStudent = async () => {
		if (indexNo === 0 || isNaN(indexNo)) {
			// showSnackBar(false, "Please enter a valid index number");
			toast.error("Please enter a valid index number");
			setIndexNo(0);
		
		} else {
			const student = await getStudentbyIndex(indexNo);
			if (student.error) {
				setStudent(null);
			} else {
				setStudent(student);
				setShowVerify(true);
			}
		}
	};

	// const showSnackBar = (type: boolean, message: string) => {
	// 	setSnackBarConfig({ message: message, type: type, show: true });
	// 	setTimeout(() => {
	// 		setSnackBarConfig((prev) => ({ ...prev, show: false }));
	// 	}, 1000);
	// };
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Verify Student" />
			<div className="w-full min-h-[75vh] rounded-lg bg-white px-8 py-6 mt-6 dark:bg-boxdark md:px-17.5 md:py-8">
				<div className="flex items-center justify-center gap-4 flex-col md:flex-row">
					<input
						type="text"
						value={indexNo}
						onChange={(e) => setIndexNo(Number(e.target.value))}
						placeholder="Enter Index No"
						className="rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
					/>
					<button
						onClick={searchStudent}
						className="block rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
					>
						Search Student
					</button>
				</div>

				<div className="py-4">
					{student ? (
						<div>
							<table className="table-fixed border-separate border-spacing-2 text-black dark:text-white">
								<tbody>
									<tr>
										<td>Name</td>
										<td>:</td>
										<td>
											<strong>{student.name}</strong>
										</td>
									</tr>
									<tr>
										<td>NIC</td>
										<td>:</td>
										<td>
											<strong>{student.nic}</strong>
										</td>
									</tr>
									<tr>
										<td>Gender</td>
										<td>:</td>
										<td>
											<strong>{student.gender}</strong>
										</td>
									</tr>
									<tr>
										<td>Stream</td>
										<td>:</td>
										<td>
											<strong>{student.stream?.name}</strong>
										</td>
									</tr>
									<tr>
										<td>Medium</td>
										<td>:</td>
										<td>
											<strong>{student.medium}</strong>
										</td>
									</tr>
									<tr>
										<td>Rank District</td>
										<td>:</td>
										<td>
											<strong>{student.rank_district?.name}</strong>
										</td>
									</tr>
									<tr>
										<td>Exam District</td>
										<td>:</td>
										<td>
											<strong>{student.exam_district?.name}</strong>
										</td>
									</tr>
									<tr>
										<td>Exam Centre</td>
										<td>:</td>
										<td>
											<strong>{student.exam_centre?.name}</strong>
										</td>
									</tr>
									<tr>
										<td>Registered By</td>
										<td>:</td>
										<td>
											<strong>{student.registered_by?.username}</strong>
										</td>
									</tr>
								</tbody>
							</table>
							{!student.checked_by_id && showVerify && (
								<div className="flex items-center justify-center gap-4 flex-col md:flex-row">
									<button
										onClick={handleVerifyStudent}
										className="block rounded border border-success bg-success p-3 text-center font-medium text-white transition hover:bg-opacity-90"
									>
										Verify Student
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="text-center text-danger font-bold">
							Student Not Found
						</div>
					)}
				</div>
			</div>

			{/* <Snackbar config={snackBarConfig} /> */}
		</DefaultLayout>
	);
};

export default VerifyStudent;
