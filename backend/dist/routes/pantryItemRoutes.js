"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pantryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const pantryItemController_1 = require("../controllers/pantryItemController");
const pantryItemValidator_1 = require("../middleware/pantryItemValidator");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.pantryRoutes = express_1.default.Router();
exports.pantryRoutes.post('/', authMiddleware_1.authMiddleware, pantryItemValidator_1.pantryItemValidation, pantryItemController_1.addPantryItem);
exports.pantryRoutes.put('/:id', authMiddleware_1.authMiddleware, pantryItemValidator_1.pantryItemUpdateValidation, pantryItemController_1.updatePantryItem);
exports.pantryRoutes.get('/', authMiddleware_1.authMiddleware, pantryItemController_1.getAllPantryItems);
exports.pantryRoutes.get('/:id', authMiddleware_1.authMiddleware, pantryItemController_1.getPantryItemById);
exports.pantryRoutes.delete('/:id', authMiddleware_1.authMiddleware, pantryItemController_1.deletePantryItem);
