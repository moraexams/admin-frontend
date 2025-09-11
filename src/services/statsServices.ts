import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface StatCounts {
	student: number;
	total_student_registrations: number;
	unprocessed_students: number;
	rejected_students: number;
	checked_students: number;
	subject: number;
	district: number;
	stream: number;
	exam_center: number;
	mark: number;
	coordinator: number;
}

export const getStatCounts = async () => {
	const response = await axiosInstance.get<StatCounts>("/stats/count");
	return response.data;
};

export const getStatsByCentre = async (centreId: number) => {
	const response = await axiosInstance.get(`/stats/centre/${centreId}`);
	return response.data;
};

export const getStatsStreamWise = async () => {
	try {
		const response = await axiosInstance.get("/stats/stream");
		return response.data;
	} catch (error) {
		console.error("Error getting stream wise stats:", error);
		throw error;
	}
};

export const getTotalEnteredMarksStats = async () => {
	const response = await axiosInstance.get("/stats/entered/marks/stream");
	return response.data;
};

export const getEnteredMarksStatsByCentre = async (centreId: number) => {
	const response = await axiosInstance.get(
		`/stats/entered/marks/stream?exam_centre_id=${centreId}`,
	);
	return response.data;
};

export interface DistrictWiseTempStudentCount {
	id: number;
	name: string;
	student_count: number;
}

export const getDistrictWiseTempStudentCounts = async () => {
	try {
		const response = await axiosInstance.get<{
			districts: Array<DistrictWiseTempStudentCount>;
		}>("/stats/student-registrations/district-wise");
		return response.data;
	} catch (error) {
		console.error("Error getting district wise temp student counts:", error);
		if (error instanceof AxiosError && error.response) {
			throw error.response.data.message;
		}
		throw error;
	}
};
