'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Users, Briefcase, Loader2, ArrowRight, ExternalLink, Filter, Search, MoreVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboard() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/applications')
            ]);
            setJobs(jobsRes.data.data?.jobs || []);
            setApplications(appsRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Failed to load portal data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (appId: string, status: string) => {
        try {
            await api.patch(`/applications/${appId}/status`, { status });
            toast.success('Status updated successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success('Job deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    return (
        <ProtectedRoute roles={['ADMIN']}>
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />

                <main className="flex-1 pt-24 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Management Console</h1>
                                </div>
                                <p className="text-slate-500 font-medium">Coordinate talent acquisition and refine job postings.</p>
                            </div>

                            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
                                <button
                                    onClick={() => setActiveTab('jobs')}
                                    className={cn(
                                        "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        activeTab === 'jobs' ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    Listings
                                </button>
                                <button
                                    onClick={() => setActiveTab('applications')}
                                    className={cn(
                                        "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        activeTab === 'applications' ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    Applicants
                                </button>
                            </div>
                        </div>

                        {/* Controls & Table */}
                        <div className="glass rounded-[2.5rem] border-white/60 overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/40 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/30">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Filter records..."
                                        className="w-full bg-white/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button className="btn btn-outline p-3 !px-3">
                                        <Filter className="w-5 h-5" />
                                    </button>
                                    {activeTab === 'jobs' && (
                                        <button className="btn btn-primary shadow-xl shadow-blue-500/20 h-12">
                                            <Plus className="w-4 h-4" /> Add Vacancy
                                        </button>
                                    )}
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-40 flex flex-col items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing records...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                                                    {activeTab === 'jobs' ? 'Listing Details' : 'Candidate Info'}
                                                </th>
                                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                                                    {activeTab === 'jobs' ? 'Organization' : 'Applied Position'}
                                                </th>
                                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-center">
                                                    Status
                                                </th>
                                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-right">
                                                    Manage
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white/40">
                                            {activeTab === 'jobs' ? jobs?.map((job: any) => (
                                                <tr key={job.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                    <td className="px-10 py-7">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:rotate-6 transition-transform overflow-hidden">
                                                                {job.company?.logoUrl ? (
                                                                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Briefcase className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                                                                )}
                                                            </div>
                                                            <div className="font-bold text-slate-900 text-lg">{job.title}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-7">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-700">{job.company?.name || 'Unknown Company'}</span>
                                                            <span className="text-xs font-semibold text-slate-400">{job.company?.location}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-7 text-center">
                                                        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-7">
                                                        <div className="flex justify-end gap-3">
                                                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteJob(job.id)}
                                                                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : applications?.map((app: any) => (
                                                <tr key={app.id} className="hover:bg-primary/[0.02] transition-colors group">
                                                    <td className="px-10 py-7">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                                {app.user.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{app.user.name}</span>
                                                                <span className="text-xs font-semibold text-slate-400">{app.user.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-7">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-700">{app.job.title}</span>
                                                            <span className="text-xs font-semibold text-slate-400">{app.job.company?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-7 text-center">
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 outline-none cursor-pointer transition-all",
                                                                app.status === 'Accepted' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                                                    app.status === 'Rejected' ? "bg-rose-50 border-rose-100 text-rose-600" :
                                                                        app.status === 'Interview' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                                                            "bg-primary/5 border-primary/10 text-primary"
                                                            )}
                                                        >
                                                            <option value="Applied">Applied</option>
                                                            <option value="Interview">Interview</option>
                                                            <option value="Accepted">Accepted</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-10 py-7">
                                                        <div className="flex justify-end">
                                                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
