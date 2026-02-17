'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/register', formData);
            const { token, user: userData } = response.data.data;
            login(token, userData);
            toast.success('Account created.');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[480px]">
                <div className="flex flex-col mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create account</h1>
                    <p className="text-sm font-medium text-slate-500">Start your journey with TrackHire.</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Full name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Account purpose</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'USER' })}
                                    className={cn(
                                        "p-3 rounded-xl border-2 text-left transition-all",
                                        formData.role === 'USER' ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
                                    )}
                                >
                                    <p className="font-bold text-slate-900 text-xs">Finding roles</p>
                                    <p className="text-[10px] text-slate-400 font-medium">I want to track jobs.</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                                    className={cn(
                                        "p-3 rounded-xl border-2 text-left transition-all",
                                        formData.role === 'ADMIN' ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
                                    )}
                                >
                                    <p className="font-bold text-slate-900 text-xs">Recruiting</p>
                                    <p className="text-[10px] text-slate-400 font-medium">I'm looking to hire.</p>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 text-sm font-bold shadow-sm"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create TrackHire account"}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-xs font-bold text-slate-400">
                    Existing user? <Link href="/login" className="text-primary hover:underline decoration-2 underline-offset-4">Sign in here</Link>
                </div>
            </div>
        </div>
    );
}
