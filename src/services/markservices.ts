import axiosInstance from "../axiosConfig";
import type { MarksBoundaries } from "../types/types";

export interface MarksEntryData {
	index_no: string;
	name: string;
	nic: string;
	medium: string;
	marks: number | null;
	entered_by: string | null;
	verified_by: string | null;
}

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
	part: typeof import("../lib/utils").PARTS[number],
) => {
	const response = await axiosInstance.get<MarksEntryData>(
		`/mark/check/${subjectCode}/${part}/${index_no}`,
	);
	return response.data;
};

export const verifyMark = async (
	index_no: string,
	subject: string,
	part: string,
) => {
	const response = await axiosInstance.put(
		`/mark/verify/${subject}/${part}/${index_no}`,
	);
	return response.data;
};

export const enterMark = async (
	index_no: string,
	subject: string,
	part: string,
	marks: number,
) => {
	const response = await axiosInstance.put<MarksEntryData>(
		`/mark/enter/${subject}/${part}/${index_no}`,
		{
			marks,
		},
	);
	return response.data;
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

export const nextStudentForMarksEntry = async (
	index_no: string,
	subject: string,
	part: string,
) => {
	const response = await axiosInstance.get<MarksEntryData>(
		`/mark/next/${subject}/${part}/${index_no}/next`,
	);
	return response.data;
};

export const previousStudentForMarksEntry = async (
	index_no: string,
	subject: string,
	part: string,
) => {
	const response = await axiosInstance.get<MarksEntryData>(
		`/mark/next/${subject}/${part}/${index_no}/previous`,
	);
	return response.data;
};
