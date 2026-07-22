import type { Coordinator } from "@/types/types";
import axiosInstance from "../axiosConfig";

export const addCoordinator = async (
	name: string,
	district_id: number,
	telephone_no: string,
	associated_user_id?: number,
) => {
	try {
		const response = await axiosInstance.post("/coordinator/add", {
			name,
			district_id,
			telephone_no,
			associated_user_id,
		});
		return response.data;
	} catch (error: any) {
		console.error("Error Adding Coordinator:", error);
		throw error.response.data.error;
	}
};

export const updateCoordinator = async (
  id: number,
  name: string,
  associated_user_id: number | null,
  contact?: string,
) => {
  try {
    await axiosInstance.put(`/coordinator/${id}`, {
      name,
      associated_user_id,
      contact,
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

export const getCoordinatorCentres = async (coordinatorId: number) => {
	try {
		const response = await axiosInstance.get<{ centre_ids: number[] }>(
			`/coordinator/${coordinatorId}/centres`,
		);
		return response.data.centre_ids ?? [];
	} catch (error: any) {
		console.error("Error fetching coordinator centres:", error);
		throw error.response?.data?.error ?? "Failed to fetch centres";
	}
};

export const assignCentresToCoordinator = async (
	coordinatorId: number,
	centreIds: number[],
) => {
	try {
		await axiosInstance.put(`/coordinator/${coordinatorId}/centres`, {
			centre_ids: centreIds,
		});
		return true;
	} catch (error: any) {
		console.error("Error assigning centres:", error);
		throw error.response?.data?.error ?? "Failed to assign centres";
	}
};