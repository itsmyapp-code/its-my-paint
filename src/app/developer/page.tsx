"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { getJobs, createJob } from "@/lib/firestore";
import { exportJobsToCSV, parseCSVToJobs } from "@/lib/csv";
import { useState } from "react";

export default function DeveloperPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Redirect if not logged in or not the developer
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.email !== "martin@cozens.me.uk") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleExport = async () => {
    try {
      const jobs = await getJobs();
      exportJobsToCSV(jobs);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage(null);
    try {
      const text = await file.text();
      const jobsToImport = parseCSVToJobs(text);
      
      let count = 0;
      for (const job of jobsToImport) {
        await createJob(job as any);
        count++;
      }
      
      setMessage({ text: `Successfully imported ${count} jobs!`, type: 'success' });
    } catch (error) {
      console.error("Import failed:", error);
      setMessage({ text: "Import failed. Please check the CSV format.", type: 'error' });
    } finally {
      setImporting(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Currently open to all logged-in users, but we will restrict it later based on Developer email address
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-bg-panel-hover border border-transparent hover:border-border-subtle transition-all text-text-main">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            Advanced Tools
          </h1>
          <p className="text-text-muted text-sm">Manage data portability</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 glass-panel rounded-3xl p-8 border border-border-subtle/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center py-12">
          <div className="w-20 h-20 bg-bg-panel-hover rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-border-subtle text-brand">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Advanced Data Tools</h2>
          <p className="text-text-muted max-w-md mx-auto mb-8">
            Manage your job records using standard CSV templates. This allows for bulk updates and external record keeping.
          </p>

          <div className="mt-12 w-full max-w-2xl text-left border-t border-border-subtle/30 pt-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Data Portability
            </h3>
            <p className="text-sm text-text-muted mb-6">Manage job data using standard UK trade manufacturer templates.</p>
            
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleExport}
                className="flex-1 py-3 px-4 bg-bg-panel border border-border-subtle rounded-xl text-text-main font-bold hover:border-brand/50 transition-all flex items-center justify-center gap-2 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                EXPORT CSV
              </button>
              
              <label className="flex-1 py-3 px-4 bg-brand hover:bg-brand/90 text-bg-base font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-center">
                {importing ? (
                  <div className="w-5 h-5 border-2 border-bg-base border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    IMPORT CSV
                  </>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".csv" 
                  onChange={handleImport}
                  disabled={importing}
                />
              </label>
            </div>
            
            <p className="mt-4 text-[10px] text-text-muted uppercase tracking-widest font-bold text-center">
              Standard Template: Area | What | Manufacturer | Range | Colour Name | Finish | Notes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
