import prisma from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

export class ApplicationService {
    static async applyToJob(userId: string, jobId: string) {
        // Check if job exists
        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new AppError(404, 'Job not found');
        }

        // Check if user already applied
        const existingApplication = await prisma.application.findFirst({
            where: { userId, jobId },
        });

        if (existingApplication) {
            throw new AppError(400, 'You have already applied for this job');
        }

        return await prisma.application.create({
            data: {
                userId,
                jobId,
            },
        });
    }

    static async getMyApplications(userId: string) {
        return await prisma.application.findMany({
            where: { userId },
            include: { job: true },
            orderBy: { appliedAt: 'desc' },
        });
    }

    static async getAllApplications() {
        return await prisma.application.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                job: true,
            },
            orderBy: { appliedAt: 'desc' },
        });
    }

    static async updateApplicationStatus(id: string, status: any) {
        const application = await prisma.application.findUnique({ where: { id } });
        if (!application) {
            throw new AppError(404, 'Application not found');
        }

        return await prisma.application.update({
            where: { id },
            data: { status },
        });
    }
}
