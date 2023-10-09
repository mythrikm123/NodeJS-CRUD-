import { Request, Response, NextFunction } from 'express';
import * as userService from '../service/userService';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            username,
            email,
            password,
            name,
            phoneNumber,
            city,
            pincode,
        } = req.body;

        const responseData = await userService.createUser(
            username,
            email,
            password,
            name,
            phoneNumber,
            city,
            pincode
        );

        res.status(201).json({
            status: 'ok',
            message: 'Account created successfully',
            data: responseData,
        });
    } catch (err: any) {
        if (err.message === 'Username or email already exists') {
            res.status(400).json({ error: 'Username or email already exists' });
        } else {
            next(err);
        }
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
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
        } else if (result.status === 401) {
            res.status(401).json({
                status: 'nok',
                message: 'Invalid username or password',
            });
        } else if (result.status === 404) {
            res.status(404).json({
                status: 'nok',
                message: 'User not found',
            });
        } else {
            next(result);
        }
    } catch (err) {
        next(err);
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        console.log('Attempting to fetch profile for user ID:', userId);

        const user = await userService.getProfile(userId);

        if (user) {
            console.log('User profile found:', user);
            res.status(200).json({
                status: 'ok',
                message: 'User profile fetched successfully',
                data: user,
            });
        } else {
            console.log('User profile not found');
            res.status(404).json({
                status: 'nok',
                message: 'User profile not found',
            });
        }
    } catch (err) {
        console.error('Error in getProfile:', err);
        next(err);
    }
};
