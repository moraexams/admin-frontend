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

export const resetTempStudentStatus = async (nic: string) => {
	try {
		const response = await axiosInstance.post(`/temp-student/${nic}/reset`);
		return response.data;
	} catch (error) {
		console.error("Error resetting temp student status:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "Only tech coordinator can reset temp student status.";
			}
			if (error.response) {
				throw error.response.data.message;
			}
		}
		throw error;
	}
};

export const verifyTempStudent = async (nic: string) => {
	try {
		const response = await axiosInstance.post(`/temp-student/${nic}/verify`);
		return response.data;
	} catch (error) {
		console.error("Error verifying temp student:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "Only tech coordinator can verify temp students.";
			}
			if (error.response) {
				throw error.response.data.message;
			}
		}
		throw error;
	}
};

export const rejectTempStudent = async (nic: string, reason: string) => {
	try {
		const response = await axiosInstance.post(`/temp-student/${nic}/reject`, {
			reason,
		});
		return response.data;
	} catch (error) {
		console.error("Error rejecting temp student:", error);
		if (error instanceof AxiosError) {
			if (error.response) {
				throw error.response.data.message;
			}
		}
		throw error;
	}
};

export const recheckTempStudent = async (nic: string, reason: string) => {
	try {
		const response = await axiosInstance.post(`/temp-student/${nic}/recheck`, {
			reason,
		});
		return response.data;
	} catch (error) {
		console.error("Error rechecking temp student:", error);
		if (error instanceof AxiosError) {
			if (error.response) {
				throw error.response.data.message;
			}
		}
		throw error;
	}
};

export const getPendingStudents = async (page: number, itemsPerPage: number) => {
    try {
        const response = await axiosInstance.get(
            `/temp-student/pending?page=${page}&pageSize=${itemsPerPage}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching pending students:", error);
        throw error;
    }
};