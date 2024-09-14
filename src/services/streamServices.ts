import axiosInstance from "../axiosConfig";

export const getStreams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/stream", {
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