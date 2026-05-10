import Image from "next/image";

export default function Home() {
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
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-bg-panel-hover flex items-center justify-center border border-border-subtle cursor-pointer hover:border-brand transition-colors">
            <span className="text-sm font-medium">MC</span>
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[160px]">
        {/* Search */}
        <div className="glass-panel col-span-1 md:col-span-3 lg:col-span-4 row-span-1 rounded-3xl p-6 flex flex-col justify-center transition-transform hover:scale-[1.01] duration-300">
          <div className="relative w-full max-w-3xl mx-auto flex items-center">
            <input
              type="text"
              placeholder="Search jobs, colors, or clients..."
              className="w-full bg-bg-panel-hover border border-border-subtle rounded-2xl py-4 px-14 text-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-inner"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Hero Tile (Active Job) - 2x2 */}
        <div className="glass-panel col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand/20"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1.5 bg-brand/20 text-brand text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">Active Job</span>
              <span className="text-text-muted text-sm font-medium bg-bg-panel px-3 py-1 rounded-full border border-border-subtle">Due: Oct 24</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">1428 Elm Street</h2>
            <p className="text-text-muted text-lg">Exterior respray - Front facade and trim</p>
          </div>
          <div className="flex gap-3 mt-auto items-center">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F5DC] border-2 border-bg-base shadow-md relative z-20" title="Navajo White"></div>
              <div className="w-10 h-10 rounded-full bg-[#1e293b] border-2 border-bg-base shadow-md relative z-10" title="Slate Black"></div>
            </div>
            <span className="text-sm text-text-muted font-medium ml-2">+2 more colors</span>
            <div className="flex-1"></div>
            <div className="w-10 h-10 rounded-full bg-bg-panel flex items-center justify-center group-hover:bg-brand group-hover:text-bg-base transition-colors border border-border-subtle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Add - 1x1 */}
        <div className="glass-panel col-span-1 row-span-1 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] duration-300 cursor-pointer group hover:border-brand/50">
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
            <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider">This Month</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-text-main">12</span>
              <span className="text-sm text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">+2</span>
            </div>
            <p className="text-sm text-text-muted mt-2 font-medium">Jobs Completed</p>
          </div>
          <div className="w-full bg-bg-panel-hover h-2.5 rounded-full overflow-hidden mt-3 shadow-inner">
            <div className="bg-brand h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Recent Colors */}
        <div className="glass-panel col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-3xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Recent Colors</h3>
            <button className="text-sm font-medium text-text-muted hover:text-brand transition-colors flex items-center gap-1">
              View All <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {/* Swatch 1 */}
            <div className="min-w-[90px] flex flex-col gap-3 group cursor-pointer">
              <div className="w-full h-14 rounded-2xl bg-[#F5F5DC] border border-border-subtle shadow-sm group-hover:scale-105 transition-transform duration-300"></div>
              <div>
                <p className="font-semibold text-sm truncate text-text-main group-hover:text-brand transition-colors">Navajo White</p>
                <p className="text-text-muted text-xs font-medium mt-0.5">BM-OC-95</p>
              </div>
            </div>
            {/* Swatch 2 */}
            <div className="min-w-[90px] flex flex-col gap-3 group cursor-pointer">
              <div className="w-full h-14 rounded-2xl bg-[#2F4F4F] border border-border-subtle shadow-sm group-hover:scale-105 transition-transform duration-300"></div>
              <div>
                <p className="font-semibold text-sm truncate text-text-main group-hover:text-brand transition-colors">Dark Slate</p>
                <p className="text-text-muted text-xs font-medium mt-0.5">SW-7622</p>
              </div>
            </div>
            {/* Swatch 3 */}
            <div className="min-w-[90px] flex flex-col gap-3 group cursor-pointer">
              <div className="w-full h-14 rounded-2xl bg-[#B0C4DE] border border-border-subtle shadow-sm group-hover:scale-105 transition-transform duration-300"></div>
              <div>
                <p className="font-semibold text-sm truncate text-text-main group-hover:text-brand transition-colors">Light Steel</p>
                <p className="text-text-muted text-xs font-medium mt-0.5">BM-1632</p>
              </div>
            </div>
            {/* Swatch 4 */}
            <div className="min-w-[90px] flex flex-col gap-3 group cursor-pointer">
              <div className="w-full h-14 rounded-2xl bg-[#A52A2A] border border-border-subtle shadow-sm group-hover:scale-105 transition-transform duration-300"></div>
              <div>
                <p className="font-semibold text-sm truncate text-text-main group-hover:text-brand transition-colors">Barn Red</p>
                <p className="text-text-muted text-xs font-medium mt-0.5">SW-7591</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
