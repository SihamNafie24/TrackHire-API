'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Chrome } from 'lucide-react';
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
            toast.success('Welcome back! Logging you in...');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Invalid email or password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />

            <div className="w-full max-w-lg relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Sign in</h1>
                    <p className="text-slate-400 font-medium">Please login to continue to your account.</p>
                </div>

                <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 relative">
                            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 z-20">Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 z-20">Password</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none pr-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <input type="checkbox" id="keep-logged" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" />
                            <label htmlFor="keep-logged" className="text-sm font-bold text-slate-700 cursor-pointer">Keep me logged in</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">or</span></div>
                    </div>

                    <button className="btn btn-outline w-full mb-4 group">
                        Sign in with Google <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="mt-8 text-center text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
                    Need an account?
                    <Link href="/register" className="text-primary hover:underline decoration-2 underline-offset-4">Create one</Link>
                </div>
            </div>
        </div>
    );
}
