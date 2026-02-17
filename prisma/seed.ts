import { PrismaClient, Role, JobType, LocationType, JobStatus, AppStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up database...');
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding data...');

    // 1. Create Demo User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@trackhire.com',
            name: 'Demo User',
            password: hashedPassword,
            role: Role.USER,
            profile: {
                create: {
                    fullName: 'Demo Candidate',
                    title: 'Senior Frontend Developer',
                    bio: 'Passionate developer with 5+ years of experience in React and TypeScript.',
                    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS'],
                },
            },
        },
    });

    // 2. Create Companies
    const companies = await Promise.all([
        prisma.company.create({
            data: {
                name: 'TechFlow',
                logoUrl: 'https://logo.clearbit.com/techflow.ai',
                location: 'San Francisco, CA',
                website: 'https://techflow.ai',
            },
        }),
        prisma.company.create({
            data: {
                name: 'DevPoint',
                logoUrl: 'https://logo.clearbit.com/devpoint.com',
                location: 'New York, NY',
                website: 'https://devpoint.com',
            },
        }),
        prisma.company.create({
            data: {
                name: 'CloudSystems',
                logoUrl: 'https://logo.clearbit.com/cloudsystems.io',
                location: 'Austin, TX',
                website: 'https://cloudsystems.io',
            },
        }),
    ]);

    // 3. Create Jobs
    const jobs = await Promise.all([
        prisma.job.create({
            data: {
                companyId: companies[0].id,
                title: 'Senior React Developer',
                description: 'Join our team to build next-gen AI applications.',
                requirements: ['5+ years React', 'TypeScript mastery', 'Strong CSS skills'],
                salaryRange: '$140k - $180k',
                type: JobType.FULL_TIME,
                locationType: LocationType.REMOTE,
                status: JobStatus.OPEN,
            },
        }),
        prisma.job.create({
            data: {
                companyId: companies[0].id,
                title: 'Full Stack Engineer',
                description: 'Build robust APIs and beautiful user interfaces.',
                requirements: ['Node.js', 'PostgreSQL', 'Prisma', 'React'],
                salaryRange: '$130k - $170k',
                type: JobType.FULL_TIME,
                locationType: LocationType.HYBRID,
                status: JobStatus.OPEN,
            },
        }),
        prisma.job.create({
            data: {
                companyId: companies[1].id,
                title: 'Product Designer',
                description: 'Lead design for our core platform.',
                requirements: ['Figma', 'User Research', 'Design Systems'],
                salaryRange: '$120k - $160k',
                type: JobType.FULL_TIME,
                locationType: LocationType.ONSITE,
                status: JobStatus.OPEN,
            },
        }),
        prisma.job.create({
            data: {
                companyId: companies[2].id,
                title: 'Cloud Architect',
                description: 'Manage our global cloud infrastructure.',
                requirements: ['AWS', 'Terraform', 'Kubernetes'],
                salaryRange: '$160k - $220k',
                type: JobType.CONTRACT,
                locationType: LocationType.REMOTE,
                status: JobStatus.OPEN,
            },
        }),
        prisma.job.create({
            data: {
                companyId: companies[2].id,
                title: 'Backend Developer Intern',
                description: 'Learn and grow with our backend team.',
                requirements: ['Basic Node.js', 'Interest in Distributed Systems'],
                salaryRange: '$30 - $50 / hour',
                type: JobType.FREELANCE,
                locationType: LocationType.REMOTE,
                status: JobStatus.OPEN,
            },
        }),
    ]);

    // 4. Create Applications for Demo User
    await prisma.application.createMany({
        data: [
            {
                userId: demoUser.id,
                jobId: jobs[0].id,
                status: AppStatus.OFFER,
            },
            {
                userId: demoUser.id,
                jobId: jobs[1].id,
                status: AppStatus.INTERVIEW,
            },
            {
                userId: demoUser.id,
                jobId: jobs[2].id,
                status: AppStatus.REJECTED,
            },
            {
                userId: demoUser.id,
                jobId: jobs[3].id,
                status: AppStatus.APPLIED,
            },
        ],
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
