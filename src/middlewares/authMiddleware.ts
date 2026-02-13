import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import prisma from '../prisma/client';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new AppError(401, 'Authentication failed: No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            throw new AppError(401, 'Authentication failed: User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new AppError(401, 'Authentication failed: Invalid token'));
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new AppError(403, 'Forbidden: You do not have permission to perform this action')
            );
        }
        next();
    };
};
