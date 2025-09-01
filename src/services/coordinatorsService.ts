import axiosInstance from "../axiosConfig";

export const addCoordinator = async (
	name: string,
	district_id: number,
	telephone_no: string,
) => {
	try {
		await axiosInstance.post("/coordinator/add", {
			name,
			district_id,
			telephone_no,
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
	telephone_no: string,
	associated_user_id?: number,
) => {
	try {
		await axiosInstance.put(`/coordinator/${id}`, {
			name,
			telephone_no,
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
