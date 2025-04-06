import axiosInstance from "../axiosConfig";

export const getDistributions = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/district/distribution", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching distributions:", error);
		return error;
	}
};
