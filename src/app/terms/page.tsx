import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Golum',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <Link href="/" className="text-lg font-bold">Golum</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-sm text-[var(--text-secondary)] space-y-6">
          <p><strong>Last updated:</strong> March 2026</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">1. Acceptance of Terms</h2>
          <p>By using Golum, you agree to these terms. If you do not agree, do not use the service.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">2. Service Description</h2>
          <p>Golum provides AI-powered chat assistants that can be embedded on websites. We provide tools to create, train, customize, and deploy these assistants.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">3. User Responsibilities</h2>
          <p>You are responsible for the content you upload, the accuracy of your AI assistant responses, and ensuring your use complies with applicable laws. Do not use the service for harmful, illegal, or deceptive purposes.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">4. Credits & Payments</h2>
          <p>Credits are purchased on a pay-as-you-go basis. Credits are non-refundable except as required by law. We reserve the right to change pricing with notice.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">5. Limitations</h2>
          <p>AI responses may not always be accurate. We are not liable for decisions made based on AI-generated content. The service is provided &quot;as is&quot; without warranties.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">6. Termination</h2>
          <p>We may suspend or terminate accounts that violate these terms. You may delete your account at any time.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">7. Contact</h2>
          <p>For questions about these terms, contact us at support@golum.ai.</p>
        </div>
      </div>
    </div>
  );
}
