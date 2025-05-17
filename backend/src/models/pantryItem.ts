import { Schema, model, Types } from 'mongoose';
import { IPantryItem } from '../../types/pantry';

const pantryItemSchema = new Schema<IPantryItem>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ['dairy', 'grains', 'meat', 'vegetables', 'fruits', 'beverages', 'other']
    },
    expiryDate: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    barcode: {
        type: String,
        trim: true
    }

});

export const PantryItem = model<IPantryItem>('PantryItem', pantryItemSchema);