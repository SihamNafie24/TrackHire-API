'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Track<span className="text-primary">Hire</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                            Find Jobs
                        </Link>
                        {user && (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                                    My Applications
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                                        Admin Panel
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <span className="hidden sm:inline">{user.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-slate-500 hover:text-destructive transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
