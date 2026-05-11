"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getJobs, getDecoratorSettings } from "@/lib/firestore";
import { Job, DecoratorSettings } from "@/lib/models";

export default function ReportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [settings, setSettings] = useState<DecoratorSettings | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && jobId) {
      fetchData();
    }
  }, [user, loading, router, jobId]);

  const fetchData = async () => {
    try {
      const [jobs, decoratorSettings] = await Promise.all([
        getJobs(),
        getDecoratorSettings(user!.uid)
      ]);
      
      const foundJob = jobs.find(j => j.id === jobId);
      if (foundJob) {
        setJob(foundJob);
        // Check for download parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'true') {
          setTimeout(() => {
            handleDownloadPDF(foundJob);
          }, 1000);
        }
      }
      if (decoratorSettings) {
        setSettings(decoratorSettings);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleDownloadPDF = async (jobToDownload?: Job) => {
    const targetJob = jobToDownload || job;
    if (!targetJob) return;

    // Use dynamic import for html2pdf.js to avoid SSR issues
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;
    const element = document.getElementById('report-content');
    
    if (!element) return;

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Paint_Spec_${targetJob.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      // If we came here via download=true, we might want to close the tab or go back
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        // Option: router.push('/') or window.close()
      }
    });
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white print:hidden">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center print:hidden">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-brand text-white rounded-xl">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white pb-20">
      <style jsx global>{`
        @media print {
          /* Hide browser headers/footers by setting margin to 0 */
          @page {
            margin: 0;
            size: auto;
          }
          
          /* Add padding back to the body so content doesn't hit the edge */
          body {
            padding: 15mm;
            background: white !important;
          }

          /* Hide app footer and control bars */
          nav, footer, .print-hidden, .sticky {
            display: none !important;
          }

          .glass-panel {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Control Bar */}
      <div className="sticky top-0 z-[100] bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center print:hidden shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-gray-600 font-medium hover:text-brand transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Dashboard
        </Link>
        <button 
          onClick={() => handleDownloadPDF()} 
          className="bg-brand hover:bg-brand/90 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          DOWNLOAD PDF
        </button>
      </div>

      {/* Report Content */}
      <div id="report-content" className="w-full md:max-w-[210mm] mx-auto bg-white shadow-2xl my-8 print:my-0 print:shadow-none min-h-screen md:min-h-[297mm] p-4 md:p-[20mm]">
        {/* Report Header */}
        <div className="flex justify-between items-start border-b-2 border-brand pb-8 mb-8">
          <div>
            {settings?.logoUrl && (
              <div className="relative w-32 h-32 mb-4">
                <Image src={settings.logoUrl} alt="Logo" fill className="object-contain object-left" />
              </div>
            )}
            <h1 className="text-3xl font-black text-gray-900 mb-1">{settings?.businessName || "Paint Specification Report"}</h1>
            <p className="text-gray-500 font-medium">{settings?.contactName}</p>
          </div>
          <div className="text-right text-sm">
            <h2 className="text-brand font-black text-xl mb-4">PAINT SPECIFICATION</h2>
            <div className="space-y-1 text-gray-600">
              {settings?.email && <p>{settings.email}</p>}
              {settings?.phone && <p>{settings.phone}</p>}
              {settings?.website && <p>{settings.website}</p>}
              {settings?.address && <p className="whitespace-pre-line">{settings.address}</p>}
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-[10px] font-black text-brand uppercase tracking-widest mb-4">Project Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Property / Job Name</p>
                <p className="text-lg font-bold text-gray-900">{job.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Project Date</p>
                <p className="text-gray-700">{new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${job.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-brand/10 text-brand'}`}>
                  {job.status}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-[10px] font-black text-brand uppercase tracking-widest mb-4">Client Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Name</p>
                <p className="text-lg font-bold text-gray-900">{job.clientName}</p>
              </div>
              {job.clientEmail && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Contact</p>
                  <p className="text-gray-700">{job.clientEmail}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Paint Specifications Table */}
        <div className="mb-12">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand rounded-full"></span>
            Technical Specifications
          </h3>
          <div className="overflow-x-auto -mx-4 md:mx-0 rounded-2xl border border-gray-200">
            <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
              <thead>
                <tr className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Area / Surface</th>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4 text-center">Colour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {job.paintSpecs.map((spec, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-6">
                      <p className="font-black text-gray-900 text-lg uppercase leading-tight">{spec.area}</p>
                      <p className="text-sm font-bold text-brand">{spec.what}</p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">{spec.manufacturer} {spec.range}</p>
                        <p className="text-sm text-gray-600">Finish: <span className="font-bold">{spec.finish}</span></p>
                        {spec.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 border-l-2 border-yellow-400 rounded-r-md">
                            <p className="text-[10px] font-bold text-yellow-700 uppercase mb-0.5">Application Notes</p>
                            <p className="text-xs italic text-yellow-800">{spec.notes}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div 
                          className="w-16 h-16 rounded-2xl border border-gray-200 shadow-inner mb-2"
                          style={{ backgroundColor: spec.colourCode || '#f3f4f6' }}
                        />
                        <p className="text-[10px] font-black text-gray-900 uppercase whitespace-nowrap">{spec.colourName}</p>
                        {spec.colourCode && <p className="text-[10px] text-gray-400 font-mono">{spec.colourCode}</p>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Photos Section */}
        {job.imageUrls && job.imageUrls.length > 0 && (
          <div className="mb-12 break-inside-avoid">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand rounded-full"></span>
              Site Reference Photos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {job.imageUrls.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <Image src={url} alt={`Site photo ${i+1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-12 border-t border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Report Generated By</p>
            <p className="text-sm font-bold text-gray-900">ItsMyPaint Professional Specification Tool</p>
          </div>
        </div>
      </div>
    </div>
  );
}
