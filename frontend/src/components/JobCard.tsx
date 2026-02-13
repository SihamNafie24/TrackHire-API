'use client';

import { Building2, Globe, Heart, ArrowUpRight, MapPin } from 'lucide-react';
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
        <div className="group bg-white border border-slate-200/60 rounded-[2rem] p-8 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                    <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <button className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                        Open Position
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Globe className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{job.location === 'Remote' ? 'Worldwide' : 'Hybrid'}</span>
                    </div>
                </div>

                <Link href={`/jobs/${job.id}`}>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight mb-2">
                        {job.title}
                    </h3>
                </Link>

                <p className="text-sm font-semibold text-slate-500 mb-6 flex items-center gap-2 italic">
                    {job.company}
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="flex items-center gap-1 normal-case not-italic font-medium">
                        <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                </p>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                    {job.description}
                </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">
                    Posted {date}
                </span>
                <Link
                    href={`/jobs/${job.id}`}
                    className="flex items-center gap-1.5 text-primary font-bold text-sm group/btn"
                >
                    View Details
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </Link>
            </div>
        </div>
    );
}
