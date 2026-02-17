'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import {
    Search, Map, Briefcase, Building2, Filter,
    ChevronRight, MapPin, DollarSign, Clock,
    ArrowUpRight, Bookmark, Share2, Globe, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function JobsPage() {
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [applying, setApplying] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        search: searchParams.get('q') || '',
        location: searchParams.get('l') || '',
        type: 'All',
        experience: 'All',
        salary: 'All'
    });

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await api.get('/jobs');
                const fetchedJobs = response.data.data;
                setJobs(fetchedJobs);
                if (fetchedJobs.length > 0) {
                    setSelectedJob(fetchedJobs[0]);
                }
            } catch (error) {
                toast.error('Failed to load jobs.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId: string) => {
        if (!user) {
            toast.error('Please sign in to apply.');
            return;
        }
        setApplying(true);
        try {
            await api.post('/applications', { jobId });
            toast.success('Application submitted!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to apply.');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 pt-20 flex flex-col">
                {/* Search Bar (Condensed) */}
                <div className="bg-white border-b border-slate-200 py-4 px-6 sticky top-16 z-30">
                    <div className="max-w-7xl mx-auto flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Location..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 gap-6 py-8 h-[calc(100vh-140px)] overflow-hidden">

                    {/* LEFT COL: Filters */}
                    <aside className="w-64 flex-shrink-0 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Job Type</h3>
                                <div className="space-y-2">
                                    {['All', 'Full-time', 'Contract', 'Freelance'].map((t) => (
                                        <label key={t} className="flex items-center gap-3 group cursor-pointer">
                                            <div className={cn(
                                                "w-4 h-4 rounded border-2 transition-all flex items-center justify-center",
                                                filters.type === t ? "border-primary bg-primary text-white" : "border-slate-200 bg-white"
                                            )}>
                                                {filters.type === t && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                className="hidden"
                                                name="type"
                                                checked={filters.type === t}
                                                onChange={() => setFilters({ ...filters, type: t })}
                                            />
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Experience</h3>
                                <div className="space-y-2">
                                    {['All', 'Junior', 'Mid-level', 'Senior', 'Lead'].map((exp) => (
                                        <label key={exp} className="flex items-center gap-3 group cursor-pointer">
                                            <div className={cn(
                                                "w-4 h-4 rounded border-2 transition-all",
                                                filters.experience === exp ? "border-primary bg-primary" : "border-slate-200 bg-white"
                                            )} />
                                            <input type="radio" className="hidden" name="exp" onChange={() => setFilters({ ...filters, experience: exp })} />
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{exp}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* CENTER COL: Job List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-10">
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={cn(
                                        "p-5 rounded-2xl bg-white border cursor-pointer transition-all hover:shadow-lg",
                                        selectedJob?.id === job.id ? "border-primary ring-1 ring-primary/20 shadow-md" : "border-slate-200"
                                    )}
                                >
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-6 h-6 text-slate-300" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900 leading-tight">{job.title}</h4>
                                                <span className="text-[10px] font-black text-slate-400">2d ago</span>
                                            </div>
                                            <p className="text-xs font-bold text-primary mb-3">{job.company}</p>
                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {job.location}</span>
                                                <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> $120k - $160k</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COL: Sticky Details */}
                    <aside className="w-[450px] flex-shrink-0 overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-sm p-8 custom-scrollbar relative">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Loading details...</span>
                            </div>
                        ) : selectedJob ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <Building2 className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 transition-all">
                                            <Bookmark className="w-5 h-5" />
                                        </button>
                                        <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 transition-all">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 leading-tight">
                                        {selectedJob.title}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-bold text-primary">{selectedJob.company}</p>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <p className="text-sm font-bold text-slate-500">{selectedJob.location}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Monthly Salary</p>
                                        <p className="font-bold text-slate-900">$10k - $14k</p>
                                    </div>
                                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Job Type</p>
                                        <p className="font-bold text-slate-900">Full-time</p>
                                    </div>
                                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Employees</p>
                                        <p className="font-bold text-slate-900">50 - 200</p>
                                    </div>
                                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Experience</p>
                                        <p className="font-bold text-slate-900">Senior Level</p>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-slate-100 mb-20">
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4">Role Overview</h3>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            {selectedJob.description}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['React.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'AWS', 'System Design'].map(skill => (
                                                <span key={skill} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Action Footer for Detail View */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-white via-white/100 to-transparent sticky-bottom">
                                    <button
                                        onClick={() => handleApply(selectedJob.id)}
                                        disabled={applying}
                                        className="w-full btn btn-primary !py-4 shadow-xl shadow-blue-500/20 group"
                                    >
                                        {applying ? "Submitting..." : (
                                            <>
                                                Apply for this position
                                                <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <Briefcase className="w-12 h-12 mb-4" />
                                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Select a role to view details</p>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}
