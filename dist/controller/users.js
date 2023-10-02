"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const userService = __importStar(require("../service/userService"));
const createUser = async (req, res, next) => {
    try {
        const { username, email, password, name, phoneNumber, city, pincode, } = req.body;
        const responseData = await userService.createUser(username, email, password, name, phoneNumber, city, pincode);
        res.status(201).json({
            status: 'ok',
            message: 'Account created successfully',
            data: responseData,
        });
    }
    catch (err) {
        if (err.message === 'Username or email already exists') {
            res.status(400).json({ error: 'Username or email already exists' });
        }
        else {
            next(err);
        }
    }
};
exports.createUser = createUser;
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await userService.loginUser(username, password);
        if (result.status === 200) {
            res.status(200).json({
                status: 'ok',
                message: 'Login successful',
                token: result.token,
                user: result.user,
            });
        }
        else if (result.status === 401) {
            res.status(401).json({
                status: 'nok',
                message: 'Invalid username or password',
            });
        }
        else if (result.status === 404) {
            res.status(404).json({
                status: 'nok',
                message: 'User not found',
            });
        }
        else {
            next(result);
        }
    }
    catch (err) {
        next(err);
    }
};
exports.loginUser = loginUser;
