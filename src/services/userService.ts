import axiosInstance from "../axiosConfig";

export const getUsers = async () => {
	try {
		const response = await axiosInstance.get("/user");
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		return error;
	}
};

export const approveUser = async (id: number) => {
	try {
		const response = await axiosInstance.put(`/user/approve/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error approving user:", error);
		return error;
	}
};
