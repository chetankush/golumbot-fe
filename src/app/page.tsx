'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeProvider';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-2xl font-bold gradient-text">
              Golum
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] animated-underline transition-colors">
                Features
              </a>
              <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] animated-underline transition-colors">
                Pricing
              </Link>
              <a href="#faq" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] animated-underline transition-colors">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 gradient-bg text-white font-medium rounded-full hover:opacity-90 transition-all hover:shadow-lg hover:shadow-purple-500/25"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 gradient-bg text-white font-medium rounded-full hover:opacity-90 transition-all hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            AI-Powered Customer Support
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Intelligent
            <span className="gradient-text block">AI Assistants</span>
            for Your Website
          </h1>

          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Create custom AI chatbots trained on your content. Provide instant, accurate support to your visitors 24/7 without writing a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 gradient-bg text-white font-semibold rounded-full text-lg hover:opacity-90 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-1"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-full text-lg hover:border-purple-400 transition-all hover:-translate-y-1"
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-10 border-t border-[var(--border-color)]">
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text">99%</div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Response Accuracy</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Always Available</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text">5min</div>
              <div className="text-sm text-[var(--text-muted)] mt-1">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Powerful features to build and deploy intelligent AI assistants in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BrainIcon />}
              title="Smart Learning"
              description="Upload documents, PDFs, or scrape websites. Your AI learns from your content automatically."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<ChatIcon />}
              title="Natural Conversations"
              description="Powered by advanced LLMs for human-like, context-aware responses to any question."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<CodeIcon />}
              title="Easy Integration"
              description="Add to any website with a simple script tag. No coding required."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<PaletteIcon />}
              title="Fully Customizable"
              description="Match your brand with custom colors, positioning, and welcome messages."
              gradient="from-orange-500 to-amber-500"
            />
            <FeatureCard
              icon={<ShieldIcon />}
              title="Secure & Private"
              description="Enterprise-grade security. Your data is encrypted and never shared."
              gradient="from-red-500 to-rose-500"
            />
            <FeatureCard
              icon={<ChartIcon />}
              title="Analytics Dashboard"
              description="Track conversations, popular questions, and improve your knowledge base."
              gradient="from-indigo-500 to-violet-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section px-6 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent dark:via-purple-900/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Up and Running in Minutes
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              Three simple steps to transform your customer support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Assistant"
              description="Sign up and create your AI assistant with a custom personality and name."
            />
            <StepCard
              number="2"
              title="Train with Content"
              description="Upload documents or scrape your website. AI learns your business instantly."
            />
            <StepCard
              number="3"
              title="Embed & Go Live"
              description="Copy one line of code. Your AI assistant is now live on your website."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Pay As You Go
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-4">
              Buy credits, use them anytime. No subscriptions, no commitments.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              100 free credits for new users!
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <CreditCard
              name="Basic"
              credits={500}
              price={5}
              href="/pricing"
            />
            <CreditCard
              name="Popular"
              credits={2000}
              price={15}
              savings="25%"
              popular
              href="/pricing"
            />
            <CreditCard
              name="Pro"
              credits={10000}
              price={50}
              savings="50%"
              href="/pricing"
            />
            <CreditCard
              name="Business"
              credits={50000}
              price={200}
              savings="60%"
              href="/pricing"
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-[var(--text-secondary)] mb-4">Credit costs: 1 per message • 5 per document • 3 per web scrape</p>
            <Link href="/pricing" className="text-primary-500 hover:text-primary-600 font-medium">
              View all pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              Everything you need to know about Golum
            </p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="How does Golum learn from my content?"
              answer="Simply upload documents (PDF, DOCX, TXT, etc.) or provide website URLs. Our AI automatically extracts and understands the content, creating a knowledge base your assistant can reference when answering questions."
            />
            <FAQItem
              question="What AI models power Golum?"
              answer="We use state-of-the-art large language models including Llama, GPT, and others through various providers. You can choose the model that best fits your needs and budget."
            />
            <FAQItem
              question="How do I add the widget to my website?"
              answer="It's as simple as copying two lines of code and pasting them before the closing body tag of your website. Works with any platform - WordPress, Shopify, Wix, custom sites, and more."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Absolutely. All data is encrypted in transit and at rest. We never share your data with third parties, and you can delete your data at any time. We're GDPR compliant."
            />
            <FAQItem
              question="Can I customize the look and feel?"
              answer="Yes! You can customize colors, position, welcome message, and more to match your brand. Pro users can also remove the Golum branding entirely."
            />
            <FAQItem
              question="What happens if the AI doesn't know an answer?"
              answer="The AI will honestly say it doesn't have that information in its knowledge base. You can configure fallback responses or escalation to human support."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 md:p-16 text-center text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Ready to Transform Your Support?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using AI to deliver exceptional customer experiences.
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-white text-purple-700 font-semibold rounded-full text-lg hover:bg-opacity-90 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                Start Your Free Trial
              </Link>
              <p className="mt-4 text-sm opacity-75">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="font-display text-2xl font-bold gradient-text">
                Golum
              </Link>
              <p className="text-[var(--text-secondary)] mt-4 text-sm">
                AI-powered assistants for modern businesses. Transform your customer support today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="#features" className="hover:text-[var(--text-primary)]">Features</a></li>
                <li><a href="#pricing" className="hover:text-[var(--text-primary)]">Pricing</a></li>
                <li><a href="#faq" className="hover:text-[var(--text-primary)]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="#" className="hover:text-[var(--text-primary)]">About</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">Blog</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="#" className="hover:text-[var(--text-primary)]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[var(--text-primary)]">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              © 2024 Golum. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <TwitterIcon />
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <GitHubIcon />
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className="feature-card group">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full gradient-bg text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

// Credit Card Component
function CreditCard({ name, credits, price, savings, popular, href }: {
  name: string;
  credits: number;
  price: number;
  savings?: string;
  popular?: boolean;
  href: string;
}) {
  return (
    <div className={`pricing-card text-center ${popular ? 'popular' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-bg text-white text-sm font-medium rounded-full">
          Best Value
        </div>
      )}
      {savings && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
          Save {savings}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="font-display text-3xl font-bold">${price}</span>
      </div>
      <div className="py-4 mb-4 rounded-xl bg-[var(--bg-tertiary)]">
        <p className="text-2xl font-bold gradient-text">{credits.toLocaleString()}</p>
        <p className="text-sm text-[var(--text-secondary)]">credits</p>
      </div>
      <Link
        href={href}
        className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${
          popular
            ? 'gradient-bg text-white hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25'
            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
        }`}
      >
        Buy Now
      </Link>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[var(--border-color)] rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        <span className="font-medium">{question}</span>
        <svg
          className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-[var(--text-secondary)] animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

// Icons
function BrainIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
