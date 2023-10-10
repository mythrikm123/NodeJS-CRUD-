import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
    status: number = 401  
) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new Error('Unauthorized: Missing token');
        }

        jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
            if (err) {
                console.error('Authentication Error:', err.message);
                return res.status(status).json({
                    status: 'nok',
                    message: err.message,
                });
            }

            req.user = user;
            next();
        });
    } catch (error:any) {
        console.error('Authentication Error:', error.message);
        return res.status(status).json({
            status: 'nok',
            message: error.message,
        });
    }
};
