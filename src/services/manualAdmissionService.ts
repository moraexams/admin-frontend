import type {
	ManualStudentRegistrationFormSchema,
	TemporaryStudent,
} from "@/types/manual-admissions";
import { AxiosError } from "axios";
import type z from "zod";
import axiosInstance from "../axiosConfig";

interface DistrictDetail {
	id: number;
	district_name: string;
	exam_centres: Array<{
		id: number;
		name: string;
	}>;
}
export interface StudentRegistrationDetails {
	districts: Array<DistrictDetail>;
	sitting_districts: Array<DistrictDetail>;
	number_of_students: number;
}

export const getStudentRegistrationDetails = async () => {
	try {
		const response = await axiosInstance.get<
			| StudentRegistrationDetails
			| {
					reason: "FORM_CLOSED";
					number_of_students: number;
			  }
		>("/student-registration/details");
		return response.data;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "Error fetching student registration details";
	}
};

export const addStudent = async (
	studentData: z.infer<typeof ManualStudentRegistrationFormSchema>,
) => {
	try {
		const response = await axiosInstance.post("/coordinator/students", {
			nic: studentData.nic,
			full_name: studentData.name,
			school: studentData.school || undefined,
			telephone_no: studentData.phone,
			address: studentData.address,
			email: studentData.email,
			gender: studentData.gender,
			stream_id: Number.parseInt(studentData.stream, 10),
			medium: studentData.medium,
			rank_district_id: studentData.rankingDistrict,
			exam_district_id: studentData.examDistrict,
			exam_centre_id: studentData.examCentre,
		});
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data?.message) {
			throw error.response?.data.message;
		}
		throw "Error adding student";
	}
};

export const getStudentsByCoordinator = async () => {
	try {
		const response = await axiosInstance.get<Array<TemporaryStudent>>(
			"/coordinator/students",
		);
		return response.data;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "Error fetching students";
	}
};

export const payFees = async (amount: number, paymentReceipt: File) => {
	try {
		const f = new FormData();
		f.set("amount", amount.toString());
		f.set("payment_receipt", paymentReceipt);

		const response = await axiosInstance.post("/coordinator/payment", f, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "Error paying fees";
	}
};

export const deleteStudent = async (nic: string) => {
	try {
		const response = await axiosInstance.delete(`/coordinator/students/${nic}`);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data?.message) {
			throw error.response?.data.message;
		}
		throw "Error removing student";
	}
};

export const editStudent = async (
	studentData: z.infer<typeof ManualStudentRegistrationFormSchema>,
) => {
	try {
		const response = await axiosInstance.put(
			`/coordinator/students/${studentData.nic}`,
			{
				nic: studentData.nic,
				full_name: studentData.name,
				school: studentData.school,
				telephone_no: studentData.phone,
				address: studentData.address,
				email: studentData.email,
				gender: studentData.gender,
				stream_id: Number.parseInt(studentData.stream, 10),
				medium: studentData.medium,
				rank_district_id: studentData.rankingDistrict,
				exam_district_id: studentData.examDistrict,
				exam_centre_id: studentData.examCentre,
			},
		);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data?.message) {
			throw error.response?.data.message;
		}
		throw "Error editing student";
	}
};
