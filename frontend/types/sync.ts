import { PantryItem, PantryItemCreate } from "./pantry";

export type SyncAction =
  | { type: 'ADD'; item: PantryItem }
  | { type: 'UPDATE'; item: PantryItem }
  | { type: 'DELETE'; item: { _id: string } };
