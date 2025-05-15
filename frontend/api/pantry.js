import api from './axios';

export const addPantryItem = (item) => api.post('/pantryItems', item);

export const getPantryItems = () => api.get('/pantryItems');

export const getPantryItem = (id) => api.get(`/pantryItems/${id}`)

export const updatePantryItem = (id, item) => api.put(`/pantryItems/${id}`, item);

export const deletePantryItem = (id) => api.delete(`/pantryItems/${id}`);