"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controller/users");
const users_2 = require("../controller/users");
const user_validation_1 = require("../middlewares/user-validation");
const user_validation_2 = require("../middlewares/user-validation");
const router = express_1.default.Router();
router.post('/signup', user_validation_1.validateUser, users_1.createUser);
router.post('/login', user_validation_2.validateUserLogin, users_2.loginUser);
exports.default = router;
