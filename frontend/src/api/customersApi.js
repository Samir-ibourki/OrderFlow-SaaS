import API from "./axios.js";

export const getCustomersApi = () => API.get("/customers").then(res => res.data);
export const createCustomerApi = (data) => API.post("/customers", data).then(res => res.data);
export const getCustomerApi = (id) => API.get(`/customers/${id}`).then(res => res.data);
export const getCustomerStatsApi = () => API.get("/customers/stats").then(res => res.data);

