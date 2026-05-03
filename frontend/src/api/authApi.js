import API from "./axios.js";

export const loginApi = (data) => API.post("/auth/login", data);
export const registerApi = (data) => API.post("/auth/register", data);
export const profileApi = () => API.get("/auth/profile").then((res) => res.data.data);
export const logoutApi = () => {
  localStorage.removeItem("token");
};
