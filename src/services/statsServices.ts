import axiosInstance from "../axiosConfig";

export const getStatCounts = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/stats/count", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getStatsByCentre = async (centreId: number) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get(`/stats/centre/${centreId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getStatsStreamWise = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/stats/stream", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error getting stream wise stats:", error);
		throw error;
	}
};

export const getTotalEnteredMarksStats = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/stats/entered/marks/stream", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getEnteredMarksStatsByCentre = async (centreId: number) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get(
			`/stats/entered/marks/stream?exam_centre_id=${centreId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};
