'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Briefcase, Clock, CheckCircle2, ChevronRight, LayoutDashboard, Calendar, Building2, TrendingUp, Target, Award, ArrowUpRight, Filter } from 'lucide-react';
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
        { label: 'Interviews', value: applications.filter((a: any) => a.status === 'Interview').length, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Offers', value: applications.filter((a: any) => a.status === 'Accepted').length, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Pipeline', value: applications.filter((a: any) => a.status !== 'Rejected' && a.status !== 'Accepted').length, icon: TrendingUp, color: 'text-slate-600', bg: 'bg-slate-50' },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Interview': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <ProtectedRoute roles={['USER', 'ADMIN']}>
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Navbar />

                <main className="flex-1 pt-24 pb-20 px-6">
                    <div className="max-w-6xl mx-auto">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <LayoutDashboard className="w-5 h-5 text-primary" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recruitment Dashboard</h1>
                                </div>
                                <p className="text-slate-500 font-medium">Tracking {applications.length} active opportunities in your pipeline.</p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/" className="btn btn-primary text-sm shadow-xl shadow-blue-500/20">
                                    Browse New Jobs
                                </Link>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Main Content: Applications List */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Applications</h2>
                                    <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                                        <Filter className="w-4 h-4" /> Filter By Status
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : applications.length > 0 ? (
                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Company & Role</th>
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date Applied</th>
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {applications.map((app: any) => (
                                                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                                                        <Building2 className="w-5 h-5 text-slate-300" />
                                                                    </div>
                                                                    <div>
                                                                        <Link href={`/jobs/${app.job.id}`} className="text-sm font-bold text-slate-900 hover:text-primary transition-colors block leading-tight">
                                                                            {app.job.title}
                                                                        </Link>
                                                                        <span className="text-xs font-medium text-slate-400">{app.job.company}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                                    <Calendar className="w-3.5 h-3.5 opacity-60" />
                                                                    {new Date(app.appliedAt).toLocaleDateString()}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getStatusStyles(app.status)}`}>
                                                                    {app.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-5 text-right">
                                                                <Link href={`/jobs/${app.job.id}`} className="inline-flex items-center gap-1 text-xs font-black text-slate-300 hover:text-primary transition-colors uppercase tracking-widest">
                                                                    Details <ChevronRight className="w-4 h-4" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                                        <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">No applications yet</h3>
                                        <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">Start your journey by applying to your first role today.</p>
                                        <Link href="/" className="btn btn-primary shadow-xl shadow-blue-500/20 px-8">Find Jobs</Link>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar: Pipeline Timeline */}
                            <aside className="space-y-6">
                                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm sticky top-28">
                                    <h3 className="text-lg font-bold text-slate-900 mb-8">Hiring Workflow</h3>

                                    <div className="relative space-y-10">
                                        <div className="absolute top-2 left-[19px] bottom-0 w-px bg-slate-100" />

                                        {[
                                            { label: 'Application Sent', desc: 'Profile delivered to recruiters', date: 'Step 1', done: true },
                                            { label: 'Initial Vetting', desc: 'AI-powered skill matching', date: 'Step 2', done: false },
                                            { label: 'First Interview', desc: 'Technical assessment round', date: 'Step 3', done: false },
                                            { label: 'Final Decision', desc: 'Offer or feedback', date: 'Step 4', done: false },
                                        ].map((step, i) => (
                                            <div key={i} className="relative flex gap-6 group">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all border ${step.done
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                    : 'bg-white text-slate-200 border-slate-100 group-hover:border-slate-300'
                                                    }`}>
                                                    {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className={`text-sm font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                                        <span className="text-[10px] font-black text-slate-300 uppercase">{step.date}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-12 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-3.5 h-3.5" /> Pipeline Tip
                                        </h4>
                                        <p className="text-slate-600 text-[13px] font-medium leading-relaxed mb-4">
                                            Your response rate is <span className="text-indigo-600 font-bold">12% higher</span> than average. Keep going!
                                        </p>
                                        <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 group">
                                            Optimization guide <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
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
