import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { sendResponse } from '../utils/response';

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthService.register(req.body);
            sendResponse(res, 201, true, 'User registered successfully', user);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body);
            sendResponse(res, 200, true, 'Login successful', result);
        } catch (error) {
            next(error);
        }
    }

    static async getMe(req: any, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            sendResponse(res, 200, true, 'User profile fetched', user);
        } catch (error) {
            next(error);
        }
    }
}
