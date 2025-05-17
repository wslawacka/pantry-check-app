"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = require("./routes/userRoutes");
const pantryItemRoutes_1 = require("./routes/pantryItemRoutes");
// load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// routes
app.use('/api/users', userRoutes_1.userRoutes);
app.use('/api/pantryItems', pantryItemRoutes_1.pantryRoutes);
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URI, {
    ssl: true
})
    .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5001, () => {
        console.log(`Server is running on port ${process.env.PORT || 5001}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
