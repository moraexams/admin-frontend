import axiosInstance from "../axiosConfig";

export const addPaperCount = async (
  subject: string,
  part: number,
  medium: string,
  count: number,
  centre_id: number,
  district_id: number
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/centre/add", {
      subject,
      part,
      medium,
      count,
      centre_id,
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

export const updatePaperCount = async (
  subject: string,
  part: number,
  medium: string,
  count: number,
  centre_id: number,
  district_id: number
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put("/centre/" + district_id, {
      subject,
      part,
      medium,
      count,
      centre_id,
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

export const deletePaperCount = async (id: number) => {
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