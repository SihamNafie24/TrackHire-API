'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Briefcase, Clock, CheckCircle2, XCircle, ChevronRight, LayoutDashboard, Calendar, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get('/applications/my');
                setApplications(response.data.data);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'Rejected': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'Interview': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Accepted': return <CheckCircle2 className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            case 'Interview': return <Clock className="w-4 h-4" />;
            default: return <Briefcase className="w-4 h-4" />;
        }
    };

    return (
        <ProtectedRoute roles={['USER', 'ADMIN']}>
            <main className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                                <LayoutDashboard className="w-8 h-8 text-primary" />
                                My Applications
                            </h1>
                            <p className="mt-2 text-slate-500 font-medium">Manage and track your job application progress.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 text-center flex-1">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Applied</p>
                                <p className="text-2xl font-black text-slate-900">{applications.length}</p>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 text-center flex-1">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Interviewing</p>
                                <p className="text-2xl font-black text-amber-500">
                                    {applications.filter((a: any) => a.status === 'Interview').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100" />
                            ))}
                        </div>
                    ) : applications.length > 0 ? (
                        <div className="grid gap-4">
                            {applications.map((app: any) => (
                                <div
                                    key={app.id}
                                    className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                                            <Building2 className="w-7 h-7 text-slate-300 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                {app.job.title}
                                            </h3>
                                            <p className="text-slate-500 font-medium flex items-center gap-1.5 transition-colors">
                                                {app.job.company}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-6">
                                        <div className="flex flex-col md:items-end">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Updated on</span>
                                            <div className="flex items-center text-slate-500 text-sm font-bold gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-black border-2 flex items-center gap-2",
                                            getStatusColor(app.status)
                                        )}>
                                            {getStatusIcon(app.status)}
                                            {app.status.toUpperCase()}
                                        </div>

                                        <button className="p-2 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-50 p-6 rounded-full mb-6 text-slate-300">
                                <Briefcase className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">No applications yet</h3>
                            <p className="mt-3 text-slate-500 max-w-sm font-medium">
                                You haven't applied for any jobs yet. Start exploring the job board to find your next opportunity!
                            </p>
                            <a
                                href="/"
                                className="mt-8 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                            >
                                Find Jobs
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
