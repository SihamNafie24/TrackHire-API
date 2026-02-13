import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/applicationService';
import { sendResponse } from '../utils/response';

interface AuthRequest extends Request {
    user?: any;
}

export class ApplicationController {
    static async applyToJob(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.body;
            const userId = req.user.id;
            const application = await ApplicationService.applyToJob(userId, jobId);
            sendResponse(res, 201, true, 'Application submitted successfully', application);
        } catch (error) {
            next(error);
        }
    }

    static async getMyApplications(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const applications = await ApplicationService.getMyApplications(req.user.id);
            sendResponse(res, 200, true, 'Applications retrieved successfully', applications);
        } catch (error) {
            next(error);
        }
    }

    static async getAllApplications(req: Request, res: Response, next: NextFunction) {
        try {
            const applications = await ApplicationService.getAllApplications();
            sendResponse(res, 200, true, 'All applications retrieved successfully', applications);
        } catch (error) {
            next(error);
        }
    }

    static async updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status } = req.body;
            const application = await ApplicationService.updateApplicationStatus(req.params.id as string, status);
            sendResponse(res, 200, true, 'Application status updated successfully', application);
        } catch (error) {
            next(error);
        }
    }
}
