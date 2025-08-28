import { ROLE_TECH_COORDINATOR } from "@/common/roles";
import AddStudent from "@/components/ManualAdmission/AddStudent";
import PageTitle from "@/components/PageTitle";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { LOCAL_STORAGE__ROLE } from "@/services/authServices";
import { useMemo, useState } from "react";
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
	const [students, setStudents] = useState<Student[]>([]);
	const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
	const [form, setForm] = useState<Omit<Student, "id" | "fee">>({
		name: "",
		nic: "",
		school: "",
		phone: "",
		email: "",
		stream: "",
		rankingDistrict: "",
		examDistrict: "",
		examCenter: "",
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		// Limit input to numbers only for NIC and phone
		if ((name === "nic" || name === "phone") && !/^\d*$/.test(value)) return;

		setForm({ ...form, [name]: value });
	};

	const getFee = (stream: string) => {
		const match = STREAM_FEES.find((opt) => opt.label === stream);
		return match ? match.fee : 0;
	};

	const handleAddStudent = () => {
		const newErrors: { [key: string]: string } = {};

		if (!form.name.trim()) newErrors.name = "Name is required";
		if (form.nic.trim().length !== 12) newErrors.nic = "NIC must be 12 digits";
		if (!form.school.trim()) newErrors.school = "School is required";
		if (!form.phone.trim()) newErrors.phone = "Phone number is required";
		else if (form.phone.trim().length !== 10)
			newErrors.phone = "Phone must be 10 digits";
		if (!form.email.trim()) newErrors.email = "Email is required";
		if (!form.stream.trim()) newErrors.stream = "Stream is required";
		if (!form.rankingDistrict.trim())
			newErrors.rankingDistrict = "Ranking district is required";
		if (!form.examDistrict.trim())
			newErrors.examDistrict = "Exam district is required";
		if (!form.examCenter.trim())
			newErrors.examCenter = "Exam center is required";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		const fee = getFee(form.stream);

		setStudents([...students, { id: students.length + 1, ...form, fee }]);

		setForm({
			name: "",
			nic: "",
			school: "",
			phone: "",
			email: "",
			stream: "",
			rankingDistrict: "",
			examDistrict: "",
			examCenter: "",
		});
		setErrors({});
		setAddStudentDialogOpen(false);
	};

	const role = localStorage.getItem(LOCAL_STORAGE__ROLE) || "";
	const totalFee = useMemo(() => {
		return CurrencyFormatter.format(
			students.reduce((sum, s) => sum + s.fee, 0),
		);
	}, [students]);

	return (
		<>
			{role === ROLE_TECH_COORDINATOR ? (
				<Alert variant="warning" className="mb-6">
					<AlertTitle className="text-lg font-normal">
						This page is intended to be used by District Coordinators only. Tech
						Coordinator is allowed here only for testing purposes.
					</AlertTitle>
				</Alert>
			) : null}

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
		</>
	);
}
