import axiosInstance from "../axiosConfig";

export const getUsers = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/user", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		return error;
	}
};

export const approveUser = async (id: number) => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.put(`/user/approve/${id}`, null, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error approving user:", error);
		return error;
	}
};
