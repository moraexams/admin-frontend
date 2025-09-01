import { z } from "zod";

export const STREAM_OPTIONS: Array<{
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
export const ManualStudentRegistrationFormSchema = z.object({
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
	gender: z.enum(["Male", "Female"], {
		message: "Gender is required",
	}),
	medium: z.enum(["Tamil", "English"], {
		message: "Medium is required",
	}),
	examDistrict: z.coerce.number().min(1, "Exam District is required"),
	rankingDistrict: z.coerce.number().min(1, "Ranking District is required"),
	examCentre: z.coerce.number().min(1, "Exam Centre is required"),
});

export interface TemporaryStudent {
	nic: string;
	full_name: string;
	school: string;
	address: string;
	email: string;
	telephone_no: string;
	gender: "Male" | "Female";
	medium: "Tamil" | "English";
	stream: string;
	stream_id: string;
	rank_district: string;
	rank_district_id: number;
	exam_district: string;
	exam_district_id: number;
	exam_centre: string;
	exam_centre_id: number;
}
