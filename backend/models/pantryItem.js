const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: Date,
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

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);
module.exports = PantryItem;