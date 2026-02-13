import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/jobService';
import { sendResponse } from '../utils/response';

export class JobController {
    static async createJob(req: Request, res: Response, next: NextFunction) {
        try {
            const job = await JobService.createJob(req.body);
            sendResponse(res, 201, true, 'Job created successfully', job);
        } catch (error) {
            next(error);
        }
    }

    static async getAllJobs(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobs, meta } = await JobService.getAllJobs(req.query);
            sendResponse(res, 200, true, 'Jobs retrieved successfully', jobs, meta);
        } catch (error) {
            next(error);
        }
    }

    static async getJobById(req: Request, res: Response, next: NextFunction) {
        try {
            const job = await JobService.getJobById(req.params.id as string);
            sendResponse(res, 200, true, 'Job retrieved successfully', job);
        } catch (error) {
            next(error);
        }
    }

    static async updateJob(req: Request, res: Response, next: NextFunction) {
        try {
            const job = await JobService.updateJob(req.params.id as string, req.body);
            sendResponse(res, 200, true, 'Job updated successfully', job);
        } catch (error) {
            next(error);
        }
    }

    static async deleteJob(req: Request, res: Response, next: NextFunction) {
        try {
            await JobService.deleteJob(req.params.id as string);
            sendResponse(res, 200, true, 'Job deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}
