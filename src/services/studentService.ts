import type { TemporaryStudent } from "@/types/manual-admissions";
import type { Student } from "@/types/types";
import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export const addStudent = async (
	name: string,
	stream_id: number,
	medium: string,
	rank_district_id: number,
	exam_district_id: number,
	exam_centre_id: number,
	nic: string,
	gender: string,
	email: string,
	telephone_no: string,
	school: string,
	address: string,
	/* reg_by:string,
    reg_date:string,
    checked_by:number,
    checked_at:string,
    created_at: string, */ //can get this data in backend??
) => {
	try {
		const token = localStorage.getItem("token");
		name = name.trim().toUpperCase();
		school = school.trim().toUpperCase();
		address = address.trim().toUpperCase();
		const response = await axiosInstance.post(
			"/student/add",
			{
				name,
				stream_id,
				medium,
				rank_district_id,
				exam_district_id,
				exam_centre_id,
				nic,
				gender,
				email,
				telephone_no,
				school,
				address,
				/*  reg_by,
        reg_date,
        checked_by,
        checked_at,
        created_at, */
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		console.log("response", response);
		return true;
	} catch (error) {
		console.error("Error Adding Student:", error);
		if (error instanceof AxiosError && error.response) {
			throw error.response.data.error;
		}
	}
};

export const updateStudent = async (
	index_no: number,
	name: string,
	stream_id: number,
	medium: string,
	rank_district_id: number,
	exam_district_id: number,
	exam_centre_id: number,
	nic: string,
	gender: string,
	email: string,
	telephone_no: string,
	school: string,
	address: string,
	checked_by_id: number,
	/*  reg_by:string,
    reg_date:string,
    
    checked_at:string,
    created_at: string, */
) => {
	try {
		name = name.trim().toUpperCase();
		school = school.trim().toUpperCase();
		address = address.trim().toUpperCase();
		console.log(`Sending ID: ${exam_centre_id}`);
		const response = await axiosInstance.put(`/student/${index_no}`, {
			name,
			stream_id,
			medium,
			rank_district_id,
			exam_district_id,
			exam_centre_id,
			nic,
			gender,
			email,
			telephone_no,
			school,
			address,
			checked_by_id,
			/*  reg_by,
            reg_date,
            checked_by,
            checked_at,
            created_at, */
		});
		return response.data;
	} catch (error) {
		console.error("Error Updating Student:", error);
		if (error instanceof AxiosError && error.response) {
			throw error.response.data.error;
		}
	}
};
//need to give permission only to admin
export const deleteStudent = async (index_no: number) => {
	try {
		const response = await axiosInstance.delete(`/student/${index_no}`);
		console.log("response", response);
		return true;
	} catch (error) {
		console.error("Error Deleting Student:", error);
		if (error instanceof AxiosError && error.response) {
			throw error.response.data.error;
		}
	}
};

export const getStudents = async (page: number, itemsPerPage: number) => {
	try {
		const response = await axiosInstance.get(
			`/student?page=${page}&pageSize=${itemsPerPage}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching Students: ", error);
		throw error;
	}
};

/**
 * @param {string | undefined} sortParam if provided, must start with a '&'
 */
export const getUnverifiedStudents = async (
	page: number,
	itemsPerPage: number,
	sortParam = "",
	searchParam = "",
) => {
	try {
		const response = await axiosInstance.get<{
			count: number;
			unverified_students: Array<TemporaryStudent>;
		}>(
			`/student/unverified?page=${page}&pageSize=${itemsPerPage}${sortParam}${searchParam}`,
		);
		return response.data;
	} catch (error) {
		console.log("Error fetching Students: ");
		throw error;
	}
};

export const getStudentsByCentre = async (centre_id: number) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get(
			`/student/filter?exam_centre_id=${centre_id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		console.log("Error fetching Students: ");
		return error;
	}
};

export const verifyStudent = async (index_no: number) => {
	try {
		const response = await axiosInstance.put(`/student/verify/${index_no}`, {
			index_no,
		});
		return response.data;
	} catch (error) {
		console.error("Error Verifying Student:", error);
		if (error instanceof AxiosError && error.response) {
			throw error.response.data.error;
		}
	}
};

export const getStudentbyIndex = async (index_no: number) => {
	if (index_no >= 110000) {
		try {
			const token = localStorage.getItem("token");
			const response = await axiosInstance.get(`/student/${index_no}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error) {
			console.log("Error fetching Students: ");
			return { error: "Student Does not exist!" };
		}
	} else {
		return { error: "Invalid Index No!" };
	}
};

export const getStudentforCheck = async (id: number) => {
	try {
		const response = await axiosInstance.get(`/student/check/${id}`);
		return response.data;
	} catch (error) {
		console.log("Error fetching Students: ");
		return error;
	}
};

export const getStudentMarksByCentre = async (
	centre_id: number,
	stream_id: number,
) => {
	try {
		const response = await axiosInstance.get(
			`/student/marks/filter?exam_centre_id=${centre_id}${
				stream_id !== -1 && `&stream_id=${stream_id}`
			}`,
		);
		return response.data;
	} catch (error) {
		console.log("Error fetching students: ");
		return error;
	}
};

export const getVerifiedStudents = async (
	page: number,
	itemsPerPage: number,
) => {
	try {
		const response = await axiosInstance.get<{
			count: number;
			students: Array<Student>;
		}>(`/student?page=${page}&pageSize=${itemsPerPage}`);
		return response.data;
	} catch (error) {
		console.log("Error fetching students: ");
		throw error;
	}
};

export const getRejectedStudents = async (
	page: number,
	itemsPerPage: number,
	searchParam = ""
) => {
	try {
		const response = await axiosInstance.get<{
			count: number;
			students: Array<TemporaryStudent>;
		}>(`/temp-student/rejected?page=${page}&pageSize=${itemsPerPage}${searchParam}`);
		return response.data;
	} catch (error) {
		console.log("Error fetching students: ", error);
		throw error;
	}
};
