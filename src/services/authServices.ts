import { ROLE_COORDINATOR } from "@/common/roles";
import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export const LOCAL_STORAGE__TOKEN = "token";
export const LOCAL_STORAGE__USER = "user";
export const LOCAL_STORAGE__USERNAME = "username";
export const LOCAL_STORAGE__ROLE = "role";
export const LOCAL_STORAGE__USER_ID = "user_id";
export const LOCAL_STORAGE_ASSOCIATED_DISTRICT = "associated_district";

export const login = async (username: string, password: string) => {
	try {
		const response = await axiosInstance.post("/auth/login", {
			username,
			password,
		});
		const token = response.data.token;
		const user = response.data.user;
		localStorage.setItem(LOCAL_STORAGE__TOKEN, token);
		localStorage.setItem(LOCAL_STORAGE__USER, JSON.stringify(user));
		localStorage.setItem(LOCAL_STORAGE__USERNAME, user.username);
		localStorage.setItem(LOCAL_STORAGE__ROLE, user.role);
		localStorage.setItem(LOCAL_STORAGE__USER_ID, user.id);

		if (user.role === ROLE_COORDINATOR) {
			localStorage.setItem(
				LOCAL_STORAGE_ASSOCIATED_DISTRICT,
				(user.associated_district as string[]).join(", "),
			);
		}

		return true;
	} catch (error: unknown) {
		console.error("Error logging in:", error);
		if (error instanceof AxiosError) {
			if (error.response?.data?.error) {
				throw error.response.data.error;
			}

			throw error.message;
		}
		throw "Unknown error occurred";
	}
};

export const signup = async (
	name: string,
	username: string,
	password: string,
) => {
	try {
		const response = await axiosInstance.post("/auth/signup", {
			name,
			username,
			password,
		});
		const message = response.data.message;
		return message;
	} catch (error: unknown) {
		console.error("Error logging in:", error);
		if (error instanceof AxiosError) {
			if (error.response?.data?.error) {
				throw error.response.data.error;
			}

			throw error.message;
		}
		throw "Unknown error occurred";
	}
};

export const validateToken = async () => {
	const token = localStorage.getItem("token");
	const response = await axiosInstance.get("/auth/validate", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data.success;
};
