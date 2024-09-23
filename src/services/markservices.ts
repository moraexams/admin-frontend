import axiosInstance from "../axiosConfig";

export const getMarkbyIndexNo = async (index_no:number) => {
    if (index_no>=10000) 
    {try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/mark/"+index_no, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.log("Error fetching mark: ");
        return error;
      }}
}

export const addMarkS1P1 = async (index_no: number, s1_p1: number) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put("/mark/enter/"+index_no, {s1_p1},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response:", response);
          
    } catch (error: any) {
        console.error("Error Updating Mark:", error);
        throw error.response.data.error;
    }
}
export const addMarkS1P2 = async (index_no: number, s1_p2: number) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put("/mark/enter/"+index_no, {s1_p2},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response:", response);
          
    } catch (error: any) {
        console.error("Error Updating Mark:", error);
        throw error.response.data.error;
    }
}
export const addMarkS2P1 = async (index_no: number, s2_p1: number) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put("/mark/enter/"+index_no, {s2_p1},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response:", response);
          
    } catch (error: any) {
        console.error("Error Updating Mark:", error);
        throw error.response.data.error;
    }
}
export const addMarkS2P2 = async (index_no: number, s2_p2: number) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put("/mark/enter/"+index_no, {s2_p2},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response:", response);
          
    } catch (error: any) {
        console.error("Error Updating Mark:", error);
        throw error.response.data.error;
    }
}
export const addMarkS3P1 = async (index_no: number, s3_p1: number) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put("/mark/enter/"+index_no, {s3_p1},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response:", response);
          
    } catch (error: any) {
        console.error("Error Updating Mark:", error);
        throw error.response.data.error;
    }
}
export const addMarkS3P2 = async (index_no: number, s3_p2: number) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put("/mark/enter/"+index_no, {s3_p2},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Response:", response);
          
    } catch (error: any) {
        console.error("Error Updating Mark:", error);
        throw error.response.data.error;
    }
}