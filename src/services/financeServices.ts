import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";
import type {
	FinanceFormData,
	FinanceStats,
	SelectedFile,
	Transaction,
	TransactionCategory,
} from "../types/finance";

export const getFinanceStats = async () => {
	try {
		const response = await axiosInstance.get("/finance/stats");
		return response.data;
	} catch (error) {
		console.error("Error while fetching finance stats: ", error);
	}
};

export const addTransaction = async (data: FinanceFormData) => {
	return axiosInstance.post("/transaction/add", data).catch((error) => {
		if (error instanceof AxiosError) {
			if (error.response) {
				throw error.response.data.error;
			}
		}
		throw error;
	});
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

export const addBillToTransaction = async (
	transactionId: string,
	billFiles: Array<SelectedFile>,
) => {
	const n = new FormData();
	n.set("transactionId", transactionId);
	for (const f of billFiles) {
		n.append("billFiles[]", f.baseFile);
		n.append("billDescriptions[]", f.description);
	}

	return axiosInstance.post("/bill", n, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const getAllBills = async (page?: number, pageSize?: number) => {
	return axiosInstance.get("/bill/all");
};

export const getAllTransactionCategories = async () => {
	return axiosInstance.get<Array<TransactionCategory>>(
		"/transaction/categories",
	);
};

export const getAllTransactionDistricts = async () => {
  return axiosInstance.get<Array<TransactionCategory>>(
    "/district"
  );
};

export const deleteTransaction = async (id: string) => {
	return axiosInstance.delete(`/transaction/${id}`);
};
