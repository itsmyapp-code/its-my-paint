"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveJobs, getJobs, updateJob } from "@/lib/firestore";
import { Job, PaintSpec } from "@/lib/models";
import JobModal from "@/components/JobModal";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<'active' | 'archive' | 'reports'>('active');

  const fetchData = async () => {
    try {
      const all = await getJobs();
      setAllJobs(all);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = 
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.paintSpecs.some(spec => 
        (spec.colourName && spec.colourName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (spec.area && spec.area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (spec.what && spec.what.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (spec.notes && spec.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (spec.manufacturer && spec.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    
    const matchesStatus = 
      view === 'active' ? (job.status === 'active' || job.status === 'pending') :
      view === 'archive' ? (job.status === 'archive') :
      (job.status === 'completed');

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const openNewJobModal = () => {
    setSelectedJob(undefined);
    setIsModalOpen(true);
  };

  const openEditJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-border-subtle">
            <Image
              src="/its-my-paint.png"
              alt="itsmypaint logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            itsmy<span className="text-brand">paint</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="relative h-10 w-10 rounded-full bg-bg-panel-hover flex items-center justify-center border border-border-subtle cursor-pointer hover:border-brand transition-colors overflow-hidden" title={user.email || "User"}>
            {user.photoURL ? (
              <Image src={user.photoURL} alt="Profile" fill className="object-cover" />
            ) : (
              <span className="text-sm font-medium">{userInitial}</span>
            )}
          </div>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-bg-panel-hover border border-transparent hover:border-border-subtle transition-all text-text-main"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-12 right-0 w-48 bg-bg-panel border border-border-subtle rounded-2xl shadow-xl p-2 z-50">
              <Link href="/settings" className="block px-4 py-2 rounded-xl text-sm font-medium text-text-main hover:bg-bg-panel-hover transition-colors">
                Settings
              </Link>
              <Link href="/help" className="block px-4 py-2 mt-1 rounded-xl text-sm font-medium text-text-main hover:bg-bg-panel-hover transition-colors">
                Help & Support
              </Link>
              <Link href="/inventory" className="block px-4 py-2 mt-1 rounded-xl text-sm font-medium text-text-main hover:bg-bg-panel-hover transition-colors">
                Inventory Report
              </Link>
              <Link href="/developer" className="block px-4 py-2 mt-1 rounded-xl text-sm font-medium text-text-main hover:bg-bg-panel-hover transition-colors">
                Advanced Tools
              </Link>
              <button 
                onClick={() => import("@/lib/firebase").then(m => m.auth?.signOut())} 
                className="w-full text-left px-4 py-2 mt-1 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Search and New Job Row */}
      <div className="glass-panel rounded-3xl p-6 mb-6 transition-transform hover:scale-[1.01] duration-300">
        <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search jobs, colours, or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-panel-hover border border-border-subtle rounded-2xl py-4 px-14 text-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-inner"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={openNewJobModal}
            className="w-full md:w-auto bg-brand hover:bg-brand/90 text-bg-base font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            NEW JOB
          </button>
        </div>
      </div>

      <main className="space-y-6">
        {/* Dashboard Tabs Toggle */}
        <div className="flex gap-2 p-1.5 bg-bg-panel border border-border-subtle rounded-2xl w-fit">
          <button 
            onClick={() => setView('active')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'active' ? 'bg-brand text-bg-base shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-main'}`}
          >
            ACTIVE
          </button>
          <button 
            onClick={() => setView('reports')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'reports' ? 'bg-brand text-bg-base shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-main'}`}
          >
            REPORTS
          </button>
          <button 
            onClick={() => setView('archive')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'archive' ? 'bg-brand text-bg-base shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-main'}`}
          >
            ARCHIVE
          </button>
        </div>

        {view === 'reports' && (
          <Link 
            href="/inventory"
            className="block w-full p-6 glass-panel rounded-3xl border border-brand/20 bg-brand/5 hover:bg-brand/10 transition-all group overflow-hidden relative"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-brand/20 rounded-2xl flex items-center justify-center text-brand border border-brand/30 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Paint Usage Inventory</h3>
                  <p className="text-sm font-bold text-brand uppercase tracking-tighter">View a summary of all paints used across all projects</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-brand">
                <span className="text-xs font-black uppercase tracking-widest">Open Inventory</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {/* Jobs List */}
        <div 
          className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col transition-transform hover:scale-[1.01] duration-300 relative overflow-hidden h-fit min-h-[200px]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
          
          <div className="flex items-center justify-between mb-8 z-10">
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 bg-brand/20 text-brand text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">
                {view === 'active' ? 'Active Projects' : 'Archived Projects'}
              </span>
              <span className="text-text-muted text-xs font-bold bg-bg-panel px-3 py-1 rounded-full border border-border-subtle">
                {filteredJobs.length} FOUND
              </span>
            </div>
          </div>

          <div className="z-10">
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div 
                    key={job.id}
                    onClick={() => openEditJobModal(job)}
                    className="flex flex-col p-6 rounded-2xl bg-bg-panel border border-border-subtle hover:border-brand/40 transition-all cursor-pointer group hover:shadow-xl hover:shadow-brand/5 relative overflow-hidden h-full min-h-[280px]"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                        job.status === 'active' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20' :
                        job.status === 'pending' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/20' :
                        job.status === 'completed' ? 'bg-purple-500/20 text-purple-500 border border-purple-500/20' :
                        'bg-amber-500/20 text-amber-500 border border-amber-500/20'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4 pr-16">
                        <div className="min-w-0">
                          <h3 className="text-xl font-black text-white leading-tight group-hover:text-brand transition-colors uppercase tracking-tight break-words">{job.name}</h3>
                          <p className="text-sm font-medium text-text-muted truncate mt-0.5">{job.clientName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Date</p>
                          <p className="text-xs font-bold text-white">{new Date(job.dueDate || job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      {job.paintSpecs.length > 0 && (
                        <div className="mb-4 bg-black/40 rounded-xl p-4 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl border border-white/10 shrink-0 shadow-inner"
                              style={{ backgroundColor: job.paintSpecs[0].colourCode || '#333' }}
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-brand uppercase tracking-tighter">{job.paintSpecs[0].what || 'General'}</p>
                              <p className="text-base font-bold text-white truncate">{job.paintSpecs[0].colourName}</p>
                              <p className="text-xs text-text-muted truncate">{job.paintSpecs[0].manufacturer} {job.paintSpecs[0].range}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {job.paintSpecs.slice(1, 4).map((spec, i) => (
                            <div 
                              key={i} 
                              className="w-7 h-7 rounded-full border-2 border-bg-panel shadow-sm"
                              style={{ backgroundColor: spec.colourCode || '#333', zIndex: 10-i }}
                              title={`${spec.area}: ${spec.colourName}`}
                            />
                          ))}
                        </div>
                        {job.paintSpecs.length > 4 && (
                          <span className="text-[10px] text-text-muted font-bold">+{job.paintSpecs.length - 4}</span>
                        )}
                        {job.imageUrls && job.imageUrls.length > 0 && (
                          <div className="ml-2 p-1.5 bg-brand/10 text-brand rounded-lg border border-brand/20" title="Images attached">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (job.id) {
                              const newStatus = (view === 'active' || view === 'reports') ? 'archive' : 'active';
                              updateJob(job.id, { status: newStatus }).then(fetchData);
                            }
                          }}
                          className={`p-2 rounded-xl border transition-all ${
                            (view === 'active' || view === 'reports') 
                              ? 'border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white' 
                              : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                          }`}
                          title={(view === 'active' || view === 'reports') ? 'Archive Job' : 'Restore to Active'}
                        >
                          {(view === 'active' || view === 'reports') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                        </button>
                        <Link 
                          href={`/report/${job.id}?download=true`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-brand/10 text-brand rounded-xl border border-brand/20 hover:bg-brand hover:text-bg-base transition-all"
                          title="Download PDF"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-50">
                <div className="w-20 h-20 bg-bg-panel-hover rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-text-muted mb-6 italic text-lg">No matching jobs found</p>
                <button 
                  onClick={openNewJobModal}
                  className="px-8 py-3 bg-brand/10 text-brand rounded-full text-sm font-bold hover:bg-brand hover:text-bg-base transition-all uppercase tracking-widest border border-brand/20"
                >
                  Create Your First Spec
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Tools Footer Tile */}
        <Link 
          href="/developer"
          className="glass-panel rounded-3xl p-6 flex flex-row items-center justify-between transition-transform hover:scale-[1.01] duration-300 cursor-pointer group hover:border-brand/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-bg-panel-hover rounded-xl flex items-center justify-center group-hover:text-brand transition-colors border border-border-subtle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-text-main">Advanced Tools</h3>
              <p className="text-[10px] text-text-muted mt-1 uppercase">CSV Export & Import</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-text-muted group-hover:text-brand transition-all">
            <span className="text-xs font-bold uppercase tracking-widest">Open Tools</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </main>

      <JobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        initialJob={selectedJob}
      />
    </div>
  );
}
