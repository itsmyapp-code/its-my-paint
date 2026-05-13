"use client";

import Link from "next/link";
import Image from "next/image";

export default function HelpPage() {
  const categories = [
    {
      title: "Getting Started",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      items: [
        { q: "How do I create a new job?", a: "Click the 'NEW JOB' button on the dashboard. Enter the property name, client details, and start adding your paint specifications." },
        { q: "How do I add paint specs?", a: "Inside the New Job or Edit Job modal, use the 'ADD COLOUR' button to add as many paint specifications as needed for each area of the project." },
        { q: "What is the Archive for?", a: "The Archive is for jobs that are currently inactive or on hold. New CSV imports default to the Archive to keep your active workspace organized." }
      ]
    },
    {
      title: "Reporting & Export",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      items: [
        { q: "How do I generate a PDF report?", a: "On the dashboard, click the download icon on any job card, or open the job and click the PDF icon. This generates a professional, branded specification for your client." },
        { q: "Can I import jobs from Excel?", a: "Yes! Use the 'Advanced Tools' at the bottom of the dashboard to import jobs from a CSV file. Ensure your CSV follows the required format for areas, manufacturers, and colours." },
        { q: "How do I add my business logo?", a: "Go to 'Settings' via the hamburger menu. You can upload your business logo, which will then appear on all your generated PDF reports." }
      ]
    },
    {
      title: "Mobile & Photos",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      items: [
        { q: "How do I add photos on site?", a: "When editing a job on your mobile device, click 'CAMERA' to take a photo instantly or 'UPLOAD' to choose from your gallery. Photos are automatically converted to WebP for fast performance." },
        { q: "Can I use ItsMyPaint offline?", a: "ItsMyPaint is a PWA (Progressive Web App). You can 'Install' it to your home screen. While it requires a connection to save to the cloud, it is optimized for fast mobile use on site." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bg-base p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-brand transition-colors font-bold uppercase tracking-widest text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-border-subtle">
            <Image src="/its-my-paint.png" alt="itsmypaint logo" fill className="object-cover" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            itsmy<span className="text-brand">paint</span> <span className="text-text-muted ml-2 font-medium opacity-50">HELP</span>
          </h1>
        </div>
      </header>

      <main className="space-y-12">
        <section className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">How can we help?</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">Everything you need to know about professional paint specification management with itsmypaint.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="glass-panel rounded-3xl p-8 space-y-6 flex flex-col h-full hover:border-brand/30 transition-colors">
              <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center shadow-inner">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{cat.title}</h3>
                <div className="space-y-6 mt-6">
                  {cat.items.map((item, j) => (
                    <div key={j} className="space-y-2">
                      <h4 className="text-sm font-bold text-brand uppercase tracking-wide leading-tight">{item.q}</h4>
                      <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="glass-panel rounded-3xl p-10 text-center space-y-6 bg-brand/5 border-brand/20">
          <h3 className="text-2xl font-black text-white uppercase">Still have questions?</h3>
          <p className="text-text-muted max-w-xl mx-auto">We are here to help you get the most out of your professional tools. Contact our support team for personal assistance.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:hello@itsmyapp.co.uk" className="bg-brand text-bg-base px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
              Email Support
            </a>
            <Link href="/settings" className="bg-bg-panel-hover text-text-main border border-border-subtle px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:border-brand transition-all">
              Edit Business Info
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-20 py-8 border-t border-border-subtle text-center">
        <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">© 2026 ITSMYPAINT PROFESSIONAL TOOLS</p>
      </footer>
    </div>
  );
}
