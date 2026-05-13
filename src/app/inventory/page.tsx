"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getJobs, getDecoratorSettings } from "@/lib/firestore";
import { Job, PaintSpec, DecoratorSettings } from "@/lib/models";

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
  const [settings, setSettings] = useState<DecoratorSettings | null>(null);
  const [fetching, setFetching] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportFilter, setReportFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      const [allJobs, decoratorSettings] = await Promise.all([
        getJobs(),
        getDecoratorSettings(user!.uid)
      ]);
      setJobs(allJobs);
      if (decoratorSettings) {
        setSettings(decoratorSettings);
      }
    } catch (error) {
      console.error("Error fetching jobs for inventory:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleDownloadPDF = async (filterKey: string | null = null) => {
    setReportFilter(filterKey);
    setIsGenerating(true);
    
    try {
      // Increase delay to ensure full React render and image loads
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      const element = document.getElementById('inventory-report');
      
      if (!element) return;

      const filename = filterKey 
        ? `Paint_Spec_${filterKey.replace(/-/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        : `Full_Paint_Inventory_${new Date().toISOString().split('T')[0]}.pdf`;

      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          windowWidth: 800 // Force a specific width for capture
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
      // Reset filter after generation
      setTimeout(() => setReportFilter(null), 100);
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
      <style jsx global>{`
        @media print {
          @page { margin: 10mm; size: a4; }
          body { background: white !important; }
          .print-hidden { display: none !important; }
        }
        
        #inventory-report {
          background-color: white !important;
          color: #111827 !important;
          font-family: sans-serif !important;
        }

        #inventory-report * {
          color-scheme: light !important;
          border-color: #e5e7eb !important;
        }

        #inventory-report .text-brand { color: #F59E0B !important; }
        #inventory-report .bg-brand { background-color: #F59E0B !important; }
        #inventory-report .border-brand { border-color: #F59E0B !important; }
        #inventory-report .bg-gray-50 { background-color: #f9fafb !important; }
        #inventory-report .text-gray-900 { color: #111827 !important; }
        #inventory-report .text-gray-600 { color: #4b5563 !important; }
        #inventory-report .text-gray-500 { color: #6b7280 !important; }
        #inventory-report .text-gray-400 { color: #9ca3af !important; }

        .inventory-item {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          border: 1px solid #e5e7eb !important;
          margin-bottom: 20px !important;
          background-color: white !important;
        }
      `}</style>

      {/* Generating Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-[200] bg-bg-base/80 backdrop-blur-sm flex flex-col items-center justify-center print-hidden">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-white uppercase tracking-tight">Generating PDF...</p>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 flex items-center justify-between print-hidden">
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
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block relative">
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
          <button 
            onClick={() => handleDownloadPDF(null)}
            disabled={isGenerating}
            className="bg-brand hover:bg-brand/90 text-bg-base font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-brand/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            PRINT ALL
          </button>
        </div>
      </header>

      <main className="flex-1 print-hidden">
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
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDownloadPDF(usage.key)}
                      className="p-2 bg-brand/10 text-brand rounded-xl border border-brand/20 hover:bg-brand hover:text-bg-base transition-all"
                      title="Download PDF for this colour"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="bg-bg-panel px-3 py-1 rounded-full border border-border-subtle shadow-sm shrink-0">
                      <span className="text-xs font-black text-white">{usage.jobs.length} USES</span>
                    </div>
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

      {/* Printable Report Container (Hidden from view but visible to html2canvas) */}
      <div 
        id="inventory-report" 
        className="fixed top-0 left-0 w-[210mm] bg-white p-10 opacity-0 pointer-events-none"
        style={{ zIndex: -100 }}
      >
        <div className="flex justify-between items-start border-b-2 border-brand pb-8 mb-8">
          <div>
            {settings?.logoUrl && (
              <div className="relative w-32 h-32 mb-4">
                {/* Use standard img for PDF compatibility */}
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain object-left" />
              </div>
            )}
            <h1 className="text-3xl font-black text-gray-900 mb-1">{settings?.businessName || "Paint Usage Inventory"}</h1>
            <p className="text-gray-500 font-medium">Specification Inventory Report</p>
          </div>
          <div className="text-right text-sm">
            <h2 className="text-brand font-black text-xl mb-4 uppercase">Product Inventory</h2>
            <div className="space-y-1 text-gray-600">
              <p>Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              {settings?.email && <p>{settings.email}</p>}
              {settings?.website && <p>{settings.website}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {paintUsageData
            .filter(usage => !reportFilter || usage.key === reportFilter)
            .map((usage) => (
            <div key={usage.key} className="inventory-item border border-gray-200 rounded-2xl p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl border border-gray-200 shadow-sm"
                    style={{ backgroundColor: usage.colourCode || '#f3f4f6' }}
                  />
                  <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase leading-tight">{usage.colourName}</h3>
                    <p className="text-sm font-bold text-brand uppercase tracking-tighter">{usage.manufacturer}</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-full">
                  <p className="text-[10px] font-black text-gray-900 uppercase">{usage.jobs.length} Project Applications</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Product Details</p>
                  <p className="text-xs text-gray-700">Range: <span className="font-bold text-gray-900">{usage.range || 'N/A'}</span></p>
                  <p className="text-xs text-gray-700">Finish: <span className="font-bold text-gray-900">{usage.finish}</span></p>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Colour Specs</p>
                  <p className="text-xs text-gray-700">Ref: <span className="font-mono text-gray-900">{usage.colourCode || 'N/A'}</span></p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Usage History</p>
                <div className="grid grid-cols-1 gap-2">
                  {usage.jobs.map((j, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <p className="text-xs font-bold text-gray-900 uppercase">{j.jobName}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{j.area} • {j.what}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Report Platform</p>
            <p className="text-sm font-bold text-gray-900 uppercase">itsmypaint Professional</p>
          </div>
          <p className="text-[10px] text-gray-400 uppercase font-medium">Page Specification Analysis</p>
        </div>
      </div>
    </div>
  );
}
