import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '../models/users';
import jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize';

const SALT_ROUNDS = 10;
const secretKey = process.env.JWT_SECRET || 'your_secret_key_here';

export type UserWithPassword = User & { password: string };

export const createUser = async (
    username: string,
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    city: string,
    pincode: string
) => {
    try {
        const existingUser = await findOneByUsername(username);

        if (existingUser) {
            return {
                status: 409,
                message: 'Username or email already exists',
            };
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await User.create({
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
    } catch (error) {
        return {
            status: 500,
            message: 'Internal Server Error',
        };
    }
};

export const loginUser = async (username: string, password: string) => {
    try {
        const user = await findOneByUsername(username);
        if (!user) {
            return {
                status: 404,
                message: 'User not found',
            };
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return {
                status: 401,
                message: 'Invalid username or password',
            };
        }

        const token = jwt.sign({ userId: user.id }, secretKey, {
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
    } catch (error) {
        return {
            status: 500,
            message: 'Internal Server Error',
        };
    }
};

export const getProfile = async (userId: string) => {
    try {
        const user = await findOneByUsername(userId);

        if (user) {
            console.log('Original user object:', user.toJSON());
            const userJson = user.toJSON();
            console.log('User JSON before removal:', userJson);
            const { password, ...userWithoutPassword } = userJson as UserWithPassword;
            console.log('User without password:', userWithoutPassword);
            return userWithoutPassword;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error in getProfile:', error);
        return null;
    }
};

export const findOneByUsername = async (username: string) => {
    return User.findOne({
        where: {
            [Op.or]: [{ username }, { email: username }],
        },
    });
};
