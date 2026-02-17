import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { DashboardService } from '../services/dashboardService';
import { sendResponse } from '../utils/response';

export class DashboardController {
    static async getStats(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return sendResponse(res, 401, false, 'Unauthorized');
            }

            const stats = await DashboardService.getStats(userId);
            return sendResponse(res, 200, true, 'Dashboard stats retrieved successfully', stats);
        } catch (error: any) {
            console.error('Error fetching dashboard stats:', error);
            return sendResponse(res, 500, false, error.message || 'Internal server error');
        }
    }
}
