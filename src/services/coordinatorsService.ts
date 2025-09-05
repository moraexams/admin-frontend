import type { Coordinator } from "@/types/types";
import axiosInstance from "../axiosConfig";

export const addCoordinator = async (
	name: string,
	district_id: number,
	telephone_no: string,
	associated_user_id?: number,
) => {
	try {
		await axiosInstance.post("/coordinator/add", {
			name,
			district_id,
			telephone_no,
			associated_user_id,
		});
		return true;
	} catch (error: any) {
		console.error("Error Adding Coordinator:", error);
		throw error.response.data.error;
	}
};

export const updateCoordinator = async (
	id: number,
	name: string,
	associated_user_id: number | null,
) => {
	try {
		await axiosInstance.put(`/coordinator/${id}`, {
			name,
			associated_user_id,
		});
		return true;
	} catch (error: any) {
		console.error("Error Updating Coordinator:", error);
		throw error.response.data.error;
	}
};

export const deleteCoordinator = async (id: number) => {
	try {
		await axiosInstance.delete("/coordinator/" + id);
		return true;
	} catch (error: any) {
		console.error("Error Deleting Coordinator:", error);
		throw error.response.data.error;
	}
};

export const getAllCoordinators = async () => {
	try {
		const response = await axiosInstance.get<Array<Coordinator>>(
			"/coordinator/overview",
		);
		return response.data;
	} catch (error: any) {
		console.error("Error fetching coordinators:", error);
		throw error.response.data.error;
	}
};
