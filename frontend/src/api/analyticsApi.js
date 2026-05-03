import API from "./axios.js";

export const getSummaryApi = () => API.get("/analytics/summary").then(res => res.data);
export const getTopProductsApi = (limit = 5) => API.get(`/analytics/top-products?limit=${limit}`).then(res => res.data);
export const getByStatusApi = () => API.get("/analytics/orders-by-status").then(res => res.data);
export const getByChannelApi = () => API.get("/analytics/orders-by-channel").then(res => res.data);

