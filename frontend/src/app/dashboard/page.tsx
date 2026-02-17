'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import {
    Briefcase, Clock, CheckCircle2, ChevronRight,
    LayoutDashboard, Building2, TrendingUp, Target,
    Award, ArrowUpRight, Filter, MoreVertical,
    Calendar, MapPin, XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const STATUSES = ['Applied', 'Interview', 'Accepted', 'Rejected'];

export default function UserDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [appRes, statsRes] = await Promise.all([
                api.get('/applications/my'),
                api.get('/dashboard/stats')
            ]);
            setApplications(appRes.data.data || []);
            setStatsData(statsRes.data.data);
        } catch (error) {
            toast.error('Failed to sync dashboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const updateStatus = async (appId: string, newStatus: string) => {
        try {
            const normalizedStatus = newStatus.toUpperCase();
            await api.patch(`/applications/${appId}/status`, { status: normalizedStatus });
            setApplications(prev => prev.map(app =>
                app.id === appId ? { ...app, status: normalizedStatus } : app
            ));
            toast.success(`Moved to ${newStatus}`);
        } catch (error) {
            toast.error('Update failed.');
        }
    };

    const stats = [
        { label: 'Applications', value: statsData?.totalApplications || applications.length, icon: Briefcase, color: 'text-primary' },
        { label: 'Interviews', value: statsData?.interviewing || applications.filter(a => a.status.toLowerCase() === 'interview').length, icon: Target, color: 'text-indigo-600' },
        { label: 'Offers', value: statsData?.offers || applications.filter(a => a.status.toLowerCase() === 'accepted').length, icon: Award, color: 'text-emerald-600' },
        { label: 'Success Rate', value: `${statsData?.successRate || 0}%`, icon: TrendingUp, color: 'text-slate-600' },
    ];

    return (
        <ProtectedRoute roles={['USER', 'ADMIN']}>
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                <Navbar />

                <main className="flex-1 pt-24 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">

                        {/* Dashboard Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">My Pipeline</h1>
                                <p className="text-sm font-medium text-slate-500">Manage {applications.length} active opportunities from your dashboard.</p>
                            </div>
                        </div>

                        {/* Top Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white rounded-[1.25rem] p-5 border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                                        <stat.icon className={cn("w-5 h-5 opacity-40", stat.color)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Kanban Board Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[600px]">
                            {STATUSES.map((status) => (
                                <div key={status} className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between px-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{status}</h3>
                                            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {applications.filter(a => a.status.toLowerCase() === status.toLowerCase()).length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        {loading ? (
                                            <div className="h-32 bg-slate-100/50 rounded-2xl animate-pulse" />
                                        ) : applications.filter(a => a.status.toLowerCase() === status.toLowerCase()).map((app) => (
                                            <div
                                                key={app.id}
                                                className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-default"
                                            >
                                                <div className="flex gap-4 mb-5">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                                                        {app.job.company?.logoUrl ? (
                                                            <img src={app.job.company.logoUrl} alt={app.job.company.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Building2 className="w-5 h-5 text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">{app.job.title}</h4>
                                                        <p className="text-[10px] font-bold text-primary">{app.job.company?.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>

                                                    {/* Inline Status Move Actions */}
                                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {STATUSES.filter(s => s.toLowerCase() !== status.toLowerCase()).map(nextStatus => (
                                                            <button
                                                                key={nextStatus}
                                                                onClick={() => updateStatus(app.id, nextStatus)}
                                                                title={`Move to ${nextStatus}`}
                                                                className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 text-[10px] flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all"
                                                            >
                                                                {nextStatus[0]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Empty Column State */}
                                        {!loading && applications.filter(a => a.status.toLowerCase() === status.toLowerCase()).length === 0 && (
                                            <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center p-6 text-center opacity-40">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No {status} roles</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Analytics Bar */}
                        <div className="mt-16 bg-slate-900 rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-full bg-primary/20 blur-[100px] pointer-events-none" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Career Momentum</h3>
                                    <p className="text-xs font-medium text-slate-400">You're in the top 15% of active seekers in your region.</p>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Success Rate</p>
                                        <p className="text-xl font-bold text-white">{statsData?.successRate || 0}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Interview Rate</p>
                                        <p className="text-xl font-bold text-emerald-400">
                                            {statsData?.totalApplications ? Math.round((statsData.interviewing / statsData.totalApplications) * 100) : 0}%
                                        </p>
                                    </div>
                                    <Link href="/jobs" className="btn btn-primary !bg-white !text-slate-900 border-none px-6 py-2.5 text-xs font-bold">
                                        Explore More Roles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
