import { AxiosError } from "axios";
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
