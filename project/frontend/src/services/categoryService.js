import API from './api';

export const getCategories = () => API.get('/categories').then(res => res.data.data);
export const getCategory = (id) => API.get(`/categories/${id}`).then(res => res.data);
export const createCategory = (data) => API.post('/categories', data).then(res => res.data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data).then(res => res.data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`).then(res => res.data);
