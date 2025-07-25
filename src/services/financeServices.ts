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
		const response = await axiosInstance.get<FinanceStats>("/finance/stats");
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
	if (page !== undefined && pageSize !== undefined) {
		return axiosInstance.get(`/bill/all?page=${page}&pageSize=${pageSize}`);
	} else if (page !== undefined) {
		return axiosInstance.get(`/bill/all?pageSize=${pageSize}`);
	} else if (pageSize !== undefined) {
		return axiosInstance.get(`/bill/all?page=${page}`);
	} else {
		return axiosInstance.get(
			`/bill/all?page=${page ?? 1}&pageSize=${pageSize ?? 10}`,
		);
	}
};

export const getAllTransactionCategories = async () => {
	return axiosInstance.get<Array<TransactionCategory>>(
		"/transaction/categories",
	);
};

export const addTransactionCategory = async (name: string) => {
	return axiosInstance.post("/transaction/categories", { name });
};

export const deleteTransactionCategory = async (id: string) => {
	return axiosInstance.delete(`/transaction/categories/${id}`);
};

export const getAllTransactionDistricts = async () => {
	return axiosInstance.get<Array<TransactionCategory>>("/district");
};

export const deleteTransaction = async (id: string) => {
	return axiosInstance.delete(`/transaction/${id}`);
};

export const getDistrictFinanceStats = async (): Promise<
	Array<{
		district: string;
		budget: number;
		expense: number;
		paid: number;
	}>
> => {
	try {
		const response = await axiosInstance.get("/finance/stats/districts");

		const districts = response.data.districts;

		return districts.map((d: any) => ({
			district: d.name,
			budget: d.total_income,
			expense: d.total_expense,
			paid: 0,
		}));
	} catch (error) {
		console.error("Error fetching district finance stats:", error);
		throw error;
	}
};
