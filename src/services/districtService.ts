import axiosInstance from "../axiosConfig";

export const getDistrictsOverview = async () => {
	try {
		const response = await axiosInstance.get("/district/overview");
		return response.data;
	} catch (error) {
		console.error("Error fetching districts overview:", error);
		return error;
	}
};

export const getDistricts = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/district", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching districts:", error);
		return error;
	}
};

export const getDistrictsWithCentres = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/district/centres", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching districts:", error);
		return error;
	}
};

export const getDistrictsWithCoordinators = async () => {
	try {
		const token = localStorage.getItem("token");
		const response = await axiosInstance.get("/district/coordinators", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching districts:", error);
		return error;
	}
};
