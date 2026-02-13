'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Building2, MapPin, Calendar, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
            toast.error('Please login to apply for this job.');
            router.push('/login');
            return;
        }

        setApplying(true);
        try {
            await api.post('/applications', { jobId: id });
            toast.success('Application submitted successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit application.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to all jobs
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-8 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="flex items-center space-x-4 mb-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
                                <p className="text-xl text-slate-300">{job.company}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 relative z-10">
                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Job Description</h2>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                            {job.description.split('\n').map((para: string, i: number) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Interested in this position?</h3>
                                <p className="text-slate-500 text-sm">Submit your application now and our team will review it.</p>
                            </div>
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {applying ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Apply Now</span>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
