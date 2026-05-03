import API from "./axios.js";

export const getShipmentsApi = () => API.get("/shipping").then(res => res.data.data);
export const createShipmentApi = (data) => API.post("/shipping", data);
export const getCouriersApi = () => API.get("/shipping/couriers").then(res => res.data.data);
export const getShippingStatsApi = () => API.get("/shipping/stats").then(res => res.data.data);
