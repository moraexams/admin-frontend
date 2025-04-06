import axiosInstance from "../axiosConfig";

export const addCoordinator = async (
	name: string,
	district_id: number,
	telephone_no: string,
) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.post(
			"/coordinator/add",
			{
				name,
				district_id,
				telephone_no,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		console.log("response", response);
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
) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.put(
			"/coordinator/" + id,
			{
				name,
				telephone_no,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		console.log("response", response);
		return true;
	} catch (error: any) {
		console.error("Error Updating Coordinator:", error);
		throw error.response.data.error;
	}
};

export const deleteCoordinator = async (id: number) => {
	try {
		console.log(id);
		const token = localStorage.getItem("token");
		const response = await axiosInstance.delete("/coordinator/" + id, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log("response", response);
		return true;
	} catch (error: any) {
		console.error("Error Deleting Coordinator:", error);
		throw error.response.data.error;
	}
};
