import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';
import { PantryItem, PantryItemCreate } from '../types/pantry';
import { SyncAction } from '../types/sync';
import { deletePantryItem, updatePantryItem, addPantryItem } from '../api/pantry';

export async function cachePantryItems(items: PantryItemCreate[]): Promise<void> {
    await AsyncStorage.setItem('pantryItems', JSON.stringify(items));
}

export async function getCachedPantryItems(): Promise<PantryItem[]> {
    const cached = await AsyncStorage.getItem('pantryItems');
    return cached ? JSON.parse(cached) : [];
}

export async function queueOfflineAction(action: SyncAction) {
    const queue = JSON.parse(await AsyncStorage.getItem('syncQueue') || '[]');
    queue.push(action);
    await AsyncStorage.setItem('syncQueue', JSON.stringify(queue));
}

export async function syncWithBackend(): Promise<void> {
    const queue: SyncAction[] = JSON.parse(await AsyncStorage.getItem('syncQueue') || '[]');
    if (queue.length === 0) return;

    const failedActions: SyncAction[] = [];
    const idMap = new Map<string, string>();

    for (const action of queue) {
        try {
            switch (action.type) {
                case 'ADD':
                    try {
                        const { _id, ...itemWithoutId } = action.item;
                        const response = await addPantryItem(itemWithoutId);
                        idMap.set(action.item._id, response.data.item._id);
                        const cached = await getCachedPantryItems();
                        const newCache = cached.map(item =>
                            item._id === _id ? { ...response.data.item } : item
                        );
                        await cachePantryItems(newCache);
                    } catch (err) {
                        failedActions.push(action);
                    }
                    break;
                case 'DELETE':
                    try {
                        const cached = await getCachedPantryItems();
                        const newCache = cached.filter(i => i._id !== action.item._id);
                        await cachePantryItems(newCache);
                        const realId = idMap.get(action.item._id) || action.item._id;
                        await deletePantryItem(realId);
                    } catch (err) {
                        if (err.response?.status === 404) {
                            continue;
                        }
                        throw err;
                    }
                    break;
                case 'UPDATE':
                    const realId = idMap.get(action.item._id) || action.item._id;
                    const updatedItem = { ...action.item, _id: realId };
                    await updatePantryItem(realId, updatedItem);
                    const cached = await getCachedPantryItems();
                    const newCache = cached.map(i =>
                        i._id === realId ? updatedItem : i
                    );
                    await cachePantryItems(newCache);
                    break;
            }
        } catch (err) {
            failedActions.push(action);
        }
    }

    await AsyncStorage.setItem('syncQueue', JSON.stringify(failedActions));

    if (failedActions.length === 0) {
        try {
            const response = await api.get('/pantryItems');
            await cachePantryItems(response.data.items);
        } catch (err) {
            console.error('Failed to refresh cache:', err);
        }
    }
}