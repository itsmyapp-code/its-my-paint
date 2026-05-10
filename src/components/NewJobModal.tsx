"use client";

import { useState } from "react";
import { createJob } from "@/lib/firestore";
import { PaintSpec } from "@/lib/models";

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewJobModal({ isOpen, onClose, onSuccess }: NewJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    dueDate: "",
    status: "active" as const,
  });

  const [paintSpecs, setPaintSpecs] = useState<PaintSpec[]>([
    { manufacturer: "", colorName: "", finish: "Matte" }
  ]);

  if (!isOpen) return null;

  const handleAddPaintSpec = () => {
    setPaintSpecs([...paintSpecs, { manufacturer: "", colorName: "", finish: "Matte" }]);
  };

  const handleRemovePaintSpec = (index: number) => {
    setPaintSpecs(paintSpecs.filter((_, i) => i !== index));
  };

  const handlePaintSpecChange = (index: number, field: keyof PaintSpec, value: string) => {
    const updatedSpecs = [...paintSpecs];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setPaintSpecs(updatedSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createJob({
        ...formData,
        startDate: new Date().toISOString(),
        paintSpecs: paintSpecs.filter(spec => spec.manufacturer && spec.colorName),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-bold text-white">Record New Paint Spec</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          {/* Job Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-brand rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Job Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 ml-1">Job Name / Address</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 1428 Elm Street Exterior"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 ml-1">Client Name</label>
                <input
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 ml-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 ml-1">Client Contact (Optional)</label>
                <input
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="Email or Phone"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Paint Specs Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-brand rounded-full"></div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Paint Specifications</h3>
              </div>
              <button 
                type="button"
                onClick={handleAddPaintSpec}
                className="text-xs font-bold text-brand hover:text-brand/80 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                ADD COLOR
              </button>
            </div>

            <div className="space-y-4">
              {paintSpecs.map((spec, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group animate-in slide-in-from-right-4 duration-300">
                  {paintSpecs.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemovePaintSpec(index)}
                      className="absolute top-2 right-2 p-1.5 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Manufacturer</label>
                      <input
                        placeholder="e.g. Benjamin Moore"
                        value={spec.manufacturer}
                        onChange={(e) => handlePaintSpecChange(index, "manufacturer", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Color Name</label>
                      <input
                        placeholder="e.g. Navajo White"
                        value={spec.colorName}
                        onChange={(e) => handlePaintSpecChange(index, "colorName", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Hex Code (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={spec.colorCode || "#ffffff"}
                          onChange={(e) => handlePaintSpecChange(index, "colorCode", e.target.value)}
                          className="w-10 h-9 bg-transparent border-none cursor-pointer"
                        />
                        <input
                          placeholder="#FFFFFF"
                          value={spec.colorCode || ""}
                          onChange={(e) => handlePaintSpecChange(index, "colorCode", e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Finish</label>
                      <select
                        value={spec.finish}
                        onChange={(e) => handlePaintSpecChange(index, "finish", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30 appearance-none cursor-pointer"
                      >
                        <option value="Matte" className="bg-[#1a1a1a]">Matte</option>
                        <option value="Eggshell" className="bg-[#1a1a1a]">Eggshell</option>
                        <option value="Satin" className="bg-[#1a1a1a]">Satin</option>
                        <option value="Semi-Gloss" className="bg-[#1a1a1a]">Semi-Gloss</option>
                        <option value="High-Gloss" className="bg-[#1a1a1a]">High-Gloss</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>

        <div className="p-6 border-t border-white/10 flex gap-3 bg-white/5">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-white/60 font-bold hover:bg-white/5 transition-all"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.clientName}
            className="flex-[2] py-3 px-4 bg-brand hover:bg-brand/90 text-bg-base font-bold rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-bg-base border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                SAVE JOB
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
