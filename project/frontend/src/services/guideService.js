import API from './api';

export const getGuides = () => API.get('/guides').then(res => res.data);
export const getGuide = (id) => API.get(`/guides/${id}`).then(res => res.data);
export const createGuide = (data) => API.post('/guides', data).then(res => res.data);
export const updateGuide = (id, data) => API.put(`/guides/${id}`, data).then(res => res.data);
export const deleteGuide = (id) => API.delete(`/guides/${id}`).then(res => res.data);
