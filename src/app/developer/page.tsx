"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DeveloperPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
            Developer Area
          </h1>
          <p className="text-text-muted text-sm">Manage configuration and telemetry</p>
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
          <h2 className="text-2xl font-bold mb-2">Developer Dashboard</h2>
          <p className="text-text-muted max-w-md mx-auto mb-8">
            This area is restricted to authorized developers. Use the tools below to manage and monitor the application.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
            <div className="bg-bg-panel border border-border-subtle rounded-xl p-5 hover:border-brand/50 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-text-main group-hover:text-brand transition-colors mb-1">Telemetry Metrics</h3>
              <p className="text-sm text-text-muted">View user engagement and app performance data.</p>
            </div>
            <div className="bg-bg-panel border border-border-subtle rounded-xl p-5 hover:border-brand/50 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-text-main group-hover:text-brand transition-colors mb-1">Feature Flags</h3>
              <p className="text-sm text-text-muted">Toggle experimental features across the application.</p>
            </div>
            <div className="bg-bg-panel border border-border-subtle rounded-xl p-5 hover:border-brand/50 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-text-main group-hover:text-brand transition-colors mb-1">User Management</h3>
              <p className="text-sm text-text-muted">Review and manage authenticated users in the system.</p>
            </div>
            <div className="bg-bg-panel border border-border-subtle rounded-xl p-5 hover:border-brand/50 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-text-main group-hover:text-brand transition-colors mb-1">System Logs</h3>
              <p className="text-sm text-text-muted">Monitor application health and error reports.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
