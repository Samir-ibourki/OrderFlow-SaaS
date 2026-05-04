import API from "./axios.js";

export const getOrdersApi = () => API.get("/orders").then(res => res.data);
export const getOrderApi = (id) => API.get(`/orders/${id}`).then(res => res.data);
export const createOrderApi = (data) => API.post("/orders", data).then(res => res.data);
export const updateOrderStatusApi = ({ id, status }) => API.patch(`/orders/${id}`, { status }).then(res => res.data);
export const parseOrderApi = (message) => API.post("/orders/parse", { message }).then(res => res.data);
export const deleteOrderApi = (id) => API.delete(`/orders/${id}`);

