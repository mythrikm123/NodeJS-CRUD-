"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneByUsername = exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 10;
const secretKey = process.env.JWT_SECRET || 'your_secret_key_here';
const createUser = async (username, email, password, name, phoneNumber, city, pincode) => {
    try {
        const existingUser = await (0, exports.findOneByUsername)(username);
        if (existingUser) {
            return {
                status: 409,
                message: 'Username or email already exists',
            };
        }
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const newUser = await users_1.default.create({
            username,
            password: hashedPassword,
            name,
            email,
            phoneNumber,
            city,
            pincode,
        });
        return {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            city: newUser.city,
            pincode: newUser.pincode,
        };
    }
    catch (error) {
        return {
            status: 500,
            message: 'Internal Server Error',
        };
    }
};
exports.createUser = createUser;
const loginUser = async (username, password) => {
    try {
        const user = await (0, exports.findOneByUsername)(username);
        if (!user) {
            return {
                status: 404,
                message: 'User not found',
            };
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return {
                status: 401,
                message: 'Invalid username or password',
            };
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, {
            expiresIn: '1h',
        });
        return {
            status: 200,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                city: user.city,
                pincode: user.pincode,
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            message: 'Internal Server Error',
        };
    }
};
exports.loginUser = loginUser;
const findOneByUsername = async (username) => {
    return users_1.default.findOne({
        where: {
            [sequelize_1.Op.or]: [{ username }, { email: username }],
        },
    });
};
exports.findOneByUsername = findOneByUsername;
