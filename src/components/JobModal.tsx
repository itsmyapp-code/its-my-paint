"use client";

import { useState, useEffect, useRef } from "react";
import { createJob, updateJob, deleteJob } from "@/lib/firestore";
import { Job, PaintSpec } from "@/lib/models";
import { uploadJobImage } from "@/lib/storage";
import { UK_PAINT_MANUFACTURERS, GET_RANGES_FOR_MANUFACTURER } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialJob?: Job;
}

export default function JobModal({ isOpen, onClose, onSuccess, initialJob }: JobModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    dueDate: "",
    status: "active" as Job["status"],
  });

  const [paintSpecs, setPaintSpecs] = useState<PaintSpec[]>([
    { area: "", what: "", manufacturer: "", colourName: "", finish: "Matt", notes: "" }
  ]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialJob) {
      setFormData({
        name: initialJob.name,
        clientName: initialJob.clientName,
        clientEmail: initialJob.clientEmail || "",
        clientPhone: initialJob.clientPhone || "",
        dueDate: initialJob.dueDate ? new Date(initialJob.dueDate).toISOString().split('T')[0] : "",
        status: initialJob.status,
      });
      setPaintSpecs(initialJob.paintSpecs.length > 0 ? initialJob.paintSpecs.map(s => ({ ...s, range: s.range || "", area: s.area || "", what: s.what || "", notes: s.notes || "" })) : [{ area: "", what: "", manufacturer: "", range: "", colourName: "", finish: "Matt", notes: "" }]);
      setExistingImages(initialJob.imageUrls || []);
    } else {
      // Reset for new job
      setFormData({
        name: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        dueDate: "",
        status: "active",
      });
      setPaintSpecs([{ area: "", what: "", manufacturer: "", range: "", colourName: "", finish: "Matt", notes: "" }]);
      setExistingImages([]);
    }
    setNewImages([]);
    setDeleteConfirm(false);
  }, [initialJob, isOpen]);

  if (!isOpen) return null;

  const handleAddPaintSpec = () => {
    setPaintSpecs([...paintSpecs, { area: "", what: "", manufacturer: "", range: "", colourName: "", finish: "Matt", notes: "" }]);
  };

  const handleRemovePaintSpec = (index: number) => {
    setPaintSpecs(paintSpecs.filter((_, i) => i !== index));
  };

  const handlePaintSpecChange = (index: number, field: keyof PaintSpec, value: string) => {
    const updatedSpecs = [...paintSpecs];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setPaintSpecs(updatedSpecs);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(existingImages.filter(u => u !== url));
  };

  const handleDelete = async () => {
    if (!initialJob?.id) return;
    setLoading(true);
    try {
      await deleteJob(initialJob.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Starting job save process...");
    try {
      let jobId = initialJob?.id;
      const filteredSpecs = paintSpecs.filter(spec => spec.manufacturer && spec.colourName);

      if (initialJob?.id) {
        // Handle image uploads for existing job
        console.log(`Uploading ${newImages.length} images for existing job...`);
        const uploadedUrls = await Promise.all(
          newImages.map(file => uploadJobImage(initialJob.id!, file))
        );
        console.log("Images uploaded:", uploadedUrls);
        
        await updateJob(initialJob.id, {
          ...formData,
          paintSpecs: filteredSpecs,
          imageUrls: [...existingImages, ...uploadedUrls],
        });
      } else {
        console.log("Creating new job in Firestore...");
        const result = await createJob({
          ...formData,
          startDate: new Date().toISOString(),
          paintSpecs: filteredSpecs,
          imageUrls: [], // Images uploaded after creation if needed, but for simplicity we'll just create then upload
        });
        jobId = result.id;
        console.log("Job created with ID:", jobId);
        
        // Now upload images if any
        if (newImages.length > 0) {
          console.log(`Uploading ${newImages.length} images for new job...`);
          const uploadedUrls = await Promise.all(
            newImages.map(file => uploadJobImage(jobId!, file))
          );
          console.log("Images uploaded:", uploadedUrls);
          await updateJob(jobId!, { imageUrls: uploadedUrls });
        }
      }
      console.log("Save process complete!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-bold text-white">
            {initialJob ? "Edit Paint Spec" : "Record New Paint Spec"}
          </h2>
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 ml-1">Client Name</label>
                <input
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 ml-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 ml-1">Contact Info (Optional)</label>
                <input
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="Email or Phone"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-white/20"
                />
              </div>
            </div>
          </section>

          {/* Image Upload Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-brand rounded-full"></div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Job Photos (WebP)</h3>
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-brand hover:text-brand/80 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                UPLOAD
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange}
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {/* Existing Images */}
              {existingImages.map((url, i) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                  <Image src={url} alt="Job photo" fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {/* New Images */}
              {newImages.map((file, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border border-brand/30 bg-brand/5">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-brand uppercase">New</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {existingImages.length === 0 && newImages.length === 0 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/20 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">Add Photos</span>
                </div>
              )}
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
                ADD COLOUR
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
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Area</label>
                      <input
                        placeholder="e.g. Kitchen"
                        value={spec.area}
                        onChange={(e) => handlePaintSpecChange(index, "area", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">What</label>
                      <input
                        placeholder="e.g. Walls"
                        value={spec.what}
                        onChange={(e) => handlePaintSpecChange(index, "what", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Manufacturer</label>
                      <input
                        placeholder="e.g. Dulux Trade"
                        list={`manufacturers-${index}`}
                        value={spec.manufacturer}
                        onChange={(e) => handlePaintSpecChange(index, "manufacturer", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                      />
                      <datalist id={`manufacturers-${index}`}>
                        {UK_PAINT_MANUFACTURERS.map(m => <option key={m.name} value={m.name} />)}
                      </datalist>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Range</label>
                      <input
                        placeholder="e.g. Diamond Matt"
                        list={`ranges-${index}`}
                        value={spec.range || ""}
                        onChange={(e) => handlePaintSpecChange(index, "range", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                      />
                      <datalist id={`ranges-${index}`}>
                        {GET_RANGES_FOR_MANUFACTURER(spec.manufacturer).map(r => <option key={r} value={r} />)}
                      </datalist>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Colour Name</label>
                      <input
                        placeholder="e.g. Magnolia"
                        value={spec.colourName}
                        onChange={(e) => handlePaintSpecChange(index, "colourName", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Hex Code (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={spec.colourCode || "#ffffff"}
                          onChange={(e) => handlePaintSpecChange(index, "colourCode", e.target.value)}
                          className="w-10 h-9 bg-transparent border-none cursor-pointer"
                        />
                        <input
                          placeholder="#FFFFFF"
                          value={spec.colourCode || ""}
                          onChange={(e) => handlePaintSpecChange(index, "colourCode", e.target.value)}
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
                        <option value="Matt" className="bg-[#1a1a1a]">Matt</option>
                        <option value="Vinyl Matt" className="bg-[#1a1a1a]">Vinyl Matt</option>
                        <option value="Eggshell" className="bg-[#1a1a1a]">Eggshell</option>
                        <option value="Satin" className="bg-[#1a1a1a]">Satin</option>
                        <option value="Gloss" className="bg-[#1a1a1a]">Gloss</option>
                        <option value="Masonry" className="bg-[#1a1a1a]">Masonry</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-tighter text-white/40 ml-1">Notes</label>
                      <textarea
                        placeholder="Additional notes for this spec..."
                        value={spec.notes || ""}
                        onChange={(e) => handlePaintSpecChange(index, "notes", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/30 min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>

        <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 bg-white/5">
          {initialJob && (
            <div className="flex gap-3 w-full sm:w-auto">
              <Link 
                href={`/report/${initialJob.id}`}
                className="w-full sm:w-12 h-12 flex items-center justify-center border border-brand/30 text-brand rounded-xl hover:bg-brand hover:text-bg-base transition-all"
                title="View Professional Report"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
              </Link>
              {deleteConfirm ? (
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => setDeleteConfirm(false)}
                    className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-white font-bold hover:bg-white/5 transition-all text-sm"
                  >
                    NO
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-sm"
                  >
                    YES, DELETE
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                  className="w-full sm:w-12 h-12 flex items-center justify-center border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  title="Delete Job"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          <div className="flex gap-3 flex-1">
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
                  {initialJob ? "UPDATE JOB" : "SAVE JOB"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
