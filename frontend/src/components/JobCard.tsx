'use client';

import { Building2, Globe, ArrowUpRight, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
    job: {
        id: string;
        title: string;
        description: string;
        company: {
            id: string;
            name: string;
            logoUrl?: string;
            location: string;
        };
        createdAt: string;
        salaryRange?: string;
        type: string;
    };
}

export default function JobCard({ job }: JobCardProps) {
    const date = new Date(job.createdAt).toLocaleDateString();

    return (
        <div className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 relative flex flex-col h-full">
            <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors duration-300 overflow-hidden">
                    {job.company?.logoUrl ? (
                        <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-emerald-100/50">
                        {job.company?.location || 'Remote'}
                    </span>
                    {job.salaryRange && (
                        <span className="text-xs font-bold text-slate-900">{job.salaryRange}</span>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <Link href={`/jobs/${job.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug mb-2">
                        {job.title}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 font-bold">{job.company?.name || 'Unknown Company'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-60">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.company?.location}</span>
                    </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium opacity-80">
                    {job.description}
                </p>
            </div>

            <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{date}</span>
                </div>
                <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-1 text-primary font-bold text-sm group/btn"
                >
                    Apply Now
                    <ArrowUpRight className="w-4 h-4 transition-colors" />
                </Link>
            </div>
        </div>
    );
}
