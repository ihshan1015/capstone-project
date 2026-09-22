import API from './api';

export const getWishlist = () => API.get('/wishlist').then(res => res.data);
export const addToWishlist = (productId) => API.post('/wishlist', { productId }).then(res => res.data);
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`).then(res => res.data);
