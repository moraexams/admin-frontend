import axiosInstance from "@/axiosConfig";
import { AxiosError } from "axios";

export const downloadCentreWiseNameList = async () => {
	try {
		const response = await axiosInstance.get("/student-name-list/centre-wise", {
			responseType: "blob",
		});

		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`Mora Exams 2025 - Centre-Wise Name List.zip`,
		);
		document.body.appendChild(link);
		link.click();
		link.remove();

		return true;
	} catch (error) {
		console.log(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "An error occurred while downloading centre-wise name list";
	}
};
