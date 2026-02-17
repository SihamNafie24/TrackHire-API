'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data.data;
            login(token, userData);
            toast.success('Welcome back.');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Invalid email or password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[400px]">
                <div className="flex flex-col mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sign in</h1>
                    <p className="text-sm font-medium text-slate-500 text-left">Access your professional workspace.</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email address</label>
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                                <Link href="#" className="text-[10px] font-bold text-primary hover:underline underline-offset-4 uppercase tracking-widest">Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2 pb-2">
                            <input type="checkbox" id="keep-logged" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" />
                            <label htmlFor="keep-logged" className="text-xs font-bold text-slate-500 cursor-pointer">Keep me logged in</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 text-sm font-bold shadow-sm"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in to TrackHire"}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-xs font-bold text-slate-400">
                    Don't have an account? <Link href="/register" className="text-primary hover:underline decoration-2 underline-offset-4">Create one for free</Link>
                </div>
            </div>
        </div>
    );
}
