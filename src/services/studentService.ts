import axiosInstance from "../axiosConfig";

export const addStudent = async (
    name:string,
    stream_id:number,
    medium:string,
    rank_district_id:number,
    exam_district_id:number,
    centre_id: number,
    nic:string,
    gender:string,
    email:string,
    phone:string,
    /* reg_by:string,
    reg_date:string,
    checked_by:number,
    checked_at:string,
    created_at: string, */ //can get this data in backend??
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/student/add", {
        name,
        stream_id,
        medium,
        rank_district_id,
        exam_district_id,
        centre_id,
        nic,
        gender,
        email,
        phone,
       /*  reg_by,
        reg_date,
        checked_by,
        checked_at,
        created_at, */
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response);
    return true;
  } catch (error: any) {
    console.error("Error Adding Student:", error);
    throw error.response.data.error;
  }
};

export const updateStudent = async (
    index_no:number,
    name:string,
    stream_id:number,
    medium:string,
    rank_district_id:number,
    exam_district_id:number,
    centre_id: number,
    nic:string,
    gender:string,
    email:string,
    phone:string,
   /*  reg_by:string,
    reg_date:string,
    checked_by:number,
    checked_at:string,
    created_at: string, */
) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.put("/student"+index_no,{
            name,
            stream_id,
            medium,
            rank_district_id,
            exam_district_id,
            centre_id,
            nic,
            gender,
            email,
            phone,
           /*  reg_by,
            reg_date,
            checked_by,
            checked_at,
            created_at, */
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response", response);
    } catch(err: any) {
        console.error("Error Updating Student:", err);
        throw err.response.data.error;
    }
};
//need to give permission only to admin
export const deleteStudent = async (index_no: number) => {
    try {
      console.log(index_no);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete("/student/" + index_no, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response);
      return true;
    } catch (error: any) {
      console.error("Error Deleting Student:", error);
      throw error.response.data.error;
    }
  };

  export const getStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/students",{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching Students: ");
      return error;
    }
  }