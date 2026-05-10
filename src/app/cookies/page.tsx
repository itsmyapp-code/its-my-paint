export default function CookiePolicy() {
  return (
    <div className="min-h-screen p-8 md:p-16 max-w-4xl mx-auto text-text-main">
      <h1 className="text-4xl font-bold mb-4 text-brand">Cookie Policy</h1>
      <p className="text-text-muted mb-8">Last Updated: May 10, 2026</p>

      <section className="space-y-6">
        <p className="text-text-muted leading-relaxed">
          itsmypaint uses cookies and similar tracking technologies to improve your experience. This policy explains the types of cookies we use and your choices.
        </p>

        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Strictly Necessary Cookies</h2>
          <p className="text-text-muted leading-relaxed">
            These cookies are essential for the operation of our service, including security, login management, and preventing fraudulent activity. They also include user appearance cookies that remember UI settings like Dark Mode. Consent is not required for these cookies.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Statistical / Performance Cookies</h2>
          <p className="text-text-muted leading-relaxed">
            These cookies are used solely for website usage metrics to help us understand how our app performs. Pursuant to the 2027 updates, consent is not strictly required, but we provide a simple, free opt-out mechanism via our cookie banner or browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. Third-Party Tracking & Marketing</h2>
          <p className="text-text-muted leading-relaxed">
            These are non-essential trackers (e.g., Meta Pixel, Google Ads) used for marketing and external scripts. These remain blocked by default until you provide a positive "Accept" action via our consent module.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">4. Managing Your Consent</h2>
          <p className="text-text-muted leading-relaxed">
            You can adjust your cookie preferences at any time by clearing your browser cache and interacting with our cookie banner upon your next visit. We enforce a strict first-layer rejection policy so you never have to navigate complex settings just to reject non-essential trackers.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-text-muted leading-relaxed">
            If you have questions about our use of cookies, contact <a href="mailto:hello@itsmyapp.co.uk" className="text-brand hover:underline">hello@itsmyapp.co.uk</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
