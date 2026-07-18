import { authBus } from "@/lib/authBus";
import { rateLimitBus } from "@/lib/rateLimitBus";
import { LOCAL_STORAGE__TOKEN } from "@/services/authServices";
import axios from "axios";

const AUTH_ENDPOINTS_EXCLUDED_FROM_LOGOUT = ["/auth/login", "/auth/signup"];

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem(LOCAL_STORAGE__TOKEN);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 429) {
			rateLimitBus.emit();
		}

		const url: string = error?.config?.url ?? "";
		const isExemptFromLogout = AUTH_ENDPOINTS_EXCLUDED_FROM_LOGOUT.some(
			(endpoint) => url.includes(endpoint),
		);
		if (error?.response?.status === 401 && !isExemptFromLogout) {
			authBus.emit();
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;