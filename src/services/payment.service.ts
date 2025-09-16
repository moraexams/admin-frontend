import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";
import type { CoordinatorPayment } from "../types/types";

export const getCoordinatorPayments = async (
	page: number,
	itemsPerPage: number,
): Promise<{
	coordinator_payments: Array<CoordinatorPayment>;
	count: number;
}> => {
	try {
		const response = await axiosInstance.get(
			`/coordinator/payments?page=${page}&pageSize=${itemsPerPage}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching coordinator payments:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "You don't have access to view the coordinators' payments.";
			}
		}
		throw error;
	}
};

export const verifyCoordinatorPayment = async (paymentId: number) => {
	try {
		const response = await axiosInstance.post(
			`/coordinator/payment/${paymentId}/verify`,
		);
		return response.data;
	} catch (error) {
		console.error("Error verifying payment", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "You don't have access to verify the coordinators' payments.";
			}
		}
		throw error;
	}
};
