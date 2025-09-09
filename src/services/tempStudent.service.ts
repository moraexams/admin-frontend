import axiosInstance from "@/axiosConfig";
import { AxiosError } from "axios";

export const deleteTempStudent = async (nic: string) => {
	try {
		const response = await axiosInstance.delete(`/temp-student/${nic}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting temp student:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "Only tech coordinator can delete temp students.";
			}
			if (error.response) {
				throw error.response.data.error;
			}
		}
		throw error;
	}
};
