import axiosInstance from "../axiosConfig";
import type { FinanceFormData } from "../types/financeIndex";

export const getFinanceStats = async () => {
	try {
		const response = await axiosInstance.get("/finance/stats");
		return response.data;
	} catch (error) {
	console.error("Error while fetching finance stats: ", error);
	}
};

export const addTransaction = async (data: FinanceFormData) => {
  return axiosInstance.post("/transaction/add", data);
};
