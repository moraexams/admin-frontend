import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
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
import { LOCAL_STORAGE_ASSOCIATED_DISTRICT } from "@/services/authServices";
import {
	type StudentRegistrationDetails,
	editStudent,
} from "@/services/manualAdmissionService";
import {
	ManualStudentRegistrationFormSchema,
	STREAM_OPTIONS,
	type TemporaryStudent,
} from "@/types/manual-admissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";

const RequiredField = () => <span className="text-red-500">*</span>;

interface Props {
	open: boolean;
	selectedStudent: TemporaryStudent | null;
	setOpen: (open: boolean) => void;
	additionalDetails: StudentRegistrationDetails | null;
	onStudentEdited?: () => void;
}

export default function EditStudent(props: Props) {
	const form = useForm<z.infer<typeof ManualStudentRegistrationFormSchema>>({
		resolver: zodResolver(ManualStudentRegistrationFormSchema),
		defaultValues: {
			name: props.selectedStudent?.full_name ?? "",
			nic: props.selectedStudent?.nic ?? "",
			school: props.selectedStudent?.school ?? "",
			phone: props.selectedStudent?.telephone_no ?? "",
			address: props.selectedStudent?.address ?? "",
			email: props.selectedStudent?.email ?? "",
			stream: props.selectedStudent?.stream ?? "",
			rankingDistrict: props.selectedStudent?.rank_district_id ?? 0,
			examDistrict: props.selectedStudent?.exam_district_id ?? 0,
			examCentre: props.selectedStudent?.exam_centre_id ?? 0,
			gender: props.selectedStudent?.gender ?? "Male",
			medium: props.selectedStudent?.medium ?? "Tamil",
		},
	});

	useEffect(() => {
		form.reset({
			name: props.selectedStudent?.full_name ?? "",
			nic: props.selectedStudent?.nic ?? "",
			school: props.selectedStudent?.school ?? "",
			phone: props.selectedStudent?.telephone_no ?? "",
			address: props.selectedStudent?.address ?? "",
			email: props.selectedStudent?.email ?? "",
			stream: props.selectedStudent?.stream_id ?? "",
			rankingDistrict: props.selectedStudent?.rank_district_id ?? 0,
			examDistrict: props.selectedStudent?.exam_district_id ?? 0,
			examCentre: props.selectedStudent?.exam_centre_id ?? 0,
			gender: props.selectedStudent?.gender ?? "Male",
			medium: props.selectedStudent?.medium ?? "Tamil",
		});
	}, [props.selectedStudent]);

	function onSubmit(
		values: z.infer<typeof ManualStudentRegistrationFormSchema>,
	) {
		editStudent(values)
			.then(() => {
				props.setOpen(false);
				toast.success("Student edited successfully");
				form.reset();
				props.onStudentEdited?.();
			})
			.catch((err) => {
				toast.error(err);
			});
	}

	useEffect(() => {
		if (!props.additionalDetails) return;
		const associatedDistrict = localStorage.getItem(
			LOCAL_STORAGE_ASSOCIATED_DISTRICT,
		);
		if (!associatedDistrict) {
			return;
		}

		const district = props.additionalDetails.districts.find(
			(d) => d.district_name === associatedDistrict,
		);
		console.log(district);
		if (!district) {
			return;
		}

		form.setValue("examDistrict", district.id);

		if (district.exam_centres.length > 0) {
			form.setValue("examCentre", district.exam_centres[0].id);
		}
	}, [props.additionalDetails, props.selectedStudent]);

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
			<DialogContent className="w-[min(720px,98%)] !max-w-3xl p-2 md:p-6">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Edit Student</DialogTitle>
					<DialogDescription className="max-w-prose">
						Here you can edit a student's details except the NIC number.
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
										<Input disabled {...field} />
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
										disabled={true}
									>
										<FormControl>
											<SelectTrigger className="pointer-events-none">
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
							<Button className="bg-blue-600 text-white hover:bg-blue-700">
								Save
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
