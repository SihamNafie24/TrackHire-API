'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import api from '@/lib/api';
import { Search, MapPin, Briefcase, ChevronRight, Star, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    if (activeFilters.length === 0) return matchesSearch;

    const matchesFilter = activeFilters.some(filter =>
      job.location.includes(filter) || job.type?.includes(filter)
    );

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section - Split Layout */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-16 items-center overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6">
              <Star className="w-3 h-3 fill-current" />
              <span>New: Visual Search Tracking</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Manage your job search <br />
              <span className="text-primary">with clarity.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
              The professional ecosystem for ambitious developers to track, manage, and optimize their career trajectory with data-driven insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="btn btn-primary !px-10 !py-4 shadow-xl shadow-blue-500/20"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn btn-outline !px-10 !py-4 transition-all">
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <span className="text-xs font-medium">Joined by 2,000+ professionals</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-2 transform scale-105" />
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden aspect-square md:aspect-video flex items-center justify-center p-8">
              <div className="w-full h-full bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col gap-4">
                <div className="h-8 w-1/3 bg-slate-200 rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-primary/10 rounded-xl" />
                  <div className="h-20 bg-secondary/10 rounded-xl" />
                  <div className="h-20 bg-slate-100 rounded-xl" />
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-100 p-4 space-y-3">
                  <div className="h-4 w-full bg-slate-50 rounded" />
                  <div className="h-4 w-5/6 bg-slate-50 rounded" />
                  <div className="h-4 w-4/6 bg-slate-50 rounded" />
                </div>
              </div>
            </div>
            {/* Floating Metric Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden lg:block animate-bounce-subtle">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
              <p className="text-2xl font-black text-slate-900">+84%</p>
            </div>
          </div>
        </section>

        {/* Social Proof / Metrics */}
        <section className="bg-slate-50 border-y border-slate-100 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-16">
              {[
                { label: 'Active Jobs', value: '120+', icon: Briefcase },
                { label: 'Hiring Companies', value: '50+', icon: Users },
                { label: 'Applications Tracked', value: '1,200+', icon: CheckCircle },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 text-primary">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase">{stat.value}</h3>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
              {['Google', 'Airbnb', 'Stripe', 'Figma', 'Slack'].map(logo => (
                <span key={logo} className="text-xl font-bold tracking-tighter text-slate-900">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Job Board Section */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Modern Sidebar with Toggles */}
            <aside className="md:w-72 space-y-10">
              <div className="sticky top-24">
                <div className="mb-10">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Search</h3>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Title or company..."
                      className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Location
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Remote', 'San Francisco', 'London', 'Berlin'].map(loc => (
                        <button
                          key={loc}
                          onClick={() => toggleFilter(loc)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeFilters.includes(loc)
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                            }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" /> Contract
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Full-time', 'Contract', 'Internship'].map(type => (
                        <button
                          key={type}
                          onClick={() => toggleFilter(type)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeFilters.includes(type)
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Open Positions</h2>
                  <p className="text-sm font-medium text-slate-500">Discover your next career milestone.</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  {filteredJobs.length} Results
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-64 bg-slate-100/50 rounded-2xl animate-pulse border border-slate-100" />
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJobs.map((job: any) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No matching roles found</h3>
                  <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-lg text-white font-black text-xs">TH</div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">TrackHire</span>
              </div>
              <p className="text-sm text-slate-400 font-medium max-w-xs">
                Empowering developers to navigate their career with confidence and precision.
              </p>
            </div>

            <div className="flex gap-12">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Platform</h4>
                <div className="flex flex-col gap-2">
                  {['Explore', 'Dashboard', 'Pricing'].map(l => (
                    <a key={l} href="#" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">{l}</a>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Company</h4>
                <div className="flex flex-col gap-2">
                  {['About', 'Contact', 'Twitter'].map(l => (
                    <a key={l} href="#" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">{l}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-xs font-medium text-slate-400">© 2026 TrackHire Inc. All rights reserved.</span>
            <div className="flex gap-6 text-xs font-medium text-slate-400">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
