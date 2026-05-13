import Link from "next/link";

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-bg-base p-4 md:p-8 max-w-4xl mx-auto text-text-main">
      <header className="mb-12">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-brand transition-colors font-bold uppercase tracking-widest text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </header>

      <h1 className="text-4xl font-bold mb-4 text-brand">Accessibility Statement</h1>
      <p className="text-text-muted mb-8">Last Updated: May 10, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Our Commitment</h2>
          <p className="text-text-muted leading-relaxed">
            itsmypaint is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards. We target full compliance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Support & Features</h2>
          <p className="text-text-muted leading-relaxed">
            Our platform incorporates multiple features to support accessibility:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Keyboard Navigation:</strong> All critical app interactions can be navigated seamlessly using keyboard controls.</li>
              <li><strong>Screen Reader Compatibility:</strong> We utilize semantic HTML and ARIA labels to ensure compatibility with modern screen readers.</li>
              <li><strong>High Contrast & Focus:</strong> We provide adequate color contrast and clear focus indicators on interactive elements.</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. Feedback</h2>
          <p className="text-text-muted leading-relaxed">
            We welcome your feedback on the accessibility of itsmypaint. If you encounter any accessibility barriers, please let us know by emailing us at <a href="mailto:hello@itsmyapp.co.uk" className="text-brand hover:underline">hello@itsmyapp.co.uk</a>. We aim to respond to accessibility feedback within 5 business days.
          </p>
        </div>
      </section>
    </div>
  );
}
