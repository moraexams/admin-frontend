import type {
	ManualStudentRegistrationFormSchema,
	TemporaryStudent,
} from "@/types/manual-admissions";
import { AxiosError } from "axios";
import type z from "zod";
import axiosInstance from "../axiosConfig";
import { LOCAL_STORAGE__USER_ID } from "./authServices";

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
}

export const getStudentRegistrationDetails = async () => {
	try {
		const response = await axiosInstance.get<StudentRegistrationDetails>(
			"/student-registration/details",
		);
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

export const addStudentManually = async (
	studentData: z.infer<typeof ManualStudentRegistrationFormSchema>,
) => {
	try {
		const response = await axiosInstance.post("/coordinator/add-student", {
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
		});
		return response.data;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "Error adding student";
	}
};

export const getStudentsByCoordinator = async () => {
	const coordinatorId = localStorage.getItem(LOCAL_STORAGE__USER_ID);
	if (!coordinatorId) {
		return [];
	}

	try {
		const response = await axiosInstance.get<Array<TemporaryStudent>>(
			`/coordinator/${coordinatorId}/students`,
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
