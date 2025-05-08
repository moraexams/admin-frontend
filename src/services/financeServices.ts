import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";
import type { FinanceFormData, Transaction } from "../types/finance";

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

export const getTransaction = async (id: string) => {
	return axiosInstance.get(`/transaction/${id}`);
};

export const getTransactions = async (
	page: number,
	itemsPerPage: number,
): Promise<{
	count: number;
	transactions: Array<Transaction>;
}> => {
	try {
		const response = await axiosInstance.get(
			`/transaction?page=${page}&pageSize=${itemsPerPage}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching transactions:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "Only finance team members and superadmins can view transactions.";
			}
		}
		throw error;
	}
};
