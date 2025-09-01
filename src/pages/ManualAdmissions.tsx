import { snakeCaseToNormalCase } from "@/common/utils";
import AddStudent from "@/components/ManualAdmission/AddStudent";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	LOCAL_STORAGE_ASSOCIATED_DISTRICT,
	LOCAL_STORAGE__ROLE,
	LOCAL_STORAGE__TOKEN,
	LOCAL_STORAGE__USER,
	LOCAL_STORAGE__USERNAME,
	LOCAL_STORAGE__USER_ID,
} from "@/services/authServices";
import {
	type StudentRegistrationDetails,
	getStudentRegistrationDetails,
	getStudentsByCoordinator,
} from "@/services/manualAdmissionService";
import type { TemporaryStudent } from "@/types/manual-admissions";
import type { LocalStorage_User } from "@/types/types";
import { LogOut, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CurrencyFormatter } from "../services/utils";

const STREAM_FEES = [
	{ label: "Physical Science", fee: 600 },
	{ label: "Biological Science", fee: 600 },
	{ label: "ICT Only", fee: 200 },
	{ label: "Physical Science (ICT)", fee: 600 },
] as const;

const STREAM_FEES_MAP = Object.fromEntries(
	STREAM_FEES.map((item) => [item.label, item.fee]),
);

export default function ManualAdmissions() {
	const [studentRegistrationDetails, setStudentRegistrationDetails] =
		useState<StudentRegistrationDetails | null>(null);

	const [students, setStudents] = useState<TemporaryStudent[]>([]);
	const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);

	const navigate = useNavigate();
	const totalFee = useMemo(() => {
		return CurrencyFormatter.format(
			!Array.isArray(students)
				? 0
				: students.reduce((sum, s) => sum + STREAM_FEES_MAP[s.stream], 0),
		);
	}, [students]);

	useEffect(() => {
		getStudentRegistrationDetails()
			.then((data) => {
				setStudentRegistrationDetails(data);
			})
			.catch((error) => {
				toast.error(
					error.message || "Failed to fetch student registration details",
				);
			});
	}, []);

	const userStringified = localStorage.getItem(LOCAL_STORAGE__USER);
	const user: LocalStorage_User | null = userStringified
		? JSON.parse(userStringified)
		: null;

	const logOut = () => {
		localStorage.removeItem(LOCAL_STORAGE__TOKEN);
		localStorage.removeItem(LOCAL_STORAGE__USER);
		localStorage.removeItem(LOCAL_STORAGE__USERNAME);
		localStorage.removeItem(LOCAL_STORAGE__USER_ID);
		localStorage.removeItem(LOCAL_STORAGE__ROLE);
		navigate("/auth/signin");
	};

	useEffect(() => {
		if (user === null) {
			logOut();
		}
	}, []);

	const fetchStudents = () => {
		getStudentsByCoordinator()
			.then((data) => {
				setStudents(data);
			})
			.catch(console.error);
	};

	useEffect(() => {
		fetchStudents();
	}, []);

	return (
		<div className="px-6 py-4">
			{user === null ? null : (
				<div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-2 gap-y-0 mb-6 items-center">
					<div className="rounded-md p-2 border w-fit row-span-full">
						<User />
					</div>
					<span className="font-medium">{user.username}</span>
					<span className="text-sm col-start-2">
						{snakeCaseToNormalCase(user.role)} - {localStorage.getItem(LOCAL_STORAGE_ASSOCIATED_DISTRICT)}
					</span>

					<Button
						variant="destructive"
						size="sm"
						onClick={logOut}
						className="row-span-full col-start-3"
					>
						<LogOut />
						<span>Log Out</span>
					</Button>
				</div>
			)}

			<PageTitle title="Admissions | Mora Exams" />
			<div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto]">
				<h2 className="col-start-1 row-start-1 text-title-md2 font-semibold">
					Admissions
				</h2>
				<p className="max-w-prose col-start-1 col-span-2 row-start-2">
					You can register students in bulk for the Mora Exams below. If you
					face any issues, please contact us immediately.
				</p>

				<AddStudent
					open={addStudentDialogOpen}
					setOpen={setAddStudentDialogOpen}
					additionalDetails={studentRegistrationDetails}
					onStudentAdded={fetchStudents}
				/>
			</div>

			<table className="mt-6 w-full table-auto border">
				<thead className="">
					<tr>
						<th className="border px-2 py-1 text-left">#</th>
						<th className="border px-2 py-1 text-left">Name</th>
						<th className="border px-2 py-1 text-left">NIC</th>
						<th className="border px-2 py-1 text-left">School</th>
						<th className="border px-2 py-1 text-left">Phone</th>
						<th className="border px-2 py-1 text-left">Email</th>
						<th className="border px-2 py-1 text-left">Stream</th>
						<th className="border px-2 py-1 text-left">Ranking District</th>
						<th className="border px-2 py-1 text-left">Exam District</th>
						<th className="border px-2 py-1 text-left">Exam Center</th>
						<th className="border px-2 py-1 text-left">Fee</th>
					</tr>
				</thead>
				<tbody>
					{!Array.isArray(students) ? (
						<tr>
							<td colSpan={11} className="text-center p-4">
								Loading...
							</td>
						</tr>
					) : students.length === 0 ? (
						<tr>
							<td colSpan={11} className="text-center p-4">
								No students added yet.
							</td>
						</tr>
					) : (
						<>
							{students.map((student, index) => (
								<tr key={student.nic} className="border-t">
									<td className="border px-2 py-1">{index + 1}</td>
									<td className="border px-2 py-1">{student.full_name}</td>
									<td className="border px-2 py-1">{student.nic}</td>
									<td className="border px-2 py-1">{student.school}</td>
									<td className="border px-2 py-1">{student.telephone_no}</td>
									<td className="border px-2 py-1">{student.email}</td>
									<td className="border px-2 py-1">{student.stream}</td>
									<td className="border px-2 py-1">{student.rank_district}</td>
									<td className="border px-2 py-1">{student.exam_district}</td>
									<td className="border px-2 py-1">{student.exam_centre}</td>
									<td className="border px-2 py-1">
										{STREAM_FEES_MAP[student.stream]}
									</td>
								</tr>
							))}
						</>
					)}
				</tbody>
			</table>
			<div className="my-4">
				<Label className="text-base">Total Fee</Label>
				<div className="text-2xl">{totalFee}</div>
			</div>
		</div>
	);
}
