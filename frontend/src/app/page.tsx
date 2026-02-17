'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, MapPin, Briefcase, Building2, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setFeaturedJobs(response.data.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Search Hero Section */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                <TrendingUp className="w-3 h-3" />
                Over 2,500+ roles added this week
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-8">
                Your next professional <br />
                <span className="text-primary italic">milestone</span> starts here.
              </h1>

              {/* Search Bar Container */}
              <div className="flex flex-col md:flex-row items-stretch gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40">
                <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100">
                  <Search className="w-4 h-4 text-slate-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company..."
                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex items-center px-4 py-2">
                  <MapPin className="w-4 h-4 text-slate-400 mr-3" />
                  <input
                    type="text"
                    placeholder="City, state, or remote..."
                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <Link
                  href={`/jobs?q=${searchQuery}&l=${location}`}
                  className="btn btn-primary !rounded-xl !px-8 py-3.5"
                >
                  Find Jobs
                </Link>
              </div>

              {/* Popular Categories */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Popular:</span>
                {['Engineering', 'Design', 'Product', 'Marketing', 'Sales'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/jobs?category=${cat}`}
                    className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Roles Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured opportunities</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">High-impact roles from fast-growing teams.</p>
            </div>
            <Link
              href="/jobs"
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all"
            >
              Browse all jobs
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    {job.company?.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <span className="px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-tighter">
                        New
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company?.name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.company?.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        {job.type.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Value Prop Lite */}
        <section className="bg-slate-900 py-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                Done applied? Track it like a pro.
              </h2>
              <p className="text-slate-400 max-w-md font-medium">
                Our built-in tracking dashboard helps you visualize your progress and never lose sight of an opportunity.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="btn btn-primary !bg-white !text-slate-900 border-none hover:!bg-slate-100 px-10 py-4 shadow-2xl shadow-white/10"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">TH</span>
              </div>
              <span className="font-bold text-slate-950 tracking-tight">TrackHire</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600">Privacy Policy</Link>
              <Link href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600">Terms of Service</Link>
              <Link href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600">Security</Link>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">© 2026 TrackHire API</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
