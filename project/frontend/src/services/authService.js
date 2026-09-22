import API from './api';

export const register = (data) => API.post('/auth/register', data).then(res => res.data);
export const login = (data) => API.post('/auth/login', data).then(res => res.data);
export const getProfile = () => API.get('/auth/profile').then(res => res.data);
export const updateProfile = (data) => API.put('/auth/profile', data).then(res => res.data);
