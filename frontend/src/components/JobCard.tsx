'use client';

import { User, Briefcase, MapPin, Building2, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface JobCardProps {
    job: {
        id: string;
        title: string;
        description: string;
        company: string;
        location: string;
        createdAt: string;
    };
}

export default function JobCard({ job }: JobCardProps) {
    const date = new Date(job.createdAt).toLocaleDateString();

    return (
        <div className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                        <Building2 className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {job.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">{job.company}</p>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-slate-600 line-clamp-2 text-sm leading-relaxed">
                {job.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{date}</span>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                >
                    View Details
                    <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
                <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95">
                    Apply Now
                </button>
            </div>
        </div>
    );
}
