import API from "./axios.js";

export const getOrdersApi = () => API.get("/orders").then(res => res.data.data);
export const getOrderApi = (id) => API.get(`/orders/${id}`).then(res => res.data.data);
export const createOrderApi = (data) => API.post("/orders", data);
export const updateOrderStatusApi = ({ id, status }) => API.patch(`/orders/${id}/status`, { status });
export const deleteOrderApi = (id) => API.delete(`/orders/${id}`);
