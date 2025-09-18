import { snakeCaseToNormalCase } from "@/common/utils";
import AddStudent from "@/components/ManualAdmission/AddStudent";
import DeleteStudent from "@/components/ManualAdmission/DeleteStudent";
import EditStudent from "@/components/ManualAdmission/EditStudent";
import PayNow from "@/components/ManualAdmission/PayNow";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { CurrencyFormatter } from "@/services/utils";
import type { TemporaryStudent } from "@/types/manual-admissions";
import type { LocalStorage_User } from "@/types/types";
import { LogOut, Pen, Trash, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
	const [action, setAction] = useState<"add" | "edit" | "delete" | null>(null);
	const [selectedStudent, setSelectedStudent] =
		useState<TemporaryStudent | null>(null);

	const navigate = useNavigate();
	const totalAmount = useMemo(() => {
		return !Array.isArray(students)
			? 0
			: students.reduce((sum, s) => sum + STREAM_FEES_MAP[s.stream], 0);
	}, [students]);

	const fetchStudentRegistrationDetails = () => {
		getStudentRegistrationDetails()
			.then((data) => {
				if ("reason" in data) {
					setStudentRegistrationDetails({
						districts: [],
						sitting_districts: [],
						number_of_students: data.number_of_students,
					});
					if (data.reason === "FORM_CLOSED") {
						toast.error("Student registration is currently closed.");
					} else {
						toast.error("Failed to fetch student registration details.");
					}
					return;
				}
				setStudentRegistrationDetails(data);
			})
			.catch((error) => {
				toast.error(
					error.message || "Failed to fetch student registration details",
				);
			});
	};

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
		navigate("/sign-in");
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
		fetchStudentRegistrationDetails();
		fetchStudents();
	}, []);

	const numberOfStudents = studentRegistrationDetails?.number_of_students || 0;

	return (
		<div className="px-3 md:px-5 pt-4 pb-28">
			{user === null ? null : (
				<>
					<div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] gap-x-2 gap-y-0 mb-6 items-center">
						<div className="rounded-md p-2 border w-fit row-span-full">
							<User />
						</div>
						<span className="font-medium">{user.username}</span>
						<span className="text-sm col-start-2">
							{snakeCaseToNormalCase(user.role)} -{" "}
							{localStorage.getItem(LOCAL_STORAGE_ASSOCIATED_DISTRICT)}
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

					<div className="flex flex-wrap gap-4 mb-6">
						{studentRegistrationDetails === null ? null : (
							<Card className="gap-0 w-fit py-3">
								<CardHeader className="px-3">
									<CardTitle className="text-muted-foreground text-sm">
										Total Admissions
									</CardTitle>
								</CardHeader>
								<CardContent className="px-3">
									<div className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
										{numberOfStudents == 0
											? "0"
											: numberOfStudents.toString().padStart(2, "0")}
									</div>
								</CardContent>
								<CardFooter className="w-fit px-3 text-pretty">
									Number of students you registered.
								</CardFooter>
							</Card>
						)}
					</div>

					<div className="flex flex-col md:flex-row gap-2">
						<Card className="gap-0 w-full md:w-fit py-3">
							<CardHeader className="px-3">
								<CardTitle className="text-base">Payment Details</CardTitle>
							</CardHeader>
							<CardContent className="px-3">
								<table className="w-full text-base">
									<tbody>
										<tr>
											<td className="font-medium pr-4">Bank</td>
											<td className="text-right">People's Bank</td>
										</tr>
										<tr>
											<td className="font-medium pr-4">Branch</td>
											<td className="text-right">Jaffna Stanley Road Branch</td>
										</tr>
										<tr>
											<td className="font-medium pr-4">Account Number</td>
											<td className="text-right">030200370038814</td>
										</tr>
										<tr>
											<td className="font-medium pr-4">Account Holder</td>
											<td className="text-right">K MATHUMILAN</td>
										</tr>
									</tbody>
								</table>
							</CardContent>
						</Card>
						<Card className="gap-0 w-full md:w-fit py-3">
							<CardHeader className="px-3">
								<CardTitle className="text-base">
									For Technical Issues
								</CardTitle>
							</CardHeader>
							<CardContent className="px-3">
								<div className="text-xl tabular-nums @[250px]/card:text-4xl mb-2">
									+94 77 573 2943
								</div>
							</CardContent>
							<CardFooter className="w-fit px-3 text-sm text-pretty max-w-prose md:max-w-[38ch]">
								Please WhatsApp or call this number to resolve the technical
								issues you encounter here.
							</CardFooter>
						</Card>
					</div>
				</>
			)}
			<Toaster position="top-right" />

			<PageTitle title="Admissions | Mora Exams" />
			<div className="mt-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] grid-rows-[auto_auto_auto] md:grid-rows-[auto_auto]">
				<h2 className="col-start-1 row-start-1 text-title-md2 font-semibold">
					Admissions
				</h2>
				<p className="max-w-prose col-start-1 md:col-span-2 row-start-2">
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

			<EditStudent
				open={action === "edit" && selectedStudent !== null}
				selectedStudent={selectedStudent}
				setOpen={(c) => (c ? null : setSelectedStudent(null))}
				additionalDetails={studentRegistrationDetails}
				onStudentEdited={fetchStudents}
			/>
			<DeleteStudent
				open={action === "delete" && selectedStudent !== null}
				student={{
					nic: selectedStudent?.nic || "",
					full_name: selectedStudent?.full_name || "",
				}}
				setOpen={(c) => (c ? null : setSelectedStudent(null))}
				onStudentDeleted={fetchStudents}
			/>

			<div className="block lg:hidden space-y-2 mt-6">
				{students.length === 0 ? (
					<div className="grid place-items-center min-h-[120px]">
						No pending admissions.
					</div>
				) : (
					students.map((student, index) => (
						<Card key={student.nic} className="py-4 gap-3">
							<CardHeader className="gap-0 px-4">
								<CardTitle className="text-lg font-semibold">
									#{index + 1} {student.full_name}
								</CardTitle>
								<CardDescription>
									{student.telephone_no} | {student.email}
								</CardDescription>
							</CardHeader>
							<CardContent className="px-4">
								<table className="w-full">
									<tbody>
										<tr>
											<td>NIC</td>
											<td className="text-right">{student.nic}</td>
										</tr>
										<tr>
											<td>Stream</td>{" "}
											<td className="text-right">{student.stream}</td>
										</tr>
										<tr>
											<td>Ranking District</td>{" "}
											<td className="text-right">{student.rank_district}</td>
										</tr>
										<tr>
											<td>Exam Center</td>{" "}
											<td className="text-right">{student.exam_centre}</td>
										</tr>
									</tbody>
								</table>
							</CardContent>
							<CardFooter className="flex gap-2 justify-end">
								<Button
									variant="destructive"
									size="icon"
									onClick={() => {
										setAction("delete");
										setSelectedStudent(student);
									}}
								>
									<Trash />
								</Button>
								<Button
									size="icon"
									onClick={() => {
										setAction("edit");
										setSelectedStudent(student);
									}}
								>
									<Pen />
								</Button>
							</CardFooter>
						</Card>
					))
				)}
			</div>

			<div className="hidden lg:block">
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
							<th className="border px-2 py-1 text-left">Exam Center</th>
							<th className="border px-2 py-1 text-left">Actions</th>
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
									No pending admissions.
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
										<td className="border px-2 py-1">
											{student.rank_district}
										</td>
										<td className="border px-2 py-1">{student.exam_centre}</td>
										<td className="space-x-3 space-y-2 py-2 px-2">
											<Button
												variant="destructive"
												size="icon"
												onClick={() => {
													setAction("delete");
													setSelectedStudent(student);
												}}
											>
												<Trash />
											</Button>
											<Button
												size="icon"
												onClick={() => {
													setAction("edit");
													setSelectedStudent(student);
												}}
											>
												<Pen />
											</Button>
										</td>
									</tr>
								))}
							</>
						)}
					</tbody>
				</table>
			</div>
			<div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] mt-6 bg-secondary py-3 fixed bottom-0 left-0 right-0 px-3">
				<Label className="text-base col-start-1 row-start-1">Total Fee</Label>
				<div className="text-2xl col-start-1 row-start-2">
					{CurrencyFormatter.format(totalAmount)}
				</div>

				<PayNow
					amount={totalAmount}
					onPaid={() => {
						fetchStudents();
						fetchStudentRegistrationDetails();
					}}
				/>
			</div>
		</div>
	);
}
