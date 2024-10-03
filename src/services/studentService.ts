import axiosInstance from "../axiosConfig";

export const addStudent = async (
  index_no: number,
  name: string,
  stream_id: number,
  medium: string,
  rank_district_id: number,
  exam_district_id: number,
  exam_centre_id: number,
  nic: string,
  gender: string,
  email: string,
  telephone_no: string,
  school: string,
  address: string
  /* reg_by:string,
    reg_date:string,
    checked_by:number,
    checked_at:string,
    created_at: string, */ //can get this data in backend??
) => {
  try {
    const token = localStorage.getItem("token");
    name = name.trim().toUpperCase();
    school = school.trim().toUpperCase();
    address = address.trim().toUpperCase();
    const response = await axiosInstance.post(
      "/student/add",
      {
        index_no,
        name,
        stream_id,
        medium,
        rank_district_id,
        exam_district_id,
        exam_centre_id,
        nic,
        gender,
        email,
        telephone_no,
        school,
        address,
        /*  reg_by,
        reg_date,
        checked_by,
        checked_at,
        created_at, */
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response", response);
    return true;
  } catch (error: any) {
    console.error("Error Adding Student:", error);
    throw error.response.data.error;
  }
};

export const updateStudent = async (
  index_no: number,
  name: string,
  stream_id: number,
  medium: string,
  rank_district_id: number,
  exam_district_id: number,
  exam_centre_id: number,
  nic: string,
  gender: string,
  email: string,
  telephone_no: string,
  school: string,
  address: string,
  checked_by_id: number
  /*  reg_by:string,
    reg_date:string,
    
    checked_at:string,
    created_at: string, */
) => {
  try {
    const token = localStorage.getItem("token");
    name = name.trim().toUpperCase();
    school = school.trim().toUpperCase();
    address = address.trim().toUpperCase();
    console.log("Sending ID: " + exam_centre_id)
    const response = await axiosInstance.put(
      "/student/" + index_no,
      {
        name,
        stream_id,
        medium,
        rank_district_id,
        exam_district_id,
        exam_centre_id,
        nic,
        gender,
        email,
        telephone_no,
        school,
        address,
        checked_by_id,
        /*  reg_by,
            reg_date,
            checked_by,
            checked_at,
            created_at, */
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
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
    const response = await axiosInstance.get("/student", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching Students: ");
    return error;
  }
};

export const getUnVerifiedStudents = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/student/unverified", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching Students: ");
    return error;
  }
};

export const getStudentsByCentre = async (centre_id: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/student/filter?exam_centre_id=" + centre_id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching Students: ");
    return error;
  }
};

export const verifyStudent = async (index_no: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(
      "/student/verify/" + index_no,
      {
        index_no,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error Verifying Student:", error);
    throw error.response.data.error;
  } 
};

export const getStudentbyIndex = async (index_no: number) => {
  if (index_no>=10000) {
    try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/student/"+index_no, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching Students: ");
    return {name: "Student Does not exist!"};
  }
} else {
  return {name: "Invalid Index No!"};
}
}