import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";
import type { MarksBoundaries } from "../types/types";

export const getMarkbyIndexNo = async (index_no: number) => {
	if (index_no >= 10000) {
		try {
			const response = await axiosInstance.get(`/mark/${index_no}`);
			return response.data;
		} catch (error) {
			console.log("Error fetching mark: ");
			return null;
		}
	}
};

export const getStudentMarksData = async (
	index_no: string,
	subjectCode: string,
) => {
	const response = await axiosInstance.get(
		`/mark/check/${subjectCode}/${index_no}`,
	);
	return response.data;
};

export const getStudentVerificationMarksData = async (
	index_no: number,
	subject: string,
	part: string,
) => {
	if (index_no >= 110000) {
		try {
			const response = await axiosInstance.get(
				`/mark/verify/${index_no}?subject=${subject}_${part}`,
			);
			return response.data;
		} catch (error) {
			console.log(`Error fetching mark: ${error}`);
			return null;
		}
	}
};

export const verifyMark = async (
	index_no: number,
	subject: string,
	part: string,
) => {
	if (index_no >= 110000) {
		try {
			const response = await axiosInstance.put(
				`/mark/verify/${index_no}?subject=${subject}_${part}`,
				{},
			);
			return response.data;
		} catch (error) {
			console.log(`Error verifying mark: ${error}`);
			return null;
		}
	}
};

export const enterMark = async (
	index_no: string,
	subject: string,
	part: string,
	marks: number,
) => {
	try {
		const response = await axiosInstance.put(
			`/mark/enter/${subject}/${part}/${index_no}`,
			{
				marks,
			},
		);
		console.log("Response:", response);
	} catch (error) {
		if (error instanceof AxiosError) {
			if (error.response) {
				throw error.response.data.error;
			}
		}
		throw "Unknown error occurred";
	}
};

export const getAllMarksBoundaries = async () => {
	try {
		const response = await axiosInstance.get("/marks-boundaries/all");
		return response.data;
	} catch (error) {
		console.log(`Error fetching mark boundaries: ${error}`);
		return null;
	}
};

export const updateBoundaryValues = async (values: Array<MarksBoundaries>) => {
	try {
		const response = await axiosInstance.put(
			"/marks-boundaries/update",
			values,
		);
		return response.data;
	} catch (error) {
		console.log(`Error updating mark boundaries: ${error}`);
		return null;
	}
};
