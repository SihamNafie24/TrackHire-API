'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, User as UserIcon, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Jobs', href: '/jobs' },
        ...(user ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'h-16 bg-white/80 backdrop-blur-md border-b border-slate-200'
                : 'h-20 bg-transparent'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-9 h-9 bg-primary flex items-center justify-center rounded-xl overflow-hidden shadow-premium group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                        <span className="text-white font-black text-lg tracking-tighter">TH</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        TrackHire
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative text-sm font-semibold transition-colors duration-200 ${pathname === link.href
                                ? 'text-primary'
                                : 'text-slate-600 hover:text-primary'
                                }`}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-left-2 duration-300" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons / Profile */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 pl-4 pr-2 py-1.5 hover:bg-slate-50 rounded-full border border-transparent hover:border-slate-100 transition-all group"
                            >
                                <div className="hidden md:block text-right">
                                    <p className="text-xs font-black text-slate-900 leading-none mb-0.5">{user.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                                </div>
                                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {profileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                    <div className="p-2 border-b border-slate-50 md:hidden">
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <UserIcon className="w-4 h-4" /> Profile
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <Settings className="w-4 h-4" /> Settings
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-slate-50">
                                        <button
                                            onClick={() => { logout(); setProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/login"
                                className="btn btn-ghost text-sm"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="btn btn-primary text-sm shadow-xl shadow-blue-500/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 animate-in slide-in-from-top-2 duration-300 shadow-xl overflow-y-auto max-h-[calc(100vh-80px)]">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-lg font-bold ${pathname === link.href ? 'text-primary' : 'text-slate-600'}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-slate-100" />
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="btn btn-outline w-full"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-primary w-full shadow-lg shadow-blue-500/20"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={logout}
                                className="text-lg font-bold text-rose-500 text-left"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
