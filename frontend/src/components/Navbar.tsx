'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, LogOut, Moon, Sun, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-20 glass dark:glass-dark border-b border-white/20">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-2xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-all duration-500">
                        <Compass className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Track<span className="text-primary">Hire</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                        Explore
                    </Link>
                    <Link href="/dashboard" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                        Dashboard
                    </Link>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-1.5 pl-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
                                    {user.name.split(' ')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors shadow-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="btn-premium bg-primary text-white text-sm shadow-primary/20">
                                Join Us
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
