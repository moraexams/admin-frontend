import axiosInstance from "../axiosConfig";

export const addExamCentre = async (
  name: string,
  place: string,
  gender: string,
  district_id: number
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/centre/add", {
      name,
      place,
      gender,
      district_id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response);
    return true;
  } catch (error: any) {
    console.error("Error Adding Centre:", error);
    throw error.response.data.error;
  }
};
