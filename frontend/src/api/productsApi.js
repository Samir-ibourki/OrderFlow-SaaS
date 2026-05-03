import API from "./axios.js";

export const getProductsApi = () => API.get("/products").then(res => res.data.data);
export const getProductApi = (id) => API.get(`/products/${id}`).then(res => res.data.data);
export const createProductApi = (data) => API.post("/products", data);
export const updateProductApi = ({ id, data }) => API.put(`/products/${id}`, data);
export const deleteProductApi = (id) => API.delete(`/products/${id}`);
