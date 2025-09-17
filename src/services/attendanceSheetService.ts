import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export const generateAttendanceSheetPDFs = async () => {
	try {
		const response = await axiosInstance.get("/attendance-sheet/generate");
		return response.data;
	} catch (error) {
		console.log(error);
		if (error instanceof AxiosError) {
			if (error.response?.data) {
				throw new Error(error.response?.data.message);
			}
		}
		throw "An error occurred while generating attendance sheets";
	}
};

export const downloadAttendanceSheets = async (subjectId: string) => {
	try {
		const response = await axiosInstance.get(
			`/attendance-sheet/${subjectId}/download`,
			{
				responseType: "blob",
			},
		);

		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`Mora Exams 2025 - Attendance Sheets - ${subjectId}.zip`,
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
		throw "An error occurred while downloading attendance sheet zip file";
	}
};
