import type { PARTS } from "@/lib/utils";
import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export interface StatCounts {
	student: number;
	total_student_registrations: number;
	pending_student_registrations: number;
	verified_students: number;
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

interface CentreWiseStreamCount {
	stream_id: number;
	stream_name: string;
	male_count: number;
	female_count: number;
	total_count: number;
}

export interface CentreWiseStats {
	counts: Array<CentreWiseStreamCount>;
	total_female: number;
	total_male: number;
}
export const getStatsByCentre = async (centreId: number) => {
	const response = await axiosInstance.get<CentreWiseStats>(
		`/stats/centre/${centreId}`,
	);
	return response.data;
};

interface StreamWiseCount {
	stream_id: number;
	stream_name: string;
	tamil_count: number;
	english_count: number;
	total_count: number;
}

export interface StreamWiseStats {
	counts: StreamWiseCount[];
	total_english: number;
	total_tamil: number;
}

export const getStatsStreamWise = async () => {
	try {
		const response = await axiosInstance.get<StreamWiseStats>("/stats/stream");
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

export interface CentreWiseTempStudentCount {
	id: number;
	name: string;
	count_total: number;
	count_male: number;
	count_female: number;
	count_tamil: number;
	count_english: number;
	count_online: number;
	count_through_coordinators: number;
	district_name: string;
}

export const getCentreWiseTempStudentCounts = async () => {
	try {
		const response = await axiosInstance.get<{
			centres: Array<CentreWiseTempStudentCount>;
		}>("/stats/student-registrations/centre-wise");
		return response.data;
	} catch (error) {
		console.error("Error getting centre wise temp student counts:", error);
		if (error instanceof AxiosError && error.response) {
			throw error.response.data.message;
		}
		throw error;
	}
};

export interface CentreWiseVerifiedStudentsCount {
	id: number;
	name: string;
	count_total: number;
	count_tm: number;
	count_em: number;
	count_tm_male: number;
	count_tm_female: number;
	count_em_male: number;
	count_em_female: number;
	district_name: string;
}

export const getCentreWiseStudentsPerSubject = async (subjectId: number) => {
	try {
		const response = await axiosInstance.get<{
			centres: Array<CentreWiseVerifiedStudentsCount>;
		}>(`/stats/students/centre-wise/${subjectId}`);
		return response.data;
	} catch (error) {
		console.error("Error getting centre wise student counts:", error);
		if (error instanceof AxiosError && error.response) {
			throw error.response.data.message;
		}
		throw error;
	}
};

export interface SubjectPartMarksStats {
	total_entered: number;
	total_verified: number;
}

export const getSubjectPartMarksStats = async (
	subjectId: number,
	part: (typeof PARTS)[number],
) => {
	const response = await axiosInstance.get<SubjectPartMarksStats>(
		`/stats/marks/${subjectId}/${part}`,
	);
	return response.data;
};

export interface OverallMarksStats {
	subjects: Array<{
		subject_id: number;
		subject: string;
		total_count: number;
		part1: SubjectPartMarksStats;
		part2: SubjectPartMarksStats;
	}>;
}

export const getOverallMarksStats = async () => {
	const response = await axiosInstance.get<OverallMarksStats>(
		"/stats/marks/overall",
	);
	return response.data;
};

export interface MarksStatsForCentre {
	id: string;
	name: string;
	total_students: number;
	total_entered: number;
	total_verified: number;
}

export interface CentreWiseMarksStats {
	exam_centres: Array<MarksStatsForCentre>;
}

export const getCentreWiseMarksStats = async (subjectId: number) => {
	const response = await axiosInstance.get<CentreWiseMarksStats>(
		`/stats/marks/centre-wise/${subjectId}`,
	);
	return response.data;
};
