import API from './api';

export const getProductReviews = (productId) => API.get(`/products/${productId}/reviews`).then(res => res.data);
export const createReview = (productId, data) => API.post(`/products/${productId}/reviews`, data).then(res => res.data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data).then(res => res.data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`).then(res => res.data);
