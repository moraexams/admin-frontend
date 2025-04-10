import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export const startSendingIndexNoEmails = async () => {
	try {
		await axiosInstance.post("/send-index-no");
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "An error occurred while sending index no emails";
	}
};
