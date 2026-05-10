"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDecoratorSettings, updateDecoratorSettings } from "@/lib/firestore";
import { uploadDecoratorLogo } from "@/lib/storage";
import { DecoratorSettings } from "@/lib/models";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<Partial<DecoratorSettings>>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    logoUrl: "",
  });

  const [newLogo, setNewLogo] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchSettings();
    }
  }, [user, loading, router]);

  const fetchSettings = async () => {
    if (!user) return;
    try {
      const data = await getDecoratorSettings(user.uid);
      if (data) {
        setSettings(data);
      } else {
        // Default with user info
        setSettings(prev => ({
          ...prev,
          email: user.email || "",
          contactName: user.displayName || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      let logoUrl = settings.logoUrl;
      if (newLogo) {
        logoUrl = await uploadDecoratorLogo(user.uid, newLogo);
      }

      await updateDecoratorSettings(user.uid, {
        ...settings,
        logoUrl,
      });

      setMessage({ text: "Settings saved successfully!", type: 'success' });
      setSettings(prev => ({ ...prev, logoUrl }));
      setNewLogo(null);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ text: "Failed to save settings.", type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewLogo(e.target.files[0]);
    }
  };

  if (initialLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto flex flex-col">
      <header className="mb-8 flex items-center gap-4">
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-bg-panel-hover border border-transparent hover:border-border-subtle transition-all text-text-main">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            Decorator Settings
          </h1>
          <p className="text-text-muted text-sm">Branding and contact details for your reports</p>
        </div>
      </header>

      <main className="flex-1 glass-panel rounded-3xl p-6 md:p-10 border border-border-subtle/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[80px]"></div>

        <form onSubmit={handleSave} className="relative z-10 space-y-8">
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4">Business Identity</h3>
              <p className="text-sm text-text-muted mb-6">This information will appear in the header of every PDF report you generate for your clients.</p>
              
              <div className="space-y-4">
                <div className="relative aspect-square w-32 mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-border-subtle flex items-center justify-center bg-bg-panel-hover group cursor-pointer hover:border-brand transition-all" onClick={() => logoInputRef.current?.click()}>
                  {(newLogo || settings.logoUrl) ? (
                    <Image 
                      src={newLogo ? URL.createObjectURL(newLogo) : settings.logoUrl!} 
                      alt="Business Logo" 
                      fill 
                      className="object-contain p-2" 
                    />
                  ) : (
                    <div className="text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Logo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-xs font-bold text-white uppercase">Change</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleLogoChange} 
                />
                <p className="text-[10px] text-center text-text-muted uppercase font-bold tracking-tighter">Square WebP recommended</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted ml-1">Business Name</label>
                <input
                  required
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  placeholder="e.g. Elite Decorators Ltd"
                  className="w-full bg-bg-panel-hover border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted ml-1">Contact Name</label>
                  <input
                    required
                    value={settings.contactName}
                    onChange={(e) => setSettings({ ...settings, contactName: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full bg-bg-panel-hover border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-muted ml-1">Phone Number</label>
                  <input
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="e.g. 01234 567890"
                    className="w-full bg-bg-panel-hover border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="e.g. info@elitedecorators.com"
                  className="w-full bg-bg-panel-hover border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted ml-1">Website (Optional)</label>
                <input
                  value={settings.website}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  placeholder="e.g. www.elitedecorators.com"
                  className="w-full bg-bg-panel-hover border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted ml-1">Business Address</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Street, City, Postcode"
                  className="w-full bg-bg-panel-hover border border-border-subtle rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all shadow-inner min-h-[100px]"
                />
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-border-subtle/30 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-brand hover:bg-brand/90 text-bg-base font-bold rounded-2xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[200px] justify-center"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-bg-base border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  SAVE SETTINGS
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
