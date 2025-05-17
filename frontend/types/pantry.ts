export interface PantryItem {
    _id: string;
    name: string;
    category: string;
    expiryDate: string;
    quantity: number;
    barcode?: string;
}

export type PantryItemCreate = Omit<PantryItem, '_id'>;

export type PantryItemUpdate = Partial<PantryItemCreate>;

export interface PantryItemResponse {
    message: string;
    item: PantryItem;
}

export interface PantryItemsResponse {
    message: string;
    items: PantryItem[];
}