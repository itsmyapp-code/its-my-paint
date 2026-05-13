import Link from "next/link";

export default function PrivacyPolicy() {
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

      <h1 className="text-4xl font-bold mb-4 text-brand">Privacy Policy</h1>
      <p className="text-text-muted mb-8">Last Updated: May 10, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Data Collection</h2>
          <p className="text-text-muted leading-relaxed">
            We collect the following types of information when you use itsmypaint:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Identity Data:</strong> Name, username, or similar identifiers.</li>
              <li><strong>Contact Data:</strong> Email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and version.</li>
              <li><strong>Usage Data:</strong> Information about how you use our app and services.</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Legitimate Interests (2027 Update)</h2>
          <p className="text-text-muted leading-relaxed">
            We process data for "Recognised Legitimate Interests" including system security, emergency response coordination, and crime prevention. Pursuant to the 2027 Data (Use and Access) Act, this processing is performed without requiring a balancing test.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. Automated Decisions</h2>
          <p className="text-text-muted leading-relaxed">
            If AI or algorithmic systems are used to make significant decisions affecting you as a user, you retain the explicit right to meaningful human intervention and review.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">4. Complaint Rights</h2>
          <p className="text-text-muted leading-relaxed">
            Users have the right to complain directly to us regarding our data processing activities. You can submit a complaint via our electronic form or by emailing us. We commit to acknowledging all complaints within 30 days of receipt.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">5. Contact Us</h2>
          <p className="text-text-muted leading-relaxed">
            For privacy inquiries, please reach out to our team at <a href="mailto:hello@itsmyapp.co.uk" className="text-brand hover:underline">hello@itsmyapp.co.uk</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
