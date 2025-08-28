import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const STREAM_OPTIONS: Array<{
	label: string;
	value: string;
}> = [
	{
		value: "2",
		label: "Physical Science (Maths, Physics, Chemistry)",
	},
	{
		value: "4",
		label: "Biological Science (Biology, Physics, Chemistry)",
	},
	{
		value: "3",
		label: "Other (Maths, Physics, ICT)",
	},
	{
		value: "1",
		label: "ICT Only",
	},
] as const;

const AddStudentSchema = z.object({
	name: z.string().min(1, "Name is required"),
	nic: z.string().length(12, "NIC must be 12 digits"),
	school: z.string(),
	phone: z
		.string()
		.min(1, "Phone is required")
		.length(10, "Phone must be 10 digits"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	stream: z.enum(
		STREAM_OPTIONS.map((opt) => opt.value) as [string, ...string[]],
		{
			message: "Stream is required",
		},
	),
	address: z.string().min(1, "Address is required"),
	gender: z.enum(["male", "female"], {
		message: "Gender is required",
	}),
	medium: z.enum(["Tamil", "English"], {
		message: "Medium is required",
	}),
	examDistrict: z.number().min(1, "Exam District is required"),
	rankingDistrict: z.number().min(1, "Ranking District is required"),
	examCentre: z.number().min(1, "Exam Centre is required"),
});

export default function AddStudent(props: Props) {
	const form = useForm<z.infer<typeof AddStudentSchema>>({
		resolver: zodResolver(AddStudentSchema),
		defaultValues: {},
	});

	function onSubmit(values: z.infer<typeof AddStudentSchema>) {
		console.log(values);
	}

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

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="nic"
							render={({ field }) => (
								<FormItem>
									<FormLabel>NIC</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="school"
							render={({ field }) => (
								<FormItem>
									<FormLabel>School</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Permanent Address</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="gender"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Gender</FormLabel>

									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="male">MALE</SelectItem>
											<SelectItem value="female">FEMALE</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="medium"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Medium</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="tamil">Tamil</SelectItem>
												<SelectItem value="english">English</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stream"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Stream</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{STREAM_OPTIONS.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rankingDistrict"
							render={({ field }) => (
								<FormItem>
									<FormLabel>District for Ranking</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="examDistrict"
							render={({ field }) => (
								<FormItem>
									<FormLabel>District for Exam Sitting</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="examCentre"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Exam Centre</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="mt-6 flex justify-end space-x-3">
							<Button variant="outline" onClick={() => props.setOpen(false)}>
								Cancel
							</Button>
							<Button
								// TODO
								// onClick={handleAddStudent}
								className="bg-blue-600 text-white hover:bg-blue-700"
							>
								Register
							</Button>
						</div>
					</form>
				</Form>

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
				<div className="mt-6 flex justify-end space-x-3"></div>
			</DialogContent>
		</Dialog>
	);
}
