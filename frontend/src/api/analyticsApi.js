import API from "./axios.js";

export const getDashboardStatsApi = () => API.get("/analytics/dashboard").then(res => res.data.data);
export const getSalesOverviewApi = (range) => API.get("/analytics/sales", { params: { range } }).then(res => res.data.data);
export const getTopProductsApi = () => API.get("/analytics/top-products").then(res => res.data.data);
