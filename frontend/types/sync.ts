import { PantryItem, PantryItemCreate } from "./pantry";

export type SyncAction =
  | { type: 'ADD'; item: PantryItemCreate }
  | { type: 'UPDATE'; item: PantryItem }
  | { type: 'DELETE'; item: { _id: string } };
