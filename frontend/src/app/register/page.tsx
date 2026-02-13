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
            const { token, user } = response.data.data;
            login(token, user);
            toast.success('Account created! Welcome aboard.');
            router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />

            <div className="w-full max-w-2xl relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <h1 className="text-5xl font-extrabold text-[#111827] mb-4 tracking-tight">Sign up</h1>
                    <p className="text-slate-400 font-medium">Create an account to start your journey.</p>
                </div>

                <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2 relative">
                                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 z-20">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-[#2B79A8] transition-all outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 z-20">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-[#2B79A8] transition-all outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 z-20">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-[#2B79A8] transition-all outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-xs font-bold text-slate-500 ml-1 block">Account Type</label>
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'USER' })}
                                    className={cn(
                                        "relative p-4 rounded-2xl border-2 text-left transition-all",
                                        formData.role === 'USER' ? "border-[#2B79A8] bg-blue-50/30" : "border-slate-100 bg-slate-50/50"
                                    )}
                                >
                                    <p className="font-bold text-slate-900 text-sm">Finding Jobs</p>
                                    <p className="text-[10px] text-slate-400 font-medium">I want to track applications.</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                                    className={cn(
                                        "relative p-4 rounded-2xl border-2 text-left transition-all",
                                        formData.role === 'ADMIN' ? "border-secondary bg-pink-50/30" : "border-slate-100 bg-slate-50/50"
                                    )}
                                >
                                    <p className="font-bold text-slate-900 text-sm">Recruiting</p>
                                    <p className="text-[10px] text-slate-400 font-medium">I'm looking to post jobs.</p>
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2B79A8] text-white py-4 rounded-xl font-bold text-md flex items-center justify-center gap-3 transition-all hover:bg-[#23638a] shadow-xl shadow-blue-100 active:scale-[0.98]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign up"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
                    Already have an account?
                    <Link href="/login" className="text-[#2B79A8] hover:underline decoration-2 underline-offset-4">Log in</Link>
                </div>
            </div>
        </div>
    );
}
