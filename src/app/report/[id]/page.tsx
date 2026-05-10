"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
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
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center print:hidden shadow-sm">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-600 font-medium hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Dashboard
        </button>
        <button 
          onClick={() => window.print()} 
          className="bg-brand text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          PRINT REPORT
        </button>
      </div>

      {/* Report Content */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl my-8 print:my-0 print:shadow-none min-h-[297mm] p-[20mm]">
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
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-left border-collapse">
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
          <div className="text-right">
            <p className="text-[10px] font-medium text-gray-400 italic">Signature / Approval</p>
            <div className="mt-4 w-48 h-10 border-b border-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
