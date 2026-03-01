'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeProvider';
import { GolumIcon } from '@/components/Logo';

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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-[var(--text-primary)]">
              <GolumIcon size={28} />
              Golum
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Features
              </a>
              <a href="#contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Contact
              </a>
              <a href="#faq" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
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
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-500 dark:text-primary-300 text-sm font-medium mb-6">
            AI-Powered Customer Support
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Build intelligent
            <span className="text-[var(--accent)] block">AI assistants</span>
            for your website
          </h1>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
            Create custom AI chatbots trained on your content. Provide instant, accurate support to your visitors 24/7 without writing a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg text-base hover:bg-[var(--accent-hover)] transition-colors"
            >
              Start free trial
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium rounded-lg text-base hover:bg-[var(--border-color)] transition-colors"
            >
              See how it works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-lg mx-auto mt-10 sm:mt-14 pt-8 border-t border-[var(--border-color)]">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">99%</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Response Accuracy</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">24/7</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Always Available</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">5min</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* MacBook Demo Section */}
      <section className="pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* MacBook Frame */}
          <div className="relative origin-top scale-[0.55] sm:scale-75 md:scale-100 -mb-[45%] sm:-mb-[25%] md:mb-0">
            {/* Screen lid */}
            <div className="relative bg-[#0d0d0d] rounded-[12px] md:rounded-[16px] p-[6px] md:p-[8px] pt-[28px] md:pt-[32px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
              {/* Camera notch */}
              <div className="absolute top-[10px] md:top-[12px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#1c1c1e] ring-1 ring-[#2a2a2c]"></div>

              {/* Screen with inner bezel shadow */}
              <div className="relative bg-white rounded-[4px] md:rounded-[6px] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" style={{ aspectRatio: '16 / 10' }}>
                {/* Browser address bar */}
                <div className="bg-[#f2f2f2] border-b border-[#e0e0e0] px-3 py-1.5 flex items-center gap-2">
                  <div className="flex gap-[5px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]"></div>
                    <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]"></div>
                    <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]"></div>
                  </div>
                  <div className="flex-1 max-w-xs mx-auto">
                    <div className="bg-white border border-[#ddd] rounded-md px-3 py-[3px] text-[10px] text-[#666] text-center flex items-center justify-center gap-1">
                      <svg className="w-2.5 h-2.5 text-[#4caf50]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      brewandco.com
                    </div>
                  </div>
                  <div className="w-[52px]"></div>
                </div>

                {/* Website content — uses flex-col to fill the aspect-ratio box */}
                <div className="absolute inset-0 top-[30px] flex flex-col bg-[#fafaf9]">
                  {/* Website nav */}
                  <div className="bg-white border-b border-[#eee] px-4 md:px-5 py-2.5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className="text-[11px] md:text-sm font-bold text-[#1a1a1a] tracking-tight">Brew & Co.</span>
                      <div className="hidden md:flex gap-4">
                        <span className="text-[9px] text-[#888] font-medium hover:text-[#1a1a1a] cursor-pointer transition-colors">Menu</span>
                        <span className="text-[9px] text-[#888] font-medium hover:text-[#1a1a1a] cursor-pointer transition-colors">Locations</span>
                        <span className="text-[9px] text-[#888] font-medium hover:text-[#1a1a1a] cursor-pointer transition-colors">About</span>
                        <span className="text-[9px] text-[#888] font-medium hover:text-[#1a1a1a] cursor-pointer transition-colors">Contact</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="hidden md:block text-[9px] text-[#888] font-medium cursor-pointer hover:text-[#1a1a1a] transition-colors">Sign in</span>
                      <div className="px-2.5 py-1 bg-[#5c3d2e] rounded-md text-[8px] text-white font-semibold cursor-pointer hover:bg-[#4a3020] transition-colors">Order Now</div>
                    </div>
                  </div>

                  {/* Scrollable body area */}
                  <div className="relative flex-1 min-h-0 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      {/* Hero section */}
                      <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4 px-4 md:px-5 py-5 md:py-7">
                        {/* Text side */}
                        <div className="flex-1">
                          <div className="inline-block px-2 py-0.5 bg-[#f0ebe3] rounded text-[7px] text-[#8b7355] font-semibold tracking-wide uppercase mb-2">Fresh Daily</div>
                          <h2 className="text-[16px] md:text-[20px] font-extrabold text-[#1a1a1a] leading-[1.15] mb-2">Craft coffee,{' '}<br className="hidden md:block" />delivered fresh</h2>
                          <p className="text-[8px] md:text-[9px] text-[#777] leading-relaxed mb-3 max-w-[200px]">Premium single-origin beans roasted locally every morning. Subscribe and save 15% on every order.</p>
                          <div className="flex gap-2">
                            <div className="px-3 py-1.5 bg-[#5c3d2e] rounded-md text-[8px] text-white font-semibold cursor-pointer hover:bg-[#4a3020] transition-colors">Shop Beans</div>
                            <div className="px-3 py-1.5 bg-white border border-[#ddd] rounded-md text-[8px] text-[#333] font-semibold cursor-pointer hover:bg-[#f5f5f5] transition-colors">Our Story</div>
                          </div>
                        </div>

                        {/* Hero image */}
                        <div className="hidden md:block w-[45%] rounded-xl overflow-hidden flex-shrink-0 h-[160px] shadow-sm">
                          <img src="/c5.avif" alt="Coffee shop interior" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Best Sellers section */}
                      <div className="hidden md:block px-4 md:px-5 pb-3">
                        <p className="text-[12px] font-bold text-[#1a1a1a] mb-2">Best Sellers</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white border border-[#eee] rounded-lg overflow-hidden">
                            <div className="w-full h-36 overflow-hidden"><img src="/cofi1.jpg" alt="Ethiopian" className="w-full h-full object-cover" /></div>
                            <div className="p-1.5">
                              <p className="text-[7px] font-semibold text-[#1a1a1a]">Ethiopian Yirga</p>
                              <p className="text-[6px] text-[#5c3d2e] font-semibold">$18.99</p>
                            </div>
                          </div>
                          <div className="bg-white border border-[#eee] rounded-lg overflow-hidden">
                            <div className="w-full h-36 overflow-hidden"><img src="/cofi2.avif" alt="Colombian" className="w-full h-full object-cover" /></div>
                            <div className="p-1.5">
                              <p className="text-[7px] font-semibold text-[#1a1a1a]">Colombian Dark</p>
                              <p className="text-[6px] text-[#5c3d2e] font-semibold">$16.99</p>
                            </div>
                          </div>
                          <div className="bg-white border border-[#eee] rounded-lg overflow-hidden">
                            <div className="w-full h-36 overflow-hidden"><img src="/cofi3.avif" alt="House Blend" className="w-full h-full object-cover" /></div>
                            <div className="p-1.5">
                              <p className="text-[7px] font-semibold text-[#1a1a1a]">House Blend</p>
                              <p className="text-[6px] text-[#5c3d2e] font-semibold">$14.99</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* About / Story section */}
                      <div className="hidden md:block px-4 md:px-5 pb-4">
                        <div className="bg-white border border-[#eee] rounded-lg overflow-hidden flex">
                          <div className="w-[40%] flex-shrink-0 overflow-hidden">
                            <img src="/c4.jpg" alt="Our roastery" className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 flex-1">
                            <p className="text-[7px] font-semibold text-[#5c3d2e] uppercase tracking-wider mb-1">About Us</p>
                            <p className="text-[13px] font-bold text-[#1a1a1a] mb-2 leading-tight">Our Story</p>
                            <p className="text-[9px] text-[#555] leading-relaxed">Founded in 2019, Brew & Co. started with a simple idea: everyone deserves freshly roasted, ethically sourced coffee. We work directly with farmers in Ethiopia, Colombia, and Guatemala to bring you the finest single-origin beans at fair prices.</p>
                            <p className="text-[9px] text-[#555] leading-relaxed mt-1.5">Every batch is roasted locally each morning for peak freshness. From bean to cup, we obsess over quality so you don&apos;t have to.</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery section */}
                      <div className="hidden md:block px-4 md:px-5 pb-3">
                        <p className="text-[12px] font-bold text-[#1a1a1a] mb-2">From Our Roastery</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="h-14 rounded-lg overflow-hidden"><img src="/c6.jpeg" alt="Latte art" className="w-full h-full object-cover" /></div>
                          <div className="h-14 rounded-lg overflow-hidden"><img src="/c1.avif" alt="Coffee beans" className="w-full h-full object-cover" /></div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="hidden md:block px-4 md:px-5 py-2 border-t border-[#eee] bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-[6px] text-[#bbb]">&copy; 2026 Brew & Co. All rights reserved.</span>
                          <div className="flex gap-2">
                            <span className="text-[6px] text-[#bbb]">Privacy</span>
                            <span className="text-[6px] text-[#bbb]">Terms</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Golum Chat Widget — matches real widget UI */}
                    <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 w-[180px] md:w-[220px] bg-white rounded-[10px] md:rounded-[14px] shadow-[0_8px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
                      {/* Header — clean white with border like real widget */}
                      <div className="px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 border-b border-[#f1f5f9] bg-white">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#0f172a] text-[9px] md:text-[10px] font-semibold leading-tight">Brew & Co.</p>
                          <p className="text-[#5c3d2e] text-[6px] md:text-[7px] font-medium leading-tight">The team can also help</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9]">
                            <svg className="w-2 h-2 md:w-2.5 md:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </div>
                          <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]">
                            <svg className="w-2 h-2 md:w-2.5 md:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Subtitle */}
                      <div className="bg-[#fafbfc] border-b border-[#f1f5f9] px-2 py-1 text-center">
                        <p className="text-[6px] md:text-[7px] text-[#94a3b8]">Ask us anything, or share your feedback.</p>
                      </div>
                      {/* Chat messages — matches real widget styling */}
                      <div className="p-1.5 md:p-2.5 space-y-1.5 md:space-y-2 bg-white flex-1">
                        {/* Assistant message */}
                        <div className="flex flex-col gap-0.5">
                          <div className="self-start bg-[#f1f5f9] rounded-sm rounded-tr-xl rounded-br-xl rounded-bl-xl px-1.5 md:px-2 py-1 md:py-1.5 text-[7px] md:text-[8px] text-[#1e293b] max-w-[85%] leading-relaxed">
                            Welcome to Brew & Co! Ask me anything about our beans or brewing tips ☕
                          </div>
                        </div>
                        {/* User message */}
                        <div className="flex flex-col gap-0.5">
                          <div className="self-end bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl rounded-tr-xl rounded-bl-xl rounded-br-sm px-1.5 md:px-2 py-1 md:py-1.5 text-[7px] md:text-[8px] text-[#1e293b] max-w-[85%] leading-relaxed">
                            Which blend is best for cold brew?
                          </div>
                        </div>
                        {/* Assistant reply */}
                        <div className="flex flex-col gap-0.5">
                          <div className="self-start bg-[#f1f5f9] rounded-sm rounded-tr-xl rounded-br-xl rounded-bl-xl px-1.5 md:px-2 py-1 md:py-1.5 text-[7px] md:text-[8px] text-[#1e293b] max-w-[85%] leading-relaxed">
                            Our <span className="font-semibold">Colombian Dark Roast</span> is perfect! Smooth, low acidity, with chocolate notes. Steep 12-18hrs 🤎
                          </div>
                          {/* Action button like real widget */}
                          <div className="self-start mt-0.5">
                            <div className="inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 bg-[#1e293b] text-white rounded-xl text-[6px] md:text-[7px] font-medium">
                              <svg className="w-1.5 h-1.5 md:w-2 md:h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              Book a Call
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Input — matches real widget input box */}
                      <div className="px-1.5 md:px-2 py-1 md:py-1.5 bg-white">
                        <div className="border-2 border-[#e2e8f0] rounded-lg md:rounded-xl px-1.5 md:px-2 py-1 md:py-1.5">
                          <p className="text-[6px] md:text-[7px] text-[#94a3b8] mb-0.5">Type a message...</p>
                          <div className="flex items-center justify-between">
                            <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded text-[#94a3b8] flex items-center justify-center">
                              <svg className="w-2 h-2 md:w-2.5 md:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                              </svg>
                            </div>
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-[#5c3d2e] rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-1.5 h-1.5 md:w-2 md:h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MacBook hinge */}
            <div className="relative mx-auto" style={{ width: '90%' }}>
              <div className="h-[6px] bg-gradient-to-b from-[#272727] to-[#1a1a1a] rounded-b-sm"></div>
            </div>
            {/* MacBook base */}
            <div className="relative mx-auto" style={{ width: '100%' }}>
              <div className="h-[10px] bg-gradient-to-b from-[#333] to-[#2a2a2a] rounded-b-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                {/* Trackpad indent */}
                <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-14 h-[4px] bg-[#2a2a2a] rounded-b-sm border-t border-[#3a3a3a]"></div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="text-center text-sm text-[var(--text-muted)] mt-8">
            Fully customizable — matches your brand colors and answers using your content
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Everything you need
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
              Powerful features to build and deploy AI assistants in minutes
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
      <section className="section px-4 sm:px-6 bg-[var(--bg-tertiary)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Up and running in minutes
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
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

      {/* Contact Section */}
      <section id="contact" className="section px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Get Full Access
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
              Contact us to pay for the product and use it to its full potential.
            </p>
          </div>

          <div className="max-w-md mx-auto card p-8">
            <div className="space-y-4">
              <a
                href="tel:7987401227"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">7987401227</p>
                  <p className="text-sm text-[var(--text-muted)]">Call us</p>
                </div>
              </a>

              <a
                href="tel:9303135537"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">9303135537</p>
                  <p className="text-sm text-[var(--text-muted)]">Call us</p>
                </div>
              </a>

              <a
                href="mailto:chetankushwah929@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors break-all">chetankushwah929@gmail.com</p>
                  <p className="text-sm text-[var(--text-muted)]">Email us</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Frequently asked questions
            </h2>
            <p className="text-lg text-[var(--text-secondary)]">
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
      <section className="section px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-6 sm:p-10 md:p-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to transform your support?
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
              Join businesses using AI to deliver exceptional customer experiences.
            </p>
            <Link
              href="/register"
              className="inline-block px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
            >
              Start free trial
            </Link>
            <p className="mt-3 text-sm text-[var(--text-muted)]">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
                <GolumIcon size={22} />
                Golum
              </Link>
              <p className="text-[var(--text-secondary)] mt-3 text-sm">
                AI-powered assistants for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="#features" className="hover:text-[var(--text-primary)]">Features</a></li>
                <li><a href="#contact" className="hover:text-[var(--text-primary)]">Contact</a></li>
                <li><a href="#faq" className="hover:text-[var(--text-primary)]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="/privacy" className="hover:text-[var(--text-primary)]">About</a></li>
                <li><a href="mailto:support@golum.ai" className="hover:text-[var(--text-primary)]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><a href="/privacy" className="hover:text-[var(--text-primary)]">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[var(--text-primary)]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              © {new Date().getFullYear()} Golum. All rights reserved.
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
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; gradient?: string }) {
  return (
    <div className="feature-card">
      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-[var(--accent)] mb-3">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white text-lg font-semibold flex items-center justify-center mx-auto mb-3">
        {number}
      </div>
      <h3 className="text-base font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
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
