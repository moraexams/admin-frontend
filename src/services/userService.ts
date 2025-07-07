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
		console.error("Error approving user:", error);
		return error;
	}
};
