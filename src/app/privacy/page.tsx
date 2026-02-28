import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Golum',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="border-b border-[var(--border-color)] px-6 py-4">
        <Link href="/" className="text-lg font-bold">Golum</Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-sm text-[var(--text-secondary)] space-y-6">
          <p><strong>Last updated:</strong> March 2026</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account (email, name), data you upload to train your AI assistants (documents, URLs, text), and usage data (conversations, page visits).</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">2. How We Use Your Information</h2>
          <p>Your data is used to provide and improve our services, train your AI assistants, process payments, and communicate with you about your account.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">3. Data Storage & Security</h2>
          <p>We use industry-standard encryption and security measures. Your data is stored securely on cloud infrastructure with access controls and monitoring.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">4. Third-Party Services</h2>
          <p>We use Supabase for authentication and storage, Stripe for payments, and AI model providers (OpenRouter) for generating responses. Each service has its own privacy policy.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">5. Your Rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data at any time by contacting us. You can delete your account and all associated data from the dashboard.</p>

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">6. Contact</h2>
          <p>For privacy-related questions, contact us at support@golum.ai.</p>
        </div>
      </div>
    </div>
  );
}
