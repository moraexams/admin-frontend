import { snakeCaseToNormalCase } from "@/common/utils";
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
	getRegisteredStudentsByCoordinator,
} from "@/services/manualAdmissionService";
import type { TemporaryStudent } from "@/types/manual-admissions";
import type { LocalStorage_User } from "@/types/types";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function StudentsAddedByCoordinator() {
	useState<StudentRegistrationDetails | null>(null);
	const [students, setStudents] = useState<TemporaryStudent[]>([]);

	const navigate = useNavigate();
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
		getRegisteredStudentsByCoordinator()
			.then((data) => {
				setStudents(data);
			})
			.catch(console.error);
	};

	useEffect(() => {
		fetchStudents();
	}, []);

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
						{students === null ? null : (
							<Card className="gap-0 w-fit py-3">
								<CardHeader className="px-3">
									<CardTitle className="text-muted-foreground text-sm">
										Total Admissions
									</CardTitle>
								</CardHeader>
								<CardContent className="px-3">
									<div className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
										{students.length == 0
											? "0"
											: students.length.toString().padStart(2, "0")}
									</div>
								</CardContent>
								<CardFooter className="w-fit px-3 text-pretty">
									Number of students you registered.
								</CardFooter>
							</Card>
						)}

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
					Already Registered Students
				</h2>
				<p className="max-w-prose col-start-1 md:col-span-2 row-start-2">
					You can use this page to view the students you have registered
					successfully. You <b>cannot</b> edit or delete students from this
					list.
				</p>
			</div>

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
							<th className="border px-2 py-1 text-left">Exam District</th>
							<th className="border px-2 py-1 text-left">Exam Center</th>
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
										<td className="border px-2 py-1">
											{student.exam_district}
										</td>
										<td className="border px-2 py-1">{student.exam_centre}</td>
									</tr>
								))}
							</>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
