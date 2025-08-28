import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function AddStudent(props: Props) {
	return (
		<Dialog onOpenChange={props.setOpen} open={props.open}>
			<DialogTrigger asChild>
				<Button
					onClick={() => props.setOpen(true)}
					className="col-start-3 row-start-1 row-span-full flex items-center gap-2 rounded bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 my-auto"
				>
					<PlusCircle size={18} />
					Add Student
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Add Student</DialogTitle>
					<DialogDescription className="max-w-prose">
						Fill in the details below to register a new student for the Mora
						Exams.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
					{[
						{ name: "name", label: "Name" },
						{ name: "nic", label: "NIC" },
						{ name: "school", label: "School" },
						{ name: "phone", label: "Phone Number" },
						{ name: "email", label: "Email" },
						{ name: "stream", label: "Stream" },
						{ name: "rankingDistrict", label: "Ranking District" },
						{ name: "examDistrict", label: "Exam District" },
						{ name: "examCenter", label: "Exam Center" },
					].map((field) => (
						<div key={field.name} className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 dark:text-white">
								{field.label}
							</label>
							<input
								type={
									field.name === "phone" || field.name === "nic"
										? "tel"
										: "text"
								}
								name={field.name}
								// TODO
								value=""
								// value={(form as any)[field.name]}
								// onChange={handleChange}
								maxLength={
									field.name === "phone"
										? 10
										: field.name === "nic"
											? 12
											: undefined
								}
								// TODO
								// className={`mt-1 w-full rounded border px-3 py-2 dark:bg-meta-4 dark:text-white ${
								// 	errors[field.name] ? "border-red-500" : "border-stroke"
								// }`}
								required
							/>
							{/* TODO */}
							{/* {errors[field.name] && (
										<span className="text-xs text-red-500 mt-1">
											{errors[field.name]}
										</span>
									)} */}
						</div>
					))}
				</div>

				{/* Actions */}
				<div className="mt-6 flex justify-end space-x-3">
					<button
						onClick={() => props.setOpen(false)}
						className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
					>
						Cancel
					</button>
					<button
						// TODO
						// onClick={handleAddStudent}
						className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
					>
						Register
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
