import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that should be accessible even when logged in
    const publicRoutes = ['/', '/jobs'];

    // Auth routes (login/register) - should redirect to dashboard if already logged in
    const authRoutes = ['/login', '/register'];

    // Protected routes - require authentication
    const protectedRoutes = ['/dashboard', '/applications', '/admin'];

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/applications/:path*',
        '/admin/:path*',
        '/login',
        '/register',
    ],
};
