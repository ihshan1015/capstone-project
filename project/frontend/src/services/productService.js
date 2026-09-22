import API from './api';

export const getProducts = (params) => API.get('/products', { params }).then(res => res.data.data);
export const getProduct = (id) => API.get(`/products/${id}`).then(res => res.data);
export const getFeatured = () => API.get('/products/featured').then(res => res.data);
export const getPopular = () => API.get('/products/popular').then(res => res.data);
export const getBudget = () => API.get('/products/budget').then(res => res.data);
export const getBestRated = () => API.get('/products/best-rated').then(res => res.data);
export const createProduct = (data) => API.post('/products', data).then(res => res.data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data).then(res => res.data);
export const deleteProduct = (id) => API.delete(`/products/${id}`).then(res => res.data);

