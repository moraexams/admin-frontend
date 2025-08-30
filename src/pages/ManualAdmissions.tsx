import { ROLE_TECH_COORDINATOR } from "@/common/roles";
import { snakeCaseToNormalCase } from "@/common/utils";
import AddStudent from "@/components/ManualAdmission/AddStudent";
import PageTitle from "@/components/PageTitle";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	LOCAL_STORAGE__ROLE,
	LOCAL_STORAGE__TOKEN,
	LOCAL_STORAGE__USER,
	LOCAL_STORAGE__USERNAME,
	LOCAL_STORAGE__USER_ID,
} from "@/services/authServices";
import {
	type StudentRegistrationDetails,
	getStudentRegistrationDetails,
} from "@/services/manualAdmissionService";
import type { LocalStorage_User } from "@/types/types";
import { LogOut, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CurrencyFormatter } from "../services/utils";

type Student = {
	id: number;
	name: string;
	nic: string;
	school: string;
	phone: string;
	email: string;
	stream: string;
	rankingDistrict: string;
	examDistrict: string;
	examCenter: string;
	fee: number;
};

const STREAM_FEES = [
	{ label: "Maths", fee: 600 },
	{ label: "Science", fee: 600 },
	{ label: "ICT", fee: 200 },
	{ label: "Maths and ICT", fee: 600 },
];

export default function ManualAdmissions() {
	const [studentRegistrationDetails, setStudentRegistrationDetails] =
		useState<StudentRegistrationDetails | null>(null);

	const [students, setStudents] = useState<Student[]>([]);
	const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);

	const navigate = useNavigate();
	const role = localStorage.getItem(LOCAL_STORAGE__ROLE) || "";
	const totalFee = useMemo(() => {
		return CurrencyFormatter.format(
			students.reduce((sum, s) => sum + s.fee, 0),
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

	return (
		<div className="px-6 py-4">
			{role === ROLE_TECH_COORDINATOR ? (
				<Alert variant="warning" className="mb-6">
					<AlertTitle className="text-lg font-normal">
						This page is intended to be used by District Coordinators only. Tech
						Coordinator is allowed here only for testing purposes.
					</AlertTitle>
				</Alert>
			) : user === null ? null : (
				<div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-2 gap-y-0 mb-6 items-center">
					<div className="rounded-md p-2 border w-fit row-span-full">
						<User />
					</div>
					<span className="font-medium">{user.username}</span>
					<span className="text-sm col-start-2">
						{snakeCaseToNormalCase(user.role)}
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
					{students.length === 0 ? (
						<tr>
							<td colSpan={11} className="text-center p-4">
								No students added yet.
							</td>
						</tr>
					) : (
						<>
							{students.map((student) => (
								<tr key={student.id} className="border-t">
									<td className="border px-2 py-1">{student.id}</td>
									<td className="border px-2 py-1">{student.name}</td>
									<td className="border px-2 py-1">{student.nic}</td>
									<td className="border px-2 py-1">{student.school}</td>
									<td className="border px-2 py-1">{student.phone}</td>
									<td className="border px-2 py-1">{student.email}</td>
									<td className="border px-2 py-1">{student.stream}</td>
									<td className="border px-2 py-1">
										{student.rankingDistrict}
									</td>
									<td className="border px-2 py-1">{student.examDistrict}</td>
									<td className="border px-2 py-1">{student.examCenter}</td>
									<td className="border px-2 py-1">{student.fee}</td>
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
