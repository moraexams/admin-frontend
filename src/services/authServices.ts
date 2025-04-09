import { AxiosError } from "axios";
import axiosInstance from "../axiosConfig";

export const login = async (username: string, password: string) => {
	try {
		const response = await axiosInstance.post("/auth/login", {
			username,
			password,
		});
		const token = response.data.token;
		const user = response.data.user;
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("username", user.username);
		localStorage.setItem("role", user.role);
		localStorage.setItem("user_id", user.id);
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
