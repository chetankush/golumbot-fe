'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { GolumIcon } from '@/components/Logo';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080816]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080816]">
      {/* ====== Navigation ====== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass' : ''}`}>
        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white flex-shrink-0">
              <GolumIcon size={28} />
              Golum
            </Link>

            {/* Centered nav links — absolute center of screen */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a href="#features" className="text-sm text-white/80 hover:text-white transition-colors duration-300">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-white/80 hover:text-white transition-colors duration-300">
                How it works
              </a>
              <a href="#contact" className="text-sm text-white/80 hover:text-white transition-colors duration-300">
                Contact
              </a>
              <a href="#faq" className="text-sm text-white/80 hover:text-white transition-colors duration-300">
                FAQ
              </a>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2 border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl text-white text-sm font-medium rounded-full hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-300"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm text-white hover:text-white/80 transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 bg-white text-[#080816] text-sm font-medium rounded-full transition-all duration-300 hover:bg-white/90 hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
                  >
                    Get Started
                  </Link>
                </>
              )}
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="md:hidden relative p-2 text-white/60 hover:text-white transition-colors duration-300"
              >
                <svg className={`w-5 h-5 transition-all duration-500 ${mobileNav ? 'rotate-180 scale-90' : 'rotate-0 scale-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileNav ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav overlay */}
        <div
          className={`md:hidden fixed inset-0 top-0 z-[-1] transition-all duration-500 ${
            mobileNav ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {/* Frosted glass background */}
          <div className={`absolute inset-0 backdrop-blur-[80px] bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-transparent transition-opacity duration-500 ${mobileNav ? 'opacity-100' : 'opacity-0'}`} />

          {/* Nav content */}
          <div className="relative pt-24 px-8 pb-10 flex flex-col h-full">
            {/* Links */}
            <div className="space-y-1">
              {[
                { href: '#features', label: 'Features', icon: 'M13 10V3L4 14h7v7l9-11h-7z', delay: '0ms' },
                { href: '#how-it-works', label: 'How it works', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', delay: '50ms' },
                { href: '#contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', delay: '100ms' },
                { href: '#faq', label: 'FAQ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', delay: '150ms' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNav(false)}
                  className={`group flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-500 hover:bg-white/[0.06] ${
                    mobileNav ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: mobileNav ? item.delay : '0ms' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.1] group-hover:border-white/[0.15] transition-all duration-300">
                    <svg className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-white/70 group-hover:text-white transition-colors duration-300 tracking-tight">{item.label}</span>
                  <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto transition-all duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className={`my-6 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-all duration-700 ${mobileNav ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: mobileNav ? '200ms' : '0ms' }} />

            {/* Auth buttons */}
            <div className={`flex flex-col gap-3 transition-all duration-500 ${mobileNav ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: mobileNav ? '250ms' : '0ms' }}>
              <Link
                href="/login"
                onClick={() => setMobileNav(false)}
                className="flex items-center justify-center py-3.5 px-6 rounded-2xl border border-white/[0.1] bg-white/[0.04] text-white/80 text-[15px] font-medium hover:bg-white/[0.08] hover:border-white/[0.18] hover:text-white transition-all duration-300"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileNav(false)}
                className="flex items-center justify-center py-3.5 px-6 rounded-2xl bg-white text-[#080816] text-[15px] font-semibold hover:bg-white/90 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ====== HERO — Full landscape, Giga-style ====== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background landscape image */}
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Very light overlay — let the landscape breathe */}
          <div className="absolute inset-0 bg-black/15" />
          {/* Subtle warm gradient at horizon for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080816]/80 via-transparent to-[#080816]/10" />
        </div>

        {/* Content — centered, wider container */}
        <div className="relative text-center max-w-7xl mx-auto px-6 pt-32 pb-32 flex-1 flex flex-col items-center justify-center">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] text-[10px] font-medium tracking-[0.15em] uppercase text-white/70 mb-10 cursor-pointer hover:bg-white/[0.18] transition-all duration-300">
            Turn Every Visitor Into a Customer
            <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-bold text-white mb-6 leading-[1.1] tracking-[-0.02em]">
            Your website answers
            <br />
            questions 24/7. Instantly.
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-white/60 mb-9 max-w-xl mx-auto leading-relaxed">
            Stop losing customers to unanswered questions. Golum trains an AI assistant on your content and deploys it on your site in minutes — so every visitor gets the help they need, the moment they need it.
          </p>

          {/* White pill CTA */}
          <Link
            href="/register"
            className="inline-flex px-7 py-3 bg-white text-[#080816] text-sm font-medium rounded-full hover:bg-white/90 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started 
          </Link>
        </div>

        {/* Bottom stats bar — placed higher */}
        <div className="relative w-full mb-28 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-10 sm:gap-14 md:gap-20 flex-wrap">
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">99% Accuracy</span>
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">24/7 Available</span>
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">5 Min Setup</span>
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">Any Website</span>
          </div>
        </div>

        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080816] to-transparent pointer-events-none" />
      </section>

      {/* ====== MacBook + Phone Demo Section ====== */}
      <section className="py-20 md:py-28 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-[var(--text-muted)] mb-10">
            See it in action — a custom AI assistant that matches your brand and answers using your own content
          </p>

          {/* Devices Container */}
          <div className="relative flex items-end justify-center gap-4 md:gap-6 lg:gap-8">

            {/* ===== MacBook Frame ===== */}
            <div className="relative origin-bottom-left scale-[0.55] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 -mb-[35%] sm:-mb-[20%] md:-mb-[5%] lg:mb-0 flex-shrink-0">
              {/* Screen lid */}
              <div className="relative bg-[#0d0d0d] rounded-[16px] p-[8px] pt-[32px] shadow-[0_20px_60px_-10px_rgba(124,58,237,0.2)]" style={{ width: '680px' }}>
                {/* Camera notch */}
                <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#1c1c1e] ring-1 ring-[#2a2a2c]"></div>

                {/* Screen */}
                <div className="relative bg-white rounded-[6px] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" style={{ aspectRatio: '16 / 10' }}>
                  {/* Browser bar */}
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

                  {/* Site content */}
                  <div className="absolute inset-0 top-[30px] flex flex-col bg-[#fafaf9]">
                    {/* Site nav */}
                    <div className="bg-white border-b border-[#eee] px-5 py-2.5 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-[#1a1a1a] tracking-tight">Brew & Co.</span>
                        <div className="flex gap-4">
                          <span className="text-[9px] text-[#888] font-medium">Menu</span>
                          <span className="text-[9px] text-[#888] font-medium">Locations</span>
                          <span className="text-[9px] text-[#888] font-medium">About</span>
                          <span className="text-[9px] text-[#888] font-medium">Contact</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[9px] text-[#888] font-medium">Sign in</span>
                        <div className="px-2.5 py-1 bg-[#5c3d2e] rounded-md text-[8px] text-white font-semibold">Order Now</div>
                      </div>
                    </div>

                    <div className="relative flex-1 min-h-0 overflow-hidden">
                      <div className="h-full overflow-y-auto">
                        {/* Hero */}
                        <div className="flex flex-row items-center gap-4 px-5 py-7">
                          <div className="flex-1">
                            <div className="inline-block px-2 py-0.5 bg-[#f0ebe3] rounded text-[7px] text-[#8b7355] font-semibold tracking-wide uppercase mb-2">Fresh Daily</div>
                            <h2 className="text-[20px] font-extrabold text-[#1a1a1a] leading-[1.15] mb-2">Craft coffee,{' '}<br />delivered fresh</h2>
                            <p className="text-[9px] text-[#777] leading-relaxed mb-3 max-w-[200px]">Premium single-origin beans roasted locally every morning. Subscribe and save 15% on every order.</p>
                            <div className="flex gap-2">
                              <div className="px-3 py-1.5 bg-[#5c3d2e] rounded-md text-[8px] text-white font-semibold">Shop Beans</div>
                              <div className="px-3 py-1.5 bg-white border border-[#ddd] rounded-md text-[8px] text-[#333] font-semibold">Our Story</div>
                            </div>
                          </div>
                          <div className="w-[45%] rounded-xl overflow-hidden flex-shrink-0 h-[160px] shadow-sm">
                            <img src="/c5.avif" alt="Coffee shop interior" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        {/* Best Sellers */}
                        <div className="px-5 pb-3">
                          <p className="text-[12px] font-bold text-[#1a1a1a] mb-2">Best Sellers</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { img: '/cofi1.jpg', name: 'Ethiopian Yirga', price: '$18.99' },
                              { img: '/cofi2.avif', name: 'Colombian Dark', price: '$16.99' },
                              { img: '/cofi3.avif', name: 'House Blend', price: '$14.99' },
                            ].map((item) => (
                              <div key={item.name} className="bg-white border border-[#eee] rounded-lg overflow-hidden">
                                <div className="w-full h-36 overflow-hidden"><img src={item.img} alt={item.name} className="w-full h-full object-cover" /></div>
                                <div className="p-1.5">
                                  <p className="text-[7px] font-semibold text-[#1a1a1a]">{item.name}</p>
                                  <p className="text-[6px] text-[#5c3d2e] font-semibold">{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* About */}
                        <div className="px-5 pb-4">
                          <div className="bg-white border border-[#eee] rounded-lg overflow-hidden flex">
                            <div className="w-[40%] flex-shrink-0 overflow-hidden">
                              <img src="/c4.jpg" alt="Our roastery" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex-1">
                              <p className="text-[7px] font-semibold text-[#5c3d2e] uppercase tracking-wider mb-1">About Us</p>
                              <p className="text-[13px] font-bold text-[#1a1a1a] mb-2 leading-tight">Our Story</p>
                              <p className="text-[9px] text-[#555] leading-relaxed">Founded in 2019, Brew & Co. started with a simple idea: everyone deserves freshly roasted, ethically sourced coffee.</p>
                            </div>
                          </div>
                        </div>

                        {/* Gallery */}
                        <div className="px-5 pb-3">
                          <p className="text-[12px] font-bold text-[#1a1a1a] mb-2">From Our Roastery</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="h-14 rounded-lg overflow-hidden"><img src="/c6.jpeg" alt="Latte art" className="w-full h-full object-cover" /></div>
                            <div className="h-14 rounded-lg overflow-hidden"><img src="/c1.avif" alt="Coffee beans" className="w-full h-full object-cover" /></div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-2 border-t border-[#eee] bg-white">
                          <div className="flex items-center justify-between">
                            <span className="text-[6px] text-[#bbb]">&copy; 2026 Brew & Co. All rights reserved.</span>
                            <div className="flex gap-2">
                              <span className="text-[6px] text-[#bbb]">Privacy</span>
                              <span className="text-[6px] text-[#bbb]">Terms</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat Widget */}
                      <div className="absolute bottom-3 right-3 w-[220px] bg-white rounded-[14px] shadow-[0_8px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
                        <div className="px-2.5 py-2 flex items-center gap-1.5 border-b border-[#f1f5f9] bg-white">
                          <div className="flex-1 min-w-0">
                            <p className="text-[#0f172a] text-[10px] font-semibold leading-tight">Brew & Co.</p>
                            <p className="text-[#5c3d2e] text-[7px] font-medium leading-tight">The team can also help</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <div className="w-4 h-4 rounded flex items-center justify-center text-[#94a3b8]">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#fafbfc] border-b border-[#f1f5f9] px-2 py-1 text-center">
                          <p className="text-[7px] text-[#94a3b8]">Ask us anything, or share your feedback.</p>
                        </div>
                        <div className="p-2.5 space-y-2 bg-white flex-1">
                          <div className="flex flex-col gap-0.5">
                            <div className="self-start bg-[#f1f5f9] rounded-sm rounded-tr-xl rounded-br-xl rounded-bl-xl px-2 py-1.5 text-[8px] text-[#1e293b] max-w-[85%] leading-relaxed">
                              Welcome to Brew & Co! Ask me anything about our beans or brewing tips
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="self-end bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl rounded-tr-xl rounded-bl-xl rounded-br-sm px-2 py-1.5 text-[8px] text-[#1e293b] max-w-[85%] leading-relaxed">
                              Which blend is best for cold brew?
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="self-start bg-[#f1f5f9] rounded-sm rounded-tr-xl rounded-br-xl rounded-bl-xl px-2 py-1.5 text-[8px] text-[#1e293b] max-w-[85%] leading-relaxed">
                              Our <span className="font-semibold">Colombian Dark Roast</span> is perfect! Smooth, low acidity, with chocolate notes. Steep 12-18hrs
                            </div>
                            <div className="self-start mt-0.5">
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e293b] text-white rounded-xl text-[7px] font-medium">
                                <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Book a Call
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-2 py-1.5 bg-white">
                          <div className="border-2 border-[#e2e8f0] rounded-xl px-2 py-1.5">
                            <p className="text-[7px] text-[#94a3b8] mb-0.5">Type a message...</p>
                            <div className="flex items-center justify-between">
                              <div className="w-3.5 h-3.5 rounded text-[#94a3b8] flex items-center justify-center">
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                                </svg>
                              </div>
                              <div className="w-4 h-4 bg-[#5c3d2e] rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                  <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-14 h-[4px] bg-[#2a2a2a] rounded-b-sm border-t border-[#3a3a3a]"></div>
                </div>
              </div>
            </div>

            {/* ===== iPhone Mockup ===== */}
            <div className="hidden md:block relative origin-bottom-right scale-[0.85] lg:scale-100 flex-shrink-0 -ml-8 lg:-ml-4 z-10 mb-4 lg:mb-6">
              {/* Phone Frame */}
              <div className="relative bg-[#0d0d0d] rounded-[32px] p-[6px] shadow-[0_20px_60px_-10px_rgba(124,58,237,0.25),0_8px_24px_rgba(0,0,0,0.3)]" style={{ width: '200px' }}>
                {/* Dynamic Island / Notch */}
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[60px] h-[16px] bg-[#0d0d0d] rounded-full z-20"></div>
                {/* Side button accents */}
                <div className="absolute -right-[2px] top-[70px] w-[3px] h-[24px] bg-[#1a1a1a] rounded-r-sm"></div>
                <div className="absolute -left-[2px] top-[60px] w-[3px] h-[16px] bg-[#1a1a1a] rounded-l-sm"></div>
                <div className="absolute -left-[2px] top-[90px] w-[3px] h-[28px] bg-[#1a1a1a] rounded-l-sm"></div>
                <div className="absolute -left-[2px] top-[124px] w-[3px] h-[28px] bg-[#1a1a1a] rounded-l-sm"></div>

                {/* Phone Screen */}
                <div className="relative bg-white rounded-[26px] overflow-hidden" style={{ aspectRatio: '9 / 19.5' }}>
                  {/* Status bar */}
                  <div className="bg-white px-4 pt-3 pb-1 flex items-center justify-between">
                    <span className="text-[7px] font-semibold text-[#1a1a1a]">9:41</span>
                    <div className="flex items-center gap-0.5">
                      <svg className="w-2.5 h-2.5 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 8a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1H9a1 1 0 01-1-1V8zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                      <svg className="w-3 h-2.5 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 16"><rect x="0" y="2" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><rect x="21" y="5" width="2" height="6" rx="1" /><rect x="2" y="4" width="14" height="8" rx="1" fill="currentColor" /></svg>
                    </div>
                  </div>

                  {/* Mobile browser bar */}
                  <div className="mx-2 mb-1.5">
                    <div className="bg-[#f2f2f2] rounded-lg px-2 py-[3px] text-[7px] text-[#666] text-center flex items-center justify-center gap-0.5">
                      <svg className="w-1.5 h-1.5 text-[#4caf50]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      brewandco.com
                    </div>
                  </div>

                  {/* Mobile site content */}
                  <div className="flex flex-col bg-[#fafaf9] overflow-hidden" style={{ height: 'calc(100% - 44px)' }}>
                    {/* Mobile nav */}
                    <div className="bg-white border-b border-[#eee] px-2.5 py-1.5 flex items-center justify-between flex-shrink-0">
                      <span className="text-[8px] font-bold text-[#1a1a1a]">Brew & Co.</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-2.5 h-2.5 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        <div className="px-1.5 py-0.5 bg-[#5c3d2e] rounded text-[5px] text-white font-semibold">Order</div>
                      </div>
                    </div>

                    <div className="relative flex-1 min-h-0 overflow-hidden">
                      <div className="h-full overflow-y-auto">
                        {/* Mobile Hero */}
                        <div className="px-2.5 py-3">
                          <div className="inline-block px-1.5 py-0.5 bg-[#f0ebe3] rounded text-[5px] text-[#8b7355] font-semibold tracking-wide uppercase mb-1.5">Fresh Daily</div>
                          <h2 className="text-[12px] font-extrabold text-[#1a1a1a] leading-[1.15] mb-1.5">Craft coffee,<br />delivered fresh</h2>
                          <p className="text-[6px] text-[#777] leading-relaxed mb-2">Premium single-origin beans roasted locally every morning.</p>
                          <div className="flex gap-1.5">
                            <div className="px-2 py-1 bg-[#5c3d2e] rounded text-[5px] text-white font-semibold">Shop Beans</div>
                            <div className="px-2 py-1 bg-white border border-[#ddd] rounded text-[5px] text-[#333] font-semibold">Our Story</div>
                          </div>
                        </div>

                        {/* Mobile Hero Image */}
                        <div className="px-2.5 pb-2.5">
                          <div className="rounded-lg overflow-hidden h-[60px]">
                            <img src="/c5.avif" alt="Coffee shop" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        {/* Mobile Best Sellers */}
                        <div className="px-2.5 pb-2">
                          <p className="text-[8px] font-bold text-[#1a1a1a] mb-1.5">Best Sellers</p>
                          <div className="flex gap-1.5 overflow-hidden">
                            {[
                              { img: '/cofi1.jpg', name: 'Ethiopian', price: '$18.99' },
                              { img: '/cofi2.avif', name: 'Colombian', price: '$16.99' },
                            ].map((item) => (
                              <div key={item.name} className="bg-white border border-[#eee] rounded-md overflow-hidden flex-1">
                                <div className="w-full h-[36px] overflow-hidden"><img src={item.img} alt={item.name} className="w-full h-full object-cover" /></div>
                                <div className="p-1">
                                  <p className="text-[5px] font-semibold text-[#1a1a1a]">{item.name}</p>
                                  <p className="text-[4px] text-[#5c3d2e] font-semibold">{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mobile Gallery */}
                        <div className="px-2.5 pb-2">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-[36px] rounded-md overflow-hidden"><img src="/c6.jpeg" alt="Latte art" className="w-full h-full object-cover" /></div>
                            <div className="h-[36px] rounded-md overflow-hidden"><img src="/c1.avif" alt="Coffee beans" className="w-full h-full object-cover" /></div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Golum Chat Launcher */}
                      <div className="absolute bottom-2 right-2 w-[28px] h-[28px] bg-[#5c3d2e] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(92,61,46,0.3)]">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#1a1a1a] rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====== Features Section — Giga-style ====== */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top row: heading left + mini features right */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-20 mb-14 md:mb-20">
            {/* Left — Badge + Large heading */}
            <div className="lg:max-w-lg flex-shrink-0">
              <div className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.2em] uppercase text-white/45 mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Why Golum
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight">
                Replace your help desk.
                <br />
                Keep your customers.
              </h2>
            </div>

            {/* Right — 3 mini features in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 lg:max-w-2xl lg:pt-8">
              <div>
                <div className="text-white/45 mb-3"><PaletteIcon /></div>
                <h4 className="text-white font-medium mb-1.5">Your Brand, Your Voice</h4>
                <p className="text-sm text-white/35 leading-relaxed">Colors, tone, personality — your AI sounds like you, not a robot</p>
              </div>
              <div>
                <div className="text-white/45 mb-3"><BrainIcon /></div>
                <h4 className="text-white font-medium mb-1.5">Learns in Seconds</h4>
                <p className="text-sm text-white/35 leading-relaxed">Drop a PDF or paste a URL — the AI knows your business instantly</p>
              </div>
              <div>
                <div className="text-white/45 mb-3"><CodeIcon /></div>
                <h4 className="text-white font-medium mb-1.5">One Line, Done</h4>
                <p className="text-sm text-white/35 leading-relaxed">Copy one snippet, paste it on your site. Live in under 60 seconds</p>
              </div>
            </div>
          </div>

          {/* Large showcase card */}
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left content */}
              <div className="p-8 md:p-10 lg:p-14 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">Your Command Center</h3>
                </div>
                <p className="text-white/40 mb-8 leading-relaxed max-w-sm text-[15px]">
                  See every conversation, measure customer satisfaction, and improve your AI — all from one dashboard you&apos;ll actually enjoy using.
                </p>
                <Link
                  href="/register"
                  className="self-start px-6 py-3 border border-white/[0.12] text-white text-sm font-medium rounded-full hover:bg-white/[0.06] hover:border-white/[0.2] transition-all duration-300"
                >
                  Try It Free
                </Link>

                {/* Bottom list items with dividers */}
                <div className="mt-auto pt-10">
                  <div className="py-4 border-b border-white/[0.06] text-[15px] text-white/80 font-medium">Upload PDFs, docs, or your site URL to train</div>
                  <div className="py-4 border-b border-white/[0.06] text-[15px] text-white/80 font-medium">Match your brand colors and personality</div>
                  <div className="py-4 text-[15px] text-white/80 font-medium">Go live on any website with one line of code</div>
                </div>
              </div>

              {/* Right — Landscape image with stats overlay */}
              <div className="relative min-h-[360px] lg:min-h-0">
                <img src="/showcase-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/25" />

                {/* Floating stats panel */}
                <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 p-5 md:p-6 rounded-2xl bg-[rgba(12,12,28,0.85)] backdrop-blur-2xl border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm text-white/60 font-medium">Real Results, Live</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <p className="text-[10px] text-white/35 mb-1">Questions Answered</p>
                      <p className="text-xl font-bold text-white">99%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <p className="text-[10px] text-white/35 mb-1">Customers Helped</p>
                      <p className="text-xl font-bold text-white">1,240</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <p className="text-[10px] text-white/35 mb-1">Response Time</p>
                      <p className="text-xl font-bold text-white">&lt;2s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== How It Works — Connected glass timeline ====== */}
      <section id="how-it-works" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-4">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Live in 5 minutes. Seriously.
            </h2>
            <p className="text-base md:text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
              No developers needed. No complicated setup. Just three steps between you and an AI that sells, supports, and scales for you.
            </p>
          </div>

          <div className="relative">
            {/* Connecting gradient line — desktop */}
            <div className="hidden md:block absolute top-[4.5rem] left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px">
              <div className="w-full h-full bg-gradient-to-r from-purple-500/30 via-violet-400/20 to-blue-500/30" />
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-5">
              <StepCard number="01" title="Create Your Assistant" description="Pick a name, set the tone. Make it feel like a real team member — friendly, professional, or anything in between." />
              <StepCard number="02" title="Feed It Your Knowledge" description="Upload your FAQs, product docs, or just paste your website URL. The AI reads everything and becomes an expert on your business." />
              <StepCard number="03" title="Go Live Instantly" description="Copy one snippet, paste it on your site. Your AI assistant starts answering customers immediately — while you sleep." />
            </div>
          </div>
        </div>
      </section>

      {/* ====== Contact Section — Minimal glass card ====== */}
      <section id="contact" className="py-24 md:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-4">Contact</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Questions? We&apos;re here.
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-lg mx-auto mb-14 leading-relaxed">
            Whether you need a custom plan, have a technical question, or just want to see a demo — reach out. We respond fast.
          </p>

          <div className="apple-glass p-2 sm:p-3 inline-block w-full max-w-md">
            <div className="space-y-1">
              <a
                href="tel:7987401227"
                className="flex items-center gap-4 px-5 py-4 rounded-[18px] hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-[14px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/10 group-hover:border-green-500/20 transition-all duration-300">
                  <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-green-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-white/90 group-hover:text-white transition-colors">798 740 1227</p>
                  <p className="text-xs text-white/25 mt-0.5">Phone</p>
                </div>
              </a>

              <a
                href="tel:9303135537"
                className="flex items-center gap-4 px-5 py-4 rounded-[18px] hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-[14px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/10 group-hover:border-green-500/20 transition-all duration-300">
                  <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-green-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-white/90 group-hover:text-white transition-colors">930 313 5537</p>
                  <p className="text-xs text-white/25 mt-0.5">Phone</p>
                </div>
              </a>

              <a
                href="mailto:chetankushwah929@gmail.com"
                className="flex items-center gap-4 px-5 py-4 rounded-[18px] hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-[14px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all duration-300">
                  <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-purple-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-white/90 group-hover:text-white transition-colors break-all">chetankushwah929@gmail.com</p>
                  <p className="text-xs text-white/25 mt-0.5">Email</p>
                </div>
              </a>
            </div>
          </div>

          <p className="mt-10 text-sm text-white/20">We typically respond within a few hours.</p>
        </div>
      </section>

      {/* ====== FAQ Section ====== */}
      <section id="faq" className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Got questions? We&apos;ve got answers.
            </h2>
            <p className="text-base md:text-lg text-white/40">
              Everything you need to know before you get started
            </p>
          </div>

          <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
            <FAQItem number="01" question="How does Golum learn my business?" answer="Just upload your documents (PDF, DOCX, TXT) or paste your website URL. Golum reads everything, understands the context, and builds a knowledge base your AI assistant uses to answer customers accurately — no manual training required." />
            <FAQItem number="02" question="Do I need to write any code?" answer="Not really. You'll copy one small snippet and paste it into your website. That's it. Works on WordPress, Shopify, Wix, Squarespace, or any custom site. If you can paste text, you can set up Golum." />
            <FAQItem number="03" question="What AI models are available?" answer="We offer access to top-tier models including Llama, GPT, and more. Pick the one that fits your needs — whether you want the fastest responses or the most nuanced answers. Switch anytime." />
            <FAQItem number="04" question="Is my business data safe?" answer="100%. All data is encrypted in transit and at rest. We never sell or share your data. You own it, and you can delete it anytime. We're fully GDPR compliant." />
            <FAQItem number="05" question="Can it really match my brand?" answer="Completely. Customize the widget colors, position, welcome message, avatar, and even the AI's personality and tone. Your customers will think it's built in-house." />
            <FAQItem number="06" question="What if the AI can't answer a question?" answer="It'll be honest — no making things up. You can set custom fallback messages, collect the visitor's email, or automatically escalate to your human support team. You stay in control." />
          </div>
        </div>
      </section>

      {/* ====== CTA Section ====== */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative apple-glass p-10 sm:p-14 md:p-20 text-center overflow-hidden">
            {/* Glow effects */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-purple-500/15 blur-[60px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-20 bg-purple-400/5 blur-[40px]" />

            <h2 className="text-2xl md:text-4xl font-bold mb-5 text-white relative tracking-tight">
              Your competitors already have AI support.
              <br />
              <span className="text-purple-400">Do you?</span>
            </h2>
            <p className="text-white/40 mb-10 max-w-lg mx-auto relative leading-relaxed">
              Every unanswered question is a lost customer. Set up Golum in 5 minutes and never miss a conversation again.
            </p>
            <Link
              href="/register"
              className="relative inline-flex px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
            <p className="mt-5 text-sm text-white/20 relative">Free to get started. Upgrade anytime.</p>
          </div>
        </div>
      </section>

      {/* ====== Footer ====== */}
      <footer className="border-t border-white/[0.06] py-14 md:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
                <GolumIcon size={22} />
                Golum
              </Link>
              <p className="text-white/25 mt-3 text-sm leading-relaxed">
                AI support that never sleeps, so you can.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Product</h4>
              <ul className="space-y-3 text-sm text-white/30">
                <li><a href="#features" className="hover:text-white transition-colors duration-300">Features</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors duration-300">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Company</h4>
              <ul className="space-y-3 text-sm text-white/30">
                <li><a href="/privacy" className="hover:text-white transition-colors duration-300">About</a></li>
                <li><a href="mailto:support@golum.ai" className="hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Legal</h4>
              <ul className="space-y-3 text-sm text-white/30">
                <li><a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/25">
              &copy; {new Date().getFullYear()} Golum. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-white/25 hover:text-purple-400 transition-colors duration-300"><TwitterIcon /></a>
              <a href="#" className="text-white/25 hover:text-purple-400 transition-colors duration-300"><GitHubIcon /></a>
              <a href="#" className="text-white/25 hover:text-purple-400 transition-colors duration-300"><LinkedInIcon /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ——— Step Card — Glass timeline node ——— */
function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative text-center group">
      <div className="apple-glass p-8 md:p-10">
        {/* Step number */}
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/5 border border-purple-500/15 items-center justify-center mb-6 group-hover:from-purple-500/30 group-hover:border-purple-500/30 transition-all duration-500">
          <span className="text-lg font-bold bg-gradient-to-br from-purple-400 to-violet-300 bg-clip-text text-transparent">{number}</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-sm text-white/40 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ——— FAQ Item ——— */
function FAQItem({ number, question, answer }: { number: string; question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center gap-4 text-left group"
      >
        <span className="text-sm font-mono text-white/20 group-hover:text-purple-400 transition-colors duration-300 flex-shrink-0">{number}</span>
        <span className="flex-1 font-medium text-white/80 group-hover:text-white transition-colors duration-300">{question}</span>
        <svg
          className={`w-5 h-5 text-white/20 group-hover:text-purple-400 transition-all duration-300 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-6 pl-11 pr-4 text-white/40 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ——— Icons ——— */
function BrainIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
