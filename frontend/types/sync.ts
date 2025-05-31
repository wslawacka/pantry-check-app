import { PantryItem } from "./pantry";

export type SyncActionType = 'ADD' | 'DELETE' | 'UPDATE';

export interface SyncAction {
    type: SyncActionType,
    item: PantryItem
}