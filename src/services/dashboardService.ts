import prisma from '../prisma/client';
import { AppStatus } from '@prisma/client';

export class DashboardService {
    static async getStats(userId: string) {
        const [
            totalApplications,
            interviewing,
            offers,
            rejected,
            recentApplications,
        ] = await prisma.$transaction([
            prisma.application.count({ where: { userId } }),
            prisma.application.count({ where: { userId, status: AppStatus.INTERVIEW } }),
            prisma.application.count({ where: { userId, status: AppStatus.OFFER } }),
            prisma.application.count({ where: { userId, status: AppStatus.REJECTED } }),
            prisma.application.findMany({
                where: { userId },
                include: {
                    job: {
                        include: {
                            company: true,
                        },
                    },
                },
                orderBy: { appliedAt: 'desc' },
                take: 3,
            }),
        ]);

        const successRate = totalApplications > 0
            ? Math.round((offers / totalApplications) * 100)
            : 0;

        return {
            totalApplications,
            interviewing,
            offers,
            rejected,
            successRate,
            recentApplications,
        };
    }
}
