import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
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

    for (const action of queue) {
        try {
            switch (action.type) {
                case 'ADD':
                    await addPantryItem(action.item);
                    break;
                case 'DELETE':
                    try {
                        await deletePantryItem(action.item._id);
                    } catch (err) {
                        if (err.response?.status === 404) {
                            continue;
                        }
                        throw err;
                    }
                    break;
                case 'UPDATE':
                    await updatePantryItem(action.item._id, action.item);
                    break;
            }
        } catch (err) {
            console.error('Sync failed for action:', action, err);
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

export function listenForNetworkSync(): () => void {
    const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected && state.isInternetReachable) {
            syncWithBackend();
        }
    });
    return unsubscribe;
}