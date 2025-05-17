"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userValidator_1 = require("../middleware/userValidator");
exports.userRoutes = express_1.default.Router();
exports.userRoutes.post('/register', userValidator_1.registerValidation, userController_1.registerUser);
exports.userRoutes.post('/login', userValidator_1.loginValidation, userController_1.loginUser);
