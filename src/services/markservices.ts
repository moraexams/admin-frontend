import axiosInstance from "../axiosConfig";

export const getMarkbyIndexNo = async (index_no: number) => {
  if (index_no >= 10000) {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/mark/" + index_no, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching mark: ");
      return error;
    }
  }
};

export const getStudentMarksData = async (index_no: number) => {
  if (index_no >= 100000) {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/mark/check/" + index_no, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching mark: " + error);
      return null;
    }
  }
};

export const enterMark = async (
  index_no: number,
  subject: string,
  part: string,
  marks: number
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(
      "/mark/enter/" + index_no,
      {
        subject,
        part,
        marks,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response);
  } catch (error: any) {
    console.error("Error entering Mark:", error);
    throw error.response.data.error;
  }
};

export const verifyMark = async (index_no: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put("/mark/needtoupdate/" + index_no, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response:", response);
  } catch (error: any) {
    console.error("Error verifying Mark:", error);
    throw error.response.data.error;
  }
};
