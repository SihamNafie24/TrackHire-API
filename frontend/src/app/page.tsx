'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import api from '@/lib/api';
import { Search, MapPin, Building2, Filter, Loader2, XCircle } from 'lucide-react';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (company) params.append('company', company);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, location, company]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Find your next <span className="text-primary">dream job</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Browse through hundreds of job listings from top companies and apply with just one click.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 grid md:grid-cols-10 gap-4">
          <div className="md:col-span-4 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by job title or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-slate-900 text-sm"
            />
          </div>
          <div className="md:col-span-2 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-slate-900 text-sm"
            />
          </div>
          <div className="md:col-span-2 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-slate-900 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <button className="w-full h-full bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-[0.98] flex items-center justify-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Advanced</span>
            </button>
          </div>
        </div>
      </div>

      {/* Job Listing Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {search || location || company ? 'Filtered Results' : 'Recommended for You'}
            <span className="ml-2 text-sm font-medium text-slate-400">({jobs.length} jobs)</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in transition-all">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Hunting for the best jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <XCircle className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No jobs found</h3>
            <p className="mt-2 text-slate-500 max-w-sm">
              We couldn't find any jobs matching your current search or filters. Try adjusting your criteria.
            </p>
            <button
              onClick={() => { setSearch(''); setLocation(''); setCompany(''); }}
              className="mt-6 text-primary font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
