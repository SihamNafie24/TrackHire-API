import prisma from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

export class JobService {
    static async createJob(data: any) {
        return await prisma.job.create({ data });
    }

    static async getAllJobs(query: any) {
        const { page = 1, limit = 10, search, location, company } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        if (company) {
            where.company = { contains: company, mode: 'insensitive' };
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.job.count({ where }),
        ]);

        return {
            jobs,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / take),
            },
        };
    }

    static async getJobById(id: string) {
        const job = await prisma.job.findUnique({ where: { id } });
        if (!job) {
            throw new AppError(404, 'Job not found');
        }
        return job;
    }

    static async updateJob(id: string, data: any) {
        await this.getJobById(id);
        return await prisma.job.update({
            where: { id },
            data,
        });
    }

    static async deleteJob(id: string) {
        await this.getJobById(id);
        return await prisma.job.delete({ where: { id } });
    }
}
