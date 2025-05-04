import axiosInstance from "../axiosConfig";

export const getFinanceStats = async () => {
	try {
		const response = await axiosInstance.get("/finance/stats");
		return response.data;
	} catch (error) {
	console.error("Error while fetching finance stats: ", error);
	}
};
