import api from './axios';
import { PantryItemCreate, PantryItemUpdate, PantryItemResponse, PantryItemsResponse } from '../types/pantry';

export const addPantryItem = (item: PantryItemCreate) => api.post<PantryItemResponse>('/pantryItems', item);

export const getPantryItems = () => api.get<PantryItemsResponse>('/pantryItems');

export const getPantryItem = (id: string) => api.get<PantryItemResponse>(`/pantryItems/${id}`)

export const updatePantryItem = (id: string, item: PantryItemUpdate) => api.put<PantryItemResponse>(`/pantryItems/${id}`, item);

export const deletePantryItem = (id: string) => api.delete<PantryItemResponse>(`/pantryItems/${id}`);