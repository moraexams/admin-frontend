import axiosInstance from "../axiosConfig";

export interface StatCounts {
	student: number;
	temporary_students: number;
	user: number;
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
