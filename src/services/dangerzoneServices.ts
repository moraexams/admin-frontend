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

export const dangerZonePageData = async () => {
	try {
		const response = await axiosInstance.get("/constants/danger-zone");
		return response.data;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "An error occurred while fetching danger zone data";
	}
};

export const updateRegistrationClosingDate = async (
	registrationClosingAt: string,
) => {
	try {
		const response = await axiosInstance.put(
			"/constants/student-registration-closing-date",
			{
				registration_closing_at: registrationClosingAt,
			},
		);
		return response.data;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "An error occurred while updating registration closing datetime";
	}
};