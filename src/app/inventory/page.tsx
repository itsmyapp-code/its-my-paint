"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getJobs } from "@/lib/firestore";
import { Job, PaintSpec } from "@/lib/models";

interface PaintUsage {
  key: string; // manufacturer-colourName
  manufacturer: string;
  colourName: string;
  colourCode?: string;
  range?: string;
  finish: string;
  jobs: {
    jobName: string;
    jobId: string;
    area: string;
    what: string;
  }[];
}

export default function InventoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      const allJobs = await getJobs();
      setJobs(allJobs);
    } catch (error) {
      console.error("Error fetching jobs for inventory:", error);
    } finally {
      setFetching(false);
    }
  };

  const paintUsageData = useMemo(() => {
    const usageMap: Record<string, PaintUsage> = {};

    jobs.forEach(job => {
      job.paintSpecs.forEach(spec => {
        // Create a unique key for the paint combination
        // Using colourName and manufacturer as the primary identity
        const key = `${spec.manufacturer}-${spec.colourName}`.toLowerCase().replace(/\s+/g, '-');
        
        if (!usageMap[key]) {
          usageMap[key] = {
            key,
            manufacturer: spec.manufacturer,
            colourName: spec.colourName,
            colourCode: spec.colourCode,
            range: spec.range,
            finish: spec.finish,
            jobs: []
          };
        }

        usageMap[key].jobs.push({
          jobName: job.name,
          jobId: job.id || "",
          area: spec.area,
          what: spec.what
        });
      });
    });

    // Convert to array and sort by usage count or name
    return Object.values(usageMap).sort((a, b) => b.jobs.length - a.jobs.length);
  }, [jobs]);

  const filteredUsage = useMemo(() => {
    return paintUsageData.filter(usage => 
      usage.colourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usage.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usage.range?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paintUsageData, searchTerm]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-bg-panel-hover border border-transparent hover:border-border-subtle transition-all text-text-main">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-main">
              Paint Usage Inventory
            </h1>
            <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Cross-Project Specification Report</p>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter paints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bg-panel border border-border-subtle rounded-xl py-2 px-10 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Search for mobile */}
        <div className="md:hidden mb-6">
          <input
            type="text"
            placeholder="Filter paints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-panel border border-border-subtle rounded-xl py-3 px-10 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {filteredUsage.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsage.map((usage) => (
              <div key={usage.key} className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col relative overflow-hidden group hover:border-brand/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-brand/10 transition-colors"></div>
                
                <div className="flex items-start justify-between mb-6 z-10">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl border border-white/10 shadow-lg shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: usage.colourCode || '#333' }}
                    />
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight">{usage.colourName}</h3>
                      <p className="text-sm font-bold text-brand uppercase tracking-tighter">{usage.manufacturer}</p>
                    </div>
                  </div>
                  <div className="bg-bg-panel px-3 py-1 rounded-full border border-border-subtle shadow-sm shrink-0">
                    <span className="text-xs font-black text-white">{usage.jobs.length} USES</span>
                  </div>
                </div>

                <div className="mb-6 z-10">
                  <div className="flex flex-wrap gap-2">
                    {usage.range && (
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-text-muted uppercase">
                        Range: <span className="text-white">{usage.range}</span>
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-text-muted uppercase">
                      Finish: <span className="text-white">{usage.finish}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-auto z-10">
                  <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Recent Applications</h4>
                  <div className="space-y-3">
                    {usage.jobs.map((j, idx) => (
                      <Link 
                        key={`${j.jobId}-${idx}`} 
                        href={`/report/${j.jobId}`}
                        className="flex items-center justify-between group/item hover:bg-white/5 p-2 rounded-xl transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover/item:text-brand transition-colors truncate uppercase">{j.jobName}</p>
                          <p className="text-[10px] text-text-muted font-medium uppercase tracking-tighter">{j.area} • {j.what}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-muted group-hover/item:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center opacity-50 border border-dashed border-white/10">
            <p className="text-lg font-medium text-text-muted italic">No paint usage data found matching your search.</p>
          </div>
        )}
      </main>

      <footer className="mt-12 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
          itsmypaint Inventory Analysis System • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
