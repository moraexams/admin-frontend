import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";
import type { User } from "../types/types";

interface UsersResponse {
	users: User[];
	count: number;
}

export const getUsers = async (
	page: number,
	itemsPerPage: number,
): Promise<UsersResponse> => {
	try {
		const response = await axiosInstance.get(
			`/user?page=${page}&pageSize=${itemsPerPage}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "Only admins can view users.";
			}
		}
		throw error;
	}
};
export const editUser = async (user: User) => {
	try {
		const response = await axiosInstance.put(`/user/${user.id}`, user);
		return response.data;
	} catch (error) {
		console.error("Error editing users:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "Only tech coordinator can edit users.";
			}
			if (error.response) {
				throw error.response.data.error;
			}
		}
		throw error;
	}
};

export const deleteUser = async (userId: number) => {
	try {
		const response = await axiosInstance.delete(`/user/${userId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting user:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "Only tech coordinator can delete users.";
			}
			if (error.response) {
				throw error.response.data.error;
			}
		}
		throw error;
	}
};

export interface DistrictOrganizer {
	id: number;
	username: string;
}

export const getDistrictOrganizers = async () => {
	try {
		const response =
			await axiosInstance.get<Array<DistrictOrganizer>>("/user/coordinators");
		return response.data;
	} catch (error) {
		console.error("Error fetching unassigned coordinators:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "You don't have permission to view unassigned coordinators.";
			}
		}
		throw error;
	}
};

export const requestPasswordReset = async (userId: number) => {
	try {
		const response = await axiosInstance.post<{ reset_id: string }>(
			`/user/${userId}/password-reset`,
		);
		return response.data;
	} catch (error) {
		console.error("Error requesting password reset:", error);
		if (error instanceof AxiosError) {
			if (error.status === 403) {
				throw "You don't have permission to request password reset.";
			}
			if (error.response) {
				throw error.response.data.error;
			}
		}
		throw error;
	}
};
