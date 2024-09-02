import axiosInstance from "../axiosConfig";

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    const token = response.data.token;
    const user = response.data.user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);
    return true;
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw error.response.data.error;
  }
};

export const signup = async (name: string, username: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/signup", {
      name,
      username,
      password,
    });
    const message = response.data.message;
    return message;
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw error.response.data.error;
  }
};
