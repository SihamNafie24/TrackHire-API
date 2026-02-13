import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['USER', 'ADMIN']).optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const createJobSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
        company: z.string().min(1, 'Company is required'),
        location: z.string().min(1, 'Location is required'),
    }),
});

export const updateJobSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        company: z.string().optional(),
        location: z.string().optional(),
    }),
});

export const updateApplicationStatusSchema = z.object({
    body: z.object({
        status: z.enum(['Applied', 'Interview', 'Accepted', 'Rejected']),
    }),
});
