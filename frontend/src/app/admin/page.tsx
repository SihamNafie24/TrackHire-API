'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Users, Briefcase, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

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
            setJobs(jobsRes.data.data.jobs);
            setApplications(appsRes.data.data);
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
            <main className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Portal Admin</h1>
                            <p className="mt-2 text-slate-500 font-medium">Control center for job postings and candidate tracking.</p>
                        </div>

                        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                    activeTab === 'jobs' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:text-primary"
                                )}
                            >
                                <Briefcase className="w-4 h-4" />
                                Jobs Management
                            </button>
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                    activeTab === 'applications' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:text-primary"
                                )}
                            >
                                <Users className="w-4 h-4" />
                                Applications
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                    ) : activeTab === 'jobs' ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">Active Job Postings</h2>
                                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                                    <Plus className="w-4 h-4" />
                                    Create New Job
                                </button>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Job Title</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Company</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Location</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {jobs.map((job: any) => (
                                            <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</span>
                                                </td>
                                                <td className="px-8 py-5 font-medium text-slate-500">{job.company}</td>
                                                <td className="px-8 py-5 font-medium text-slate-500">{job.location}</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteJob(job.id)}
                                                            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Submitted Applications</h2>
                            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Applicant</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Job Position</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-right">Update Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {applications.map((app: any) => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900">{app.user.name}</span>
                                                        <span className="text-xs font-semibold text-slate-400">{app.user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-700">{app.job.title}</span>
                                                        <span className="text-xs font-semibold text-slate-400">{app.job.company}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border-2",
                                                        app.status === 'Accepted' ? "border-emerald-100 bg-emerald-50 text-emerald-600" :
                                                            app.status === 'Rejected' ? "border-rose-100 bg-rose-50 text-rose-600" :
                                                                app.status === 'Interview' ? "border-amber-100 bg-amber-50 text-amber-600" :
                                                                    "border-blue-100 bg-blue-50 text-blue-600"
                                                    )}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex justify-end">
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                            className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-primary/20 py-2.5 px-4 outline-none transition-all cursor-pointer"
                                                        >
                                                            <option value="Applied">Applied</option>
                                                            <option value="Interview">Interview</option>
                                                            <option value="Accepted">Accepted</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
