export type Role = 'USER' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}
