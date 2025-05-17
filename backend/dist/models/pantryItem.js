"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PantryItem = void 0;
const mongoose_1 = require("mongoose");
const pantryItemSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.PantryItem = (0, mongoose_1.model)('PantryItem', pantryItemSchema);
