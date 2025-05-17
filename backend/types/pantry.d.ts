import { Types } from "mongoose";

export interface PantryItem {
    user: string;
    name: string;
    category: string;
    expiryDate: string;
    quantity: number;
    barcode?: string
}

export type PantryItemCreate = Omit<PantryItem, '_id'>;

export type PantryItemUpdate = Partial<PantryItemCreate>;

export interface IPantryItem {
    user: Types.ObjectId;
    name: string;
    category: 'dairy' | 'grains' | 'meat' | 'vegetables' | 'fruits' | 'beverages' | 'other';
    expiryDate: string;
    quantity: number;
    barcode?: string;
}