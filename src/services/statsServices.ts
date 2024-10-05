import axiosInstance from "../axiosConfig";

export const getStatCounts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/stats/count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStatsByCentre = async (centreId: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`/stats/centre/${centreId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};