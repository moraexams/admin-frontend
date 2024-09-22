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

export const updateExamCentre = async (
  id: number,
  name: string,
  place: string,
  gender: string,
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put("/centre/" + id, {
      name,
      place,
      gender,
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

export const deleteExamCentre = async (id: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete("/centre/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response);
    return true;
  } catch (error: any) {
    console.error("Error Deleting Centre:", error);
    throw error.response.data.error;
  }
};

export const getCenters = async() => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/centre",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch(error: any) {
    console.error("Error Getting Centres:", error);
   return error;
  }
}