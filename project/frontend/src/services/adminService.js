import API from './api';

export const getDashboard = () => API.get('/admin/dashboard').then(res => res.data);
export const getUsers = (params) => API.get('/admin/users', { params }).then(res => res.data);
export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data).then(res => res.data);
export const getReviews = () => API.get('/admin/reviews').then(res => res.data);
export const deleteReview = (id) => API.delete(`/admin/reviews/${id}`).then(res => res.data);
