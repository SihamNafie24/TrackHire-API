'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import JobCard from '@/components/JobCard';
import api from '@/lib/api';
import { Search, SlidersHorizontal, MapPin, Briefcase, X } from 'lucide-react';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredJobs = jobs.filter((job: any) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-[-10%] right-[10%] w-[40%] h-[80%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[80%] bg-secondary/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 leading-[1] mb-8">
              Track your next <br />
              <span className="text-primary italic">dream job.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              The modern way to organize your career. Find high-quality tech roles and track every application status in one premium interface.
            </p>

            {/* Premium Dual-Input Search Bar (Reference Match) */}
            <div className="max-w-4xl mx-auto mt-12 mb-16 px-4">
              <div className="bg-white rounded-full border border-slate-200 p-1.5 flex flex-col md:flex-row items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500">

                {/* Keywords Section */}
                <div className="flex-1 flex items-center min-w-0 w-full md:w-auto px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100/80 group">
                  <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[#0055D4] transition-colors shrink-0" />
                  <input
                    type="text"
                    placeholder="Intitulé de poste, mots-clés..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-md px-4 py-2 placeholder:text-slate-400 font-medium text-slate-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Location Section */}
                <div className="flex-1 flex items-center min-w-0 w-full md:w-auto px-4 py-2 group">
                  <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-[#0055D4] transition-colors shrink-0" />
                  <input
                    type="text"
                    placeholder="Ville, département, code p..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-md px-4 py-2 placeholder:text-slate-400 font-medium text-slate-700"
                  />
                </div>

                {/* Search Button */}
                <button className="w-full md:w-auto bg-[#0055D4] text-white px-8 py-3.5 rounded-full font-bold text-sm whitespace-nowrap hover:bg-[#0047b3] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200">
                  Lancer la recherche
                </button>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {['Remote', 'Full-time', 'Internship', 'Tech', 'Marketing'].map((tag) => (
                <button
                  key={tag}
                  className="px-6 py-2.5 bg-white/50 hover:bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 transition-all hover:shadow-md active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Section */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Minimal Sidebar Filter */}
            <aside className={`md:w-64 space-y-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="glass rounded-[2rem] p-8 sticky top-32 border-white/40">
                <div className="flex items-center justify-between mb-8 md:hidden">
                  <h3 className="font-bold text-xl">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location
                    </h4>
                    <div className="space-y-4">
                      {['Remote', 'San Francisco', 'Europe', 'Remote-only'].map(loc => (
                        <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-6 h-6 rounded-xl border-slate-200 text-primary focus:ring-primary/20 transition-all" />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Type
                    </h4>
                    <div className="space-y-4">
                      {['Contract', 'Full-time', 'Freelance'].map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-6 h-6 rounded-xl border-slate-200 text-primary focus:ring-primary/20 transition-all" />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content: Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Open Roles</h2>
                  <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                    {filteredJobs.length} Positions
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl text-sm font-bold shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-64 bg-slate-100/50 rounded-[2rem] animate-pulse border border-slate-100" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredJobs.map((job: any) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">TrackHire</span>
            <span className="text-slate-400 text-sm font-medium">© 2026 SaaS Corp</span>
          </div>
          <div className="flex gap-8">
            {['Twitter', 'LinkedIn', 'Product Hunt', 'Contact'].map(link => (
              <a key={link} href="#" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
