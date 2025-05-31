import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import api from '../api/axios';
import { PantryItem } from '../types/pantry';
import { SyncAction } from '../types/sync';

export async function cachePantryItems(items: PantryItem[]): Promise<void> {
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

    for (const action of queue) {
        try {
            switch (action.type) {
                case 'ADD':
                    await api.post('/pantry', action.item);
                    break;
                case 'DELETE':
                    await api.delete(`/pantry/${action.item._id}`);
                    break;
                case 'UPDATE':
                    await api.put(`/pantry/${action.item._id}`, action.item);
                    break;
            }
        } catch (err) {
            return;
        }
    }

    await AsyncStorage.removeItem('syncQueue');

    const response = await api.get('/pantry');
    await cachePantryItems(response.data.items);
}

export function listenForNetworkSync(): () => void {
    const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected) {
            syncWithBackend();
        }
    });
    return unsubscribe;
}