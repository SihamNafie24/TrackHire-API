'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Building2, MapPin, Calendar, ArrowLeft, Loader2, Share2, Bookmark, CheckCircle2, Globe, ArrowUpRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function JobDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                setJob(response.data.data);
            } catch (error) {
                toast.error('Could not load job details.');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            toast.error('Sign in to start your application.');
            router.push('/login');
            return;
        }

        setApplying(true);
        try {
            await api.post('/applications', { jobId: id });
            toast.success('Your application has been received!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit application.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Building view...</p>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-6">

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all mb-12 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Jobs
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="glass rounded-[2.5rem] p-8 md:p-12 mb-8 border-white/50">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                                    <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center border border-slate-100 shadow-xl overflow-hidden hover:rotate-3 transition-transform duration-500">
                                        {job.company?.logoUrl ? (
                                            <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-10 h-10 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                                {job.locationType.replace('_', ' ').toLowerCase()}
                                            </span>
                                            <span className="bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                                {job.type.replace('_', ' ').toLowerCase()}
                                            </span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                                            {job.title}
                                        </h1>
                                        <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-sm font-bold text-slate-500 italic">
                                            <span className="text-primary not-italic font-black flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                {job.company?.name}
                                            </span>
                                            <span className="flex items-center gap-1.5 not-italic">
                                                <MapPin className="w-4 h-4" /> {job.company?.location}
                                            </span>
                                            <span className="flex items-center gap-1.5 not-italic text-slate-300">
                                                <Calendar className="w-4 h-4" /> {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 w-full mb-12" />

                                <div className="prose prose-slate max-w-none">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Job Overview</h2>
                                    <div className="text-slate-600 font-medium leading-[1.8] space-y-4">
                                        {job.description.split('\n').map((para: string, i: number) => (
                                            para.trim() && <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Application Actions */}
                        <aside className="lg:w-80 h-fit sticky top-32">
                            <div className="glass rounded-[2rem] p-8 border-white/60 shadow-2xl">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Ready to apply?</h3>
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="w-full btn-premium bg-primary text-white py-5 rounded-2xl font-bold text-lg mb-4 flex items-center justify-center gap-3 overflow-hidden group"
                                >
                                    {applying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            Start Application
                                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </>
                                    )}
                                </button>
                                <button className="w-full py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 mb-8">
                                    <Bookmark className="w-5 h-5" /> Save Role
                                </button>

                                <div className="space-y-6 pt-6 border-t border-slate-100">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Actively Hiring</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">Response expected in 48h</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Globe className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Global Reach</p>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">Accepting worldwide candidates</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                                    <Share2 className="w-4 h-4" /> Share this position
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
