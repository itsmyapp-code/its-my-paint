"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("itsmypaint_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("itsmypaint_cookie_consent", "all");
    setIsVisible(false);
    // Initialize marketing scripts here if needed
  };

  const handleReject = () => {
    localStorage.setItem("itsmypaint_cookie_consent", "essential");
    setIsVisible(false);
    // Essential cookies only (Statistical, Security, User Appearance)
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-bg-panel border-t border-border-subtle shadow-[0_-10px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-sm text-text-muted">
          <p className="mb-2 text-text-main font-semibold text-base">We value your privacy</p>
          <p>
            We use essential cookies to make our app work securely, and statistical cookies to understand how you use it. 
            We also use optional marketing cookies to improve your experience. You can accept all cookies or reject non-essential ones right here. 
            For more details, see our <Link href="/cookies" className="text-brand hover:underline">Cookie Policy</Link> and <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          {/* EQUAL PROMINENCE: Both buttons have identical size, font weight, and bold styles. */}
          <button
            onClick={handleReject}
            className="flex-1 sm:flex-none px-6 py-3 rounded-full font-bold text-bg-base bg-text-muted hover:bg-text-main transition-colors text-center"
          >
            Reject All
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-3 rounded-full font-bold text-bg-base bg-brand hover:bg-brand-hover transition-colors text-center"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
