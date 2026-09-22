import API from './api';

export const getRecommendations = (data) => API.post('/recommendations', data).then(res => res.data);
