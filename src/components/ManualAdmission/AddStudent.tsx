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
import { Textarea } from "@/components/ui/textarea";
import {
	type StudentRegistrationDetails,
	addStudentManually,
} from "@/services/manualAdmissionService";
import {
	ManualStudentRegistrationFormSchema,
	STREAM_OPTIONS,
} from "@/types/manual-admissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";

const RequiredField = () => <span className="text-red-500">*</span>;

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	additionalDetails: StudentRegistrationDetails | null;
}

const defaultValues: z.infer<typeof ManualStudentRegistrationFormSchema> = {
	name: "Sahithyan Kandathasan",
	nic: "200402710173",
	school: "J/Hartley College",
	phone: "0771234567",
	email: "sahithyan@example.com",
	stream: "2",
	address: "123 Main St, Colombo",
	gender: "Male",
	medium: "Tamil",
	examDistrict: 9,
	rankingDistrict: 9,
	examCentre: 38,
};

export default function AddStudent(props: Props) {
	const form = useForm<z.infer<typeof ManualStudentRegistrationFormSchema>>({
		resolver: zodResolver(ManualStudentRegistrationFormSchema),
		defaultValues,
	});

	function onSubmit(
		values: z.infer<typeof ManualStudentRegistrationFormSchema>,
	) {
		addStudentManually(values)
			.then(() => {
				props.setOpen(false);
				toast.success("Student added successfully");
				form.reset();
			})
			.catch((err) => {
				console.error(err);
				// toast.error(err);
			});
	}

	const selectedExamSittingDistrict = form.watch("examDistrict");
	const availableExamCenters = useMemo(
		() =>
			props.additionalDetails?.districts.find(
				(d) => d.id === Number(selectedExamSittingDistrict),
			)?.exam_centres,
		[selectedExamSittingDistrict, props.additionalDetails],
	);

	return (
		<Dialog onOpenChange={props.setOpen} open={props.open}>
			<DialogTrigger
				disabled={props.additionalDetails === null}
				onClick={() => props.setOpen(true)}
				className="col-start-3 row-start-1 row-span-full flex items-center gap-2 rounded bg-blue-600 px-3 py-2 h-fit text-white font-semibold hover:bg-blue-700 my-auto text-sm disabled:opacity-50 disabled:pointer-events-none"
			>
				<PlusCircle size={18} />
				Add Student
			</DialogTrigger>
			<DialogContent className="w-full !max-w-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Add Student</DialogTitle>
					<DialogDescription className="max-w-prose">
						Fill in the details below to register a new student for the Mora
						Exams.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="gap-y-3 gap-x-3 grid grid-cols-2"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="col-span-full">
									<FormLabel>
										Full Name
										<RequiredField />
									</FormLabel>
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
									<FormLabel>
										NIC
										<RequiredField />
									</FormLabel>
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
								<FormItem className="col-span-full">
									<FormLabel>
										Permanent Address
										<RequiredField />
									</FormLabel>
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
									<FormLabel>
										Phone No.
										<RequiredField />
									</FormLabel>
									<FormControl>
										<Input type="tel" {...field} />
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
									<FormLabel>
										Email
										<RequiredField />
									</FormLabel>
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
									<FormLabel>
										Gender
										<RequiredField />
									</FormLabel>
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
											<SelectItem value="Male">MALE</SelectItem>
											<SelectItem value="Female">FEMALE</SelectItem>
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
									<FormLabel>
										Medium
										<RequiredField />
									</FormLabel>
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
											<SelectItem value="Tamil">TAMIL</SelectItem>
											<SelectItem value="English">ENGLISH</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stream"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Stream
										<RequiredField />
									</FormLabel>
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
											{STREAM_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rankingDistrict"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										District for Ranking
										<RequiredField />
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value?.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{props.additionalDetails?.districts.map((option) => (
												<SelectItem
													key={option.id}
													value={option.id.toString()}
												>
													{option.district_name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="examDistrict"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										District for Exam Sitting
										<RequiredField />
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value?.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{props.additionalDetails?.districts.map((option) => (
												<SelectItem
													key={option.id}
													value={option.id.toString()}
												>
													{option.district_name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="examCentre"
							disabled={availableExamCenters === undefined}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Exam Centre
										<RequiredField />
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value?.toString()}
										disabled={availableExamCenters === undefined}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{availableExamCenters === undefined
												? null
												: availableExamCenters.map((option) => (
														<SelectItem
															key={option.id}
															value={option.id.toString()}
														>
															{option.name}
														</SelectItem>
													))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="mt-6 flex justify-end space-x-3 col-start-2">
							<Button
								variant="outline"
								onClick={() => props.setOpen(false)}
								type="button"
							>
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
			</DialogContent>
		</Dialog>
	);
}
