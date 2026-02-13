import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response';

export class AppError extends Error {
    constructor(public statusCode: number, public message: string) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'PrismaClientKnownRequestError') {
        if (err.code === 'P2002') {
            statusCode = 400;
            message = 'Duplicate field value entered';
        }
    }

    if (err.name === 'ZodError') {
        statusCode = 400;
        message = err.errors.map((e: any) => e.message).join(', ');
    }

    sendResponse(res, statusCode, false, message);
};
