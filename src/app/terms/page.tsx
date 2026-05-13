import Link from "next/link";

export default function TermsOfService() {
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

      <h1 className="text-4xl font-bold mb-4 text-brand">Terms of Service</h1>
      <p className="text-text-muted mb-8">Last Updated: May 10, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance</h2>
          <p className="text-text-muted leading-relaxed">
            By using itsmypaint, you agree to these terms. If you do not agree to these terms, please do not use our application.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. User Responsibilities</h2>
          <p className="text-text-muted leading-relaxed">
            Users are responsible for account security and the confidentiality of any shared information, including paint specifications, job details, and lockbox codes associated with job sites.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. Prohibited Uses</h2>
          <p className="text-text-muted leading-relaxed">
            You may not use itsmypaint for any unlawful purpose, to transmit malware, or to impersonate personnel, contractors, or clients.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">4. Subscription & Pricing Logic (DMCCA 2027)</h2>
          <p className="text-text-muted leading-relaxed">
            <strong>The "Easy Exit" Rule:</strong> Cancellation is simple and transparent. You can cancel your subscription at any time without unnecessary steps.<br/><br/>
            <strong>Cooling-Off Rights:</strong> Users have a statutory 14-day cooling-off period at the start of the contract, the end of any free or discounted trial, and after any auto-renewal that extends the contract by 12 months or more.<br/><br/>
            <strong>Reminder Notices:</strong> We will notify you prior to auto-renewal with the price, date, and a direct link to cancel. All displayed prices include mandatory fees (Anti-Drip Pricing).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">5. Liability</h2>
          <p className="text-text-muted leading-relaxed">
            itsmypaint is not liable for indirect or consequential damages arising from your use of the service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">6. Termination</h2>
          <p className="text-text-muted leading-relaxed">
            We reserve the right to suspend or terminate access immediately, without prior notice or liability, for any breach of these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">7. Contact</h2>
          <p className="text-text-muted leading-relaxed">
            If you have any questions, please contact us at <a href="mailto:hello@itsmyapp.co.uk" className="text-brand hover:underline">hello@itsmyapp.co.uk</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
