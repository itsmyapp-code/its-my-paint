"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveJobs, getJobs } from "@/lib/firestore";
import { Job, PaintSpec } from "@/lib/models";
import JobModal from "@/components/JobModal";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);

  const fetchData = async () => {
    try {
      const [active, all] = await Promise.all([getActiveJobs(), getJobs()]);
      setActiveJobs(active);
      setAllJobs(all);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
              <Link href="/developer" className="block px-4 py-2 rounded-xl text-sm font-medium text-text-main hover:bg-bg-panel-hover transition-colors">
                Developer Area
              </Link>
              <button 
                onClick={() => import("@/lib/firebase").then(m => m.auth.signOut())} 
                className="w-full text-left px-4 py-2 mt-1 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[160px]">
        {/* Search */}
        <div className="glass-panel col-span-1 md:col-span-3 lg:col-span-4 row-span-1 rounded-3xl p-6 flex flex-col justify-center transition-transform hover:scale-[1.01] duration-300">
          <div className="relative w-full max-w-3xl mx-auto flex items-center">
            <input
              type="text"
              placeholder="Search jobs, colours, or clients..."
              className="w-full bg-bg-panel-hover border border-border-subtle rounded-2xl py-4 px-14 text-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-inner"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Hero Tile (Active Job) - 2x2 */}
        <div 
          onClick={() => activeJobs.length > 0 && openEditJobModal(activeJobs[0])}
          className="glass-panel col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand/20"></div>
          {activeJobs.length > 0 ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1.5 bg-brand/20 text-brand text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">Active Job</span>
                  <span className="text-text-muted text-sm font-medium bg-bg-panel px-3 py-1 rounded-full border border-border-subtle">
                    Due: {new Date(activeJobs[0].dueDate || activeJobs[0].createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{activeJobs[0].name}</h2>
                <p className="text-text-muted text-lg">{activeJobs[0].clientName}</p>
              </div>
              <div className="flex gap-3 mt-auto items-center">
                <div className="flex -space-x-3">
                  {activeJobs[0].paintSpecs.slice(0, 3).map((spec, i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-bg-base shadow-md relative flex items-center justify-center text-[10px] font-bold text-white/40 uppercase overflow-hidden"
                      style={{ 
                        zIndex: 30 - i,
                        backgroundColor: spec.colourCode || 'var(--bg-panel-hover)'
                      }}
                      title={spec.colourName}
                    >
                      {!spec.colourCode && spec.manufacturer.charAt(0)}
                    </div>
                  ))}
                </div>
                {activeJobs[0].paintSpecs.length > 3 && (
                  <span className="text-sm text-text-muted font-medium ml-2">+{activeJobs[0].paintSpecs.length - 3} more colours</span>
                )}
                <div className="flex-1"></div>
                <div className="w-10 h-10 rounded-full bg-bg-panel flex items-center justify-center group-hover:bg-brand group-hover:text-bg-base transition-colors border border-border-subtle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <p className="text-text-muted mb-4 italic">No active jobs currently</p>
              <button 
                onClick={(e) => { e.stopPropagation(); openNewJobModal(); }}
                className="px-6 py-2 bg-brand/10 text-brand rounded-full text-sm font-bold hover:bg-brand hover:text-bg-base transition-all"
              >
                CREATE YOUR FIRST JOB
              </button>
            </div>
          )}
        </div>

        {/* Quick Add - 1x1 */}
        <div 
          onClick={openNewJobModal}
          className="glass-panel col-span-1 row-span-1 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] duration-300 cursor-pointer group hover:border-brand/50"
        >
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/20 transition-all duration-300 transform group-hover:-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand group-hover:text-bg-base transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="font-bold text-lg">New Job</h3>
          <p className="text-text-muted text-sm mt-1">Record a paint spec</p>
        </div>

        {/* Job Statistics - 1x1 */}
        <div className="glass-panel col-span-1 row-span-1 rounded-3xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300">
          <div className="flex justify-between items-start">
            <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider">Overall</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-text-main">{allJobs.length}</span>
            </div>
            <p className="text-sm text-text-muted mt-2 font-medium">Total Jobs Tracked</p>
          </div>
          <div className="w-full bg-bg-panel-hover h-2.5 rounded-full overflow-hidden mt-3 shadow-inner">
            <div className="bg-brand h-full rounded-full" style={{ width: `${Math.min(100, (allJobs.filter(j => j.status === 'completed').length / (allJobs.length || 1)) * 100)}%` }}></div>
          </div>
        </div>

        {/* Recent Colours */}
        <div className="glass-panel col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-3xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Recent Colours</h3>
            <button className="text-sm font-medium text-text-muted hover:text-brand transition-colors flex items-center gap-1">
              View All <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {allJobs.flatMap(j => j.paintSpecs).slice(0, 8).map((spec, i) => (
              <div key={i} className="min-w-[100px] flex flex-col gap-3 group cursor-pointer">
                <div 
                  className="w-full h-14 rounded-2xl border border-border-subtle shadow-sm group-hover:scale-105 transition-transform duration-300 flex items-center justify-center text-xs font-bold text-white/20"
                  style={{ backgroundColor: spec.colourCode || 'var(--bg-panel-hover)' }}
                >
                  {!spec.colourCode && spec.manufacturer.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm truncate text-text-main group-hover:text-brand transition-colors">{spec.colourName}</p>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-tight mt-0.5">{spec.manufacturer}</p>
                </div>
              </div>
            ))}
            {allJobs.length === 0 && <p className="text-text-muted text-sm italic">No colours recorded yet</p>}
          </div>
        </div>

        <JobModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchData}
          initialJob={selectedJob}
        />

      </main>
    </div>
  );
}
