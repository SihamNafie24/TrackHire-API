'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Briefcase, Clock, CheckCircle2, XCircle, ChevronRight, LayoutDashboard, Calendar, Building2, TrendingUp, Target, Award, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function UserDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get('/applications/my');
                setApplications(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const stats = [
        { label: 'Total Applied', value: applications.length, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/5' },
        { label: 'Interviews', value: applications.filter((a: any) => a.status === 'Interview').length, icon: Target, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Offers', value: applications.filter((a: any) => a.status === 'Accepted').length, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Response Rate', value: '42%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Interview': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-primary/5 text-primary border-primary/10';
        }
    };

    return (
        <ProtectedRoute roles={['USER', 'ADMIN']}>
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />

                <main className="flex-1 pt-24 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <LayoutDashboard className="w-6 h-6 text-primary" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Journey</h1>
                                </div>
                                <p className="text-slate-500 font-medium">Track and optimize your job hunt in real-time.</p>
                            </div>
                            <div className="flex gap-4">
                                <Link href="/" className="btn-premium bg-primary text-white text-sm">Find More Jobs</Link>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="glass rounded-[2rem] p-8 border-white/50 hover:scale-[1.02] transition-transform duration-300">
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Detailed List */}
                            <div className="lg:col-span-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Recent Activity</h2>
                                {loading ? (
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 bg-slate-100/50 rounded-[2rem] animate-pulse" />
                                        ))}
                                    </div>
                                ) : applications.length > 0 ? (
                                    <div className="space-y-6">
                                        {applications.map((app: any) => (
                                            <div key={app.id} className="glass rounded-[2rem] p-8 border-white/40 group hover:shadow-2xl hover:shadow-primary/5 transition-all">
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:rotate-6 transition-transform">
                                                            <Building2 className="w-8 h-8 text-slate-300 group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <div>
                                                            <Link href={`/jobs/${app.job.id}`} className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-1 block">
                                                                {app.job.title}
                                                            </Link>
                                                            <div className="flex items-center gap-4 text-sm font-bold text-slate-400 italic">
                                                                <span className="text-primary not-italic">{app.job.company}</span>
                                                                <span className="flex items-center gap-1.5 not-italic"><Calendar className="w-4 h-4" /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 md:flex-col md:items-end justify-center">
                                                        <span className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest border uppercase ${getStatusStyles(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                        <Link href={`/jobs/${app.job.id}`} className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                                                            View Details <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass rounded-[2.5rem] p-20 text-center border-dashed border-white/50">
                                        <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No data available</h3>
                                        <p className="text-slate-500 font-medium mb-8">Start applying to see your progress here.</p>
                                        <Link href="/" className="btn-premium bg-primary text-white">Find Jobs</Link>
                                    </div>
                                )}
                            </div>

                            {/* Timeline/Optimization Sidebar */}
                            <aside className="lg:col-span-4 h-fit sticky top-32">
                                <div className="glass rounded-[2.5rem] p-10 border-white/60 min-h-[500px]">
                                    <h3 className="text-xl font-bold text-slate-900 mb-10">Application Timeline</h3>

                                    <div className="relative space-y-12">
                                        <div className="absolute top-2 left-[19px] bottom-0 w-0.5 bg-slate-100" />

                                        <div className="relative flex gap-6">
                                            <div className="w-10 h-10 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center z-10">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 mb-1">Application Sent</p>
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed">System confirmed receipt of your profile.</p>
                                            </div>
                                        </div>

                                        <div className="relative flex gap-6">
                                            <div className="w-10 h-10 bg-white border-2 border-slate-100 text-slate-300 rounded-xl flex items-center justify-center z-10 transition-colors group-hover:border-primary">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-400 mb-1">Under Review</p>
                                                <p className="text-xs text-slate-300 font-medium leading-relaxed">Recruiters are vetting your skills.</p>
                                            </div>
                                        </div>

                                        <div className="relative flex gap-6">
                                            <div className="w-10 h-10 bg-white border-2 border-slate-100 text-slate-300 rounded-xl flex items-center justify-center z-10">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-400 mb-1">Interview Prep</p>
                                                <p className="text-xs text-slate-300 font-medium leading-relaxed">Scheduling and technical rounds.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-16 bg-secondary/5 rounded-3xl p-8 border border-secondary/10">
                                        <h4 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-4">Pro Tip</h4>
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                                            Candidates who follow up within 3 days are <span className="text-secondary font-bold">2.4x more likely</span> to get an interview.
                                        </p>
                                        <button className="text-xs font-bold text-secondary flex items-center gap-1 group">
                                            Learn how to follow up <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>

                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
