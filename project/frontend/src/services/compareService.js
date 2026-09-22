import API from './api';

export const getCompare = () => API.get('/compare').then(res => res.data);
export const addToCompare = (productId) => API.post('/compare', { productId }).then(res => res.data);
export const removeFromCompare = (productId) => API.delete(`/compare/${productId}`).then(res => res.data);
export const clearCompare = () => API.delete('/compare').then(res => res.data);
