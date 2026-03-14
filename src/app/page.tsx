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
  // Demo section — commented out for now
  // const [demoUrl, setDemoUrl] = useState('');
  // const [demoActive, setDemoActive] = useState(false);
  // const [demoMessages, setDemoMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  // const [demoInput, setDemoInput] = useState('');
  // const [demoLoading, setDemoLoading] = useState(false);
  // const [demoError, setDemoError] = useState('');

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setMobileNav(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-reveal observer — runs AFTER mounted so content is in the DOM
  useEffect(() => {
    if (!mounted) return;

    // Small delay to ensure React has flushed the DOM
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('[data-reveal]');
      if (revealElements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );
      revealElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, [mounted]);

  // Demo functions — commented out for now
  // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // const startDemo = async () => { ... };
  // const sendDemoMessage = async () => { ... };

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileNav ? 'bg-[#080816]/90 backdrop-blur-2xl' : ''}`}>
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
              <a href="#pricing" className="text-sm text-white/80 hover:text-white transition-colors duration-300">
                Pricing
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
                    className={`px-3 sm:px-5 py-1.5 sm:py-2 bg-white text-[#080816] text-xs sm:text-sm font-medium rounded-full transition-all duration-300 hover:bg-white/90 hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)] ${mobileNav ? 'hidden' : ''}`}
                  >
                    Get Started
                  </Link>
                </>
              )}
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="md:hidden relative p-2 text-white/60 hover:text-white transition-colors duration-300"
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${mobileNav ? 'rotate-90' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
      </nav>

      {/* Mobile nav panel — separate from nav, proper z-index */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-400 ${
          mobileNav
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Solid dark background — no glitchy backdrop-blur dependency */}
        <div className="absolute inset-0 bg-[#080816]/[0.97]" />

        {/* Nav content */}
        <div className="relative pt-24 px-8 pb-10 flex flex-col h-full overflow-y-auto">
          {/* Links */}
          <div className="space-y-1">
            {[
              { href: '#features', label: 'Features', icon: 'M13 10V3L4 14h7v7l9-11h-7z', delay: '60ms' },
              { href: '#how-it-works', label: 'How it works', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', delay: '120ms' },
              { href: '#pricing', label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', delay: '180ms' },
              { href: '#contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', delay: '240ms' },
              { href: '#faq', label: 'FAQ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', delay: '300ms' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileNav(false)}
                className={`group flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-400 hover:bg-white/[0.06] ${
                  mobileNav ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
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
          <div className={`my-6 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-all duration-500 ${mobileNav ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: mobileNav ? '300ms' : '0ms' }} />

          {/* Auth buttons */}
          <div className={`flex flex-col gap-3 transition-all duration-400 ${mobileNav ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ transitionDelay: mobileNav ? '350ms' : '0ms' }}>
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
        <div className="relative text-center max-w-7xl mx-auto px-6 pt-36 sm:pt-32 pb-32 flex-1 flex flex-col items-center justify-center">
          {/* Announcement badge */}
          <div data-reveal="up" className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] text-[8px] sm:text-[10px] font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase text-white/70 mb-8 sm:mb-10 cursor-pointer hover:bg-white/[0.18] transition-all duration-300">
            Add AI Chat Support to Your Website
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Heading */}
          <h1 data-reveal="up" className="text-[2.1rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-bold text-white mb-6 leading-[1.1] tracking-[-0.02em]">
            A chatbot for your website
            <br />
            that knows your business.
          </h1>

          {/* Subtitle */}
          <p data-reveal="up" className="text-sm md:text-base text-white/75 mb-9 max-w-xl mx-auto leading-relaxed">
            <span className="hidden sm:inline">Golum puts a chatbot on your website that answers visitor questions about your products, pricing, and services — automatically, 24/7. Just upload your info and paste one line of code.</span>
            <span className="sm:hidden">Put a chatbot on your site that answers customer questions about your business — 24/7, automatically.</span>
          </p>

          {/* White pill CTA */}
          <Link
            href="/register"
            data-reveal="scale"
            className="inline-flex px-7 py-3 bg-white text-[#080816] text-sm font-medium rounded-full hover:bg-white/90 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
          >
            Get Started 
          </Link>
        </div>

        {/* Bottom stats bar — placed higher */}
        <div className="relative w-full mb-28 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-10 sm:gap-14 md:gap-20 flex-wrap">
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">24/7 Support</span>
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">5 Min Setup</span>
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">Lead Capture</span>
            <span className="text-white text-base md:text-lg font-semibold tracking-wide">Full Analytics</span>
          </div>
        </div>

        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080816] to-transparent pointer-events-none" />
      </section>

      {/* ====== Device Demo Section ====== */}
      <section className="py-16 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p data-reveal="fade" className="text-center text-xs sm:text-sm text-white/30 mb-8 md:mb-12">
            See how the chatbot looks on your website — desktop &amp; mobile
          </p>

          {/* Devices — MacBook on top (mobile) or left (desktop), phones beside it */}
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:gap-4 lg:gap-6">

            {/* ===== MacBook ===== */}
            <div className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-none md:w-[620px] lg:w-[680px] flex-shrink-0">
              {/* Screen lid */}
              <div className="relative bg-[#0d0d0d] rounded-[10px] sm:rounded-[14px] md:rounded-[16px] p-[5px] sm:p-[7px] md:p-[8px] pt-[20px] sm:pt-[26px] md:pt-[32px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]">
                {/* Camera notch */}
                <div className="absolute top-[8px] sm:top-[10px] md:top-[12px] left-1/2 -translate-x-1/2 w-[4px] sm:w-[5px] md:w-[6px] h-[4px] sm:h-[5px] md:h-[6px] rounded-full bg-[#1c1c1e] ring-1 ring-[#2a2a2c]"></div>

                {/* Screen */}
                <div className="relative bg-white rounded-[3px] sm:rounded-[5px] md:rounded-[6px] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" style={{ aspectRatio: '16 / 10' }}>
                  {/* Browser bar */}
                  <div className="bg-[#f2f2f2] border-b border-[#e0e0e0] px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2">
                    <div className="flex gap-[3px] sm:gap-[5px]">
                      <div className="w-[7px] sm:w-[9px] md:w-[10px] h-[7px] sm:h-[9px] md:h-[10px] rounded-full bg-[#ff5f57]"></div>
                      <div className="w-[7px] sm:w-[9px] md:w-[10px] h-[7px] sm:h-[9px] md:h-[10px] rounded-full bg-[#febc2e]"></div>
                      <div className="w-[7px] sm:w-[9px] md:w-[10px] h-[7px] sm:h-[9px] md:h-[10px] rounded-full bg-[#28c840]"></div>
                    </div>
                    <div className="flex-1 max-w-[120px] sm:max-w-xs mx-auto">
                      <div className="bg-white border border-[#ddd] rounded-md px-2 sm:px-3 py-[2px] sm:py-[3px] text-[7px] sm:text-[9px] md:text-[10px] text-[#666] text-center flex items-center justify-center gap-0.5 sm:gap-1">
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-[#4caf50]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        brewandco.com
                      </div>
                    </div>
                    <div className="w-6 sm:w-10 md:w-[52px]"></div>
                  </div>

                  {/* Site content */}
                  <div className="absolute inset-0 top-[22px] sm:top-[26px] md:top-[30px] flex flex-col bg-[#fafaf9]">
                    {/* Site nav */}
                    <div className="bg-white border-b border-[#eee] px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
                        <span className="text-[8px] sm:text-[11px] md:text-sm font-bold text-[#1a1a1a] tracking-tight">Brew & Co.</span>
                        <div className="hidden sm:flex gap-2.5 md:gap-4">
                          <span className="text-[7px] md:text-[9px] text-[#888] font-medium">Menu</span>
                          <span className="text-[7px] md:text-[9px] text-[#888] font-medium">Locations</span>
                          <span className="text-[7px] md:text-[9px] text-[#888] font-medium">About</span>
                          <span className="text-[7px] md:text-[9px] text-[#888] font-medium">Contact</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2.5">
                        <span className="hidden sm:block text-[7px] md:text-[9px] text-[#888] font-medium">Sign in</span>
                        <div className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-[#5c3d2e] rounded-md text-[6px] sm:text-[7px] md:text-[8px] text-white font-semibold">Order Now</div>
                      </div>
                    </div>

                    <div className="relative flex-1 min-h-0 overflow-hidden mockup-autoscroll" style={{ '--scroll-distance': '-280px', '--scroll-duration': '16s' } as React.CSSProperties}>
                      <div className="no-scrollbar">
                        {/* Hero */}
                        <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 px-2.5 sm:px-4 md:px-5 py-3 sm:py-5 md:py-7">
                          <div className="flex-1 min-w-0">
                            <div className="inline-block px-1.5 sm:px-2 py-0.5 bg-[#f0ebe3] rounded text-[5px] sm:text-[6px] md:text-[7px] text-[#8b7355] font-semibold tracking-wide uppercase mb-1 sm:mb-2">Fresh Daily</div>
                            <h2 className="text-[11px] sm:text-[16px] md:text-[20px] font-extrabold text-[#1a1a1a] leading-[1.15] mb-1 sm:mb-2">Craft coffee,<br />delivered fresh</h2>
                            <p className="text-[6px] sm:text-[8px] md:text-[9px] text-[#777] leading-relaxed mb-2 sm:mb-3 max-w-[200px]">Premium single-origin beans roasted locally every morning.</p>
                            <div className="flex gap-1.5 sm:gap-2">
                              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#5c3d2e] rounded-md text-[5px] sm:text-[7px] md:text-[8px] text-white font-semibold">Shop Beans</div>
                              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-[#ddd] rounded-md text-[5px] sm:text-[7px] md:text-[8px] text-[#333] font-semibold">Our Story</div>
                            </div>
                          </div>
                          <div className="w-[38%] sm:w-[42%] md:w-[45%] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 h-[70px] sm:h-[120px] md:h-[160px] shadow-sm">
                            <img src="/c5.avif" alt="Coffee shop interior" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        {/* Best Sellers */}
                        <div className="px-2.5 sm:px-4 md:px-5 pb-2 sm:pb-3">
                          <p className="text-[8px] sm:text-[10px] md:text-[12px] font-bold text-[#1a1a1a] mb-1.5 sm:mb-2">Best Sellers</p>
                          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
                            {[
                              { img: '/cofi1.jpg', name: 'Ethiopian Yirga', price: '$18.99' },
                              { img: '/cofi2.avif', name: 'Colombian Dark', price: '$16.99' },
                              { img: '/cofi3.avif', name: 'House Blend', price: '$14.99' },
                            ].map((item) => (
                              <div key={item.name} className="bg-white border border-[#eee] rounded-md sm:rounded-lg overflow-hidden">
                                <div className="w-full h-[40px] sm:h-[80px] md:h-36 overflow-hidden"><img src={item.img} alt={item.name} className="w-full h-full object-cover" /></div>
                                <div className="p-1 sm:p-1.5">
                                  <p className="text-[5px] sm:text-[6px] md:text-[7px] font-semibold text-[#1a1a1a] truncate">{item.name}</p>
                                  <p className="text-[4px] sm:text-[5px] md:text-[6px] text-[#5c3d2e] font-semibold">{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Why Us strip */}
                        <div className="px-2.5 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-[#f0ebe3]">
                          <p className="text-[7px] sm:text-[9px] md:text-[11px] font-bold text-[#3d2b1f] mb-1.5 sm:mb-2 text-center">Why Brew & Co?</p>
                          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
                            {[
                              { icon: '🚚', label: 'Free Shipping', desc: 'On orders $35+' },
                              { icon: '☕', label: 'Fresh Roasted', desc: 'Roasted every morning' },
                              { icon: '🌱', label: 'Fair Trade', desc: '100% ethically sourced' },
                            ].map((item) => (
                              <div key={item.label} className="bg-white rounded-md sm:rounded-lg p-1 sm:p-1.5 md:p-2 text-center">
                                <span className="text-[8px] sm:text-[12px] md:text-[14px]">{item.icon}</span>
                                <p className="text-[5px] sm:text-[6px] md:text-[7px] font-semibold text-[#1a1a1a] mt-0.5">{item.label}</p>
                                <p className="text-[4px] sm:text-[5px] md:text-[6px] text-[#888]">{item.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial */}
                        <div className="px-2.5 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-white">
                          <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                            <div className="w-[18px] sm:w-[28px] md:w-[36px] h-[18px] sm:h-[28px] md:h-[36px] rounded-full bg-[#f0ebe3] flex items-center justify-center flex-shrink-0">
                              <span className="text-[7px] sm:text-[10px] md:text-[14px]">👤</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex gap-0.5 text-[6px] sm:text-[8px] md:text-[10px] text-[#d4a574] mb-0.5">★★★★★</div>
                              <p className="text-[5px] sm:text-[7px] md:text-[8px] text-[#333] leading-relaxed italic">&ldquo;Best subscription coffee I&rsquo;ve ever tried. The cold brew blend is incredible!&rdquo;</p>
                              <p className="text-[4px] sm:text-[5px] md:text-[6px] text-[#999] mt-0.5 font-medium">— Sarah M., Portland</p>
                            </div>
                          </div>
                        </div>

                        {/* Visit section */}
                        <div className="px-2.5 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-[#fafaf9]">
                          <p className="text-[7px] sm:text-[9px] md:text-[11px] font-bold text-[#1a1a1a] mb-1 sm:mb-1.5">Visit Our Roastery</p>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-[40%] h-[30px] sm:h-[50px] md:h-[60px] rounded-md overflow-hidden bg-[#e8e0d8]">
                              <div className="w-full h-full bg-gradient-to-br from-[#d4a574] to-[#8b7355] flex items-center justify-center">
                                <span className="text-[10px] sm:text-[16px] md:text-[20px]">📍</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[5px] sm:text-[7px] md:text-[8px] text-[#333] font-medium">123 Roast Ave, Portland</p>
                              <p className="text-[4px] sm:text-[5px] md:text-[6px] text-[#888]">Mon-Sat 7am-6pm</p>
                              <div className="mt-1 px-1.5 sm:px-2 py-0.5 bg-[#5c3d2e] rounded text-[4px] sm:text-[5px] md:text-[6px] text-white font-semibold w-fit">Get Directions</div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 border-t border-[#eee] bg-white">
                          <div className="flex items-center justify-between">
                            <span className="text-[4px] sm:text-[5px] md:text-[6px] text-[#bbb]">&copy; 2026 Brew & Co.</span>
                            <div className="flex gap-1.5 sm:gap-2">
                              <span className="text-[4px] sm:text-[5px] md:text-[6px] text-[#bbb]">Privacy</span>
                              <span className="text-[4px] sm:text-[5px] md:text-[6px] text-[#bbb]">Terms</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat Widget — stays fixed, outside scroll */}
                      <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 right-1.5 sm:right-2 md:right-3 w-[120px] sm:w-[170px] md:w-[220px] bg-white rounded-[8px] sm:rounded-[12px] md:rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
                        <div className="px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 md:py-2 flex items-center gap-1 border-b border-[#f1f5f9] bg-white">
                          <div className="flex-1 min-w-0">
                            <p className="text-[#0f172a] text-[6px] sm:text-[8px] md:text-[10px] font-semibold leading-tight">Brew & Co.</p>
                          </div>
                          <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]">
                            <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </div>
                        </div>
                        <div className="p-1.5 sm:p-2 md:p-2.5 space-y-1 sm:space-y-1.5 md:space-y-2 bg-white flex-1">
                          <div className="self-start bg-[#f1f5f9] rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 md:py-1.5 text-[5px] sm:text-[7px] md:text-[8px] text-[#1e293b] leading-relaxed">
                            Welcome! Ask me anything about our beans
                          </div>
                          <div className="self-end bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 md:py-1.5 text-[5px] sm:text-[7px] md:text-[8px] text-[#1e293b] leading-relaxed ml-auto w-fit">
                            Best for cold brew?
                          </div>
                          <div className="self-start bg-[#f1f5f9] rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 md:py-1.5 text-[5px] sm:text-[7px] md:text-[8px] text-[#1e293b] leading-relaxed">
                            <span className="font-semibold">Colombian Dark</span> — smooth, low acidity. Steep 12-18hrs
                          </div>
                        </div>
                        <div className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-white border-t border-[#f1f5f9]">
                          <div className="flex items-center justify-between border border-[#e2e8f0] rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
                            <p className="text-[4px] sm:text-[6px] md:text-[7px] text-[#94a3b8]">Type a message...</p>
                            <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-[#5c3d2e] rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

              {/* MacBook hinge */}
              <div className="relative mx-auto" style={{ width: '90%' }}>
                <div className="h-[4px] sm:h-[5px] md:h-[6px] bg-gradient-to-b from-[#272727] to-[#1a1a1a] rounded-b-sm"></div>
              </div>
              {/* MacBook base */}
              <div className="relative mx-auto" style={{ width: '100%' }}>
                <div className="h-[7px] sm:h-[8px] md:h-[10px] bg-gradient-to-b from-[#333] to-[#2a2a2a] rounded-b-lg md:rounded-b-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                  <div className="absolute top-[1px] sm:top-[2px] left-1/2 -translate-x-1/2 w-8 sm:w-10 md:w-14 h-[3px] sm:h-[4px] bg-[#2a2a2a] rounded-b-sm border-t border-[#3a3a3a]"></div>
                </div>
              </div>
            </div>

            {/* ===== Phone Mockups ===== */}
            <div className="flex items-end gap-3 sm:gap-4 md:gap-3 lg:gap-4 mt-8 md:mt-0 md:-ml-4 lg:-ml-2 flex-shrink-0">

            {/* iPhone 1 — Site with launcher */}
            <div className="flex-shrink-0 z-10 md:mb-4 lg:mb-6">
              {/* Phone Frame */}
              <div className="relative bg-[#0d0d0d] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] p-[4px] sm:p-[5px] md:p-[6px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]" style={{ width: 'clamp(140px, 35vw, 200px)' }}>
                {/* Dynamic Island */}
                <div className="absolute top-[8px] sm:top-[10px] left-1/2 -translate-x-1/2 w-[40px] sm:w-[50px] md:w-[60px] h-[12px] sm:h-[14px] md:h-[16px] bg-[#0d0d0d] rounded-full z-20"></div>
                {/* Side buttons */}
                <div className="absolute -right-[2px] top-[55px] sm:top-[65px] md:top-[70px] w-[2px] sm:w-[3px] h-[18px] sm:h-[22px] md:h-[24px] bg-[#1a1a1a] rounded-r-sm"></div>
                <div className="absolute -left-[2px] top-[48px] sm:top-[55px] md:top-[60px] w-[2px] sm:w-[3px] h-[12px] sm:h-[14px] md:h-[16px] bg-[#1a1a1a] rounded-l-sm"></div>
                <div className="absolute -left-[2px] top-[68px] sm:top-[78px] md:top-[90px] w-[2px] sm:w-[3px] h-[20px] sm:h-[24px] md:h-[28px] bg-[#1a1a1a] rounded-l-sm"></div>

                {/* Phone Screen */}
                <div className="relative bg-white rounded-[20px] sm:rounded-[23px] md:rounded-[26px] overflow-hidden" style={{ aspectRatio: '9 / 19.5' }}>
                  {/* Status bar */}
                  <div className="bg-white px-3 sm:px-4 pt-2 sm:pt-3 pb-0.5 sm:pb-1 flex items-center justify-between">
                    <span className="text-[5px] sm:text-[6px] md:text-[7px] font-semibold text-[#1a1a1a]">9:41</span>
                    <div className="flex items-center gap-0.5">
                      <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 8a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1H9a1 1 0 01-1-1V8zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                      <svg className="w-2.5 h-2 sm:w-3 sm:h-2.5 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 16"><rect x="0" y="2" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><rect x="21" y="5" width="2" height="6" rx="1" /><rect x="2" y="4" width="14" height="8" rx="1" fill="currentColor" /></svg>
                    </div>
                  </div>

                  {/* Mobile browser bar */}
                  <div className="mx-1.5 sm:mx-2 mb-1 sm:mb-1.5">
                    <div className="bg-[#f2f2f2] rounded-md sm:rounded-lg px-1.5 sm:px-2 py-[2px] sm:py-[3px] text-[5px] sm:text-[6px] md:text-[7px] text-[#666] text-center flex items-center justify-center gap-0.5">
                      <svg className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-[#4caf50]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      brewandco.com
                    </div>
                  </div>

                  {/* Mobile site content */}
                  <div className="flex flex-col bg-[#fafaf9] overflow-hidden" style={{ height: 'calc(100% - 36px)' }}>
                    {/* Mobile nav */}
                    <div className="bg-white border-b border-[#eee] px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between flex-shrink-0">
                      <span className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-[#1a1a1a]">Brew & Co.</span>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        <div className="px-1 sm:px-1.5 py-0.5 bg-[#5c3d2e] rounded text-[4px] sm:text-[5px] text-white font-semibold">Order</div>
                      </div>
                    </div>

                    <div className="relative flex-1 min-h-0 overflow-hidden mockup-autoscroll" style={{ '--scroll-distance': '-120px', '--scroll-duration': '14s' } as React.CSSProperties}>
                      <div className="no-scrollbar">
                        {/* Mobile Hero */}
                        <div className="px-2 sm:px-2.5 py-2 sm:py-3">
                          <div className="inline-block px-1 sm:px-1.5 py-0.5 bg-[#f0ebe3] rounded text-[4px] sm:text-[5px] text-[#8b7355] font-semibold tracking-wide uppercase mb-1 sm:mb-1.5">Fresh Daily</div>
                          <h2 className="text-[9px] sm:text-[11px] md:text-[12px] font-extrabold text-[#1a1a1a] leading-[1.15] mb-1 sm:mb-1.5">Craft coffee,<br />delivered fresh</h2>
                          <p className="text-[4px] sm:text-[5px] md:text-[6px] text-[#777] leading-relaxed mb-1.5 sm:mb-2">Premium beans roasted locally every morning.</p>
                          <div className="flex gap-1 sm:gap-1.5">
                            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#5c3d2e] rounded text-[4px] sm:text-[5px] text-white font-semibold">Shop Beans</div>
                            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white border border-[#ddd] rounded text-[4px] sm:text-[5px] text-[#333] font-semibold">Our Story</div>
                          </div>
                        </div>

                        {/* Mobile Hero Image */}
                        <div className="px-2 sm:px-2.5 pb-2 sm:pb-2.5">
                          <div className="rounded-md sm:rounded-lg overflow-hidden h-[40px] sm:h-[50px] md:h-[60px]">
                            <img src="/c5.avif" alt="Coffee shop" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        {/* Mobile Best Sellers */}
                        <div className="px-2 sm:px-2.5 pb-1.5 sm:pb-2">
                          <p className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-[#1a1a1a] mb-1 sm:mb-1.5">Best Sellers</p>
                          <div className="flex gap-1 sm:gap-1.5 overflow-hidden">
                            {[
                              { img: '/cofi1.jpg', name: 'Ethiopian', price: '$18.99' },
                              { img: '/cofi2.avif', name: 'Colombian', price: '$16.99' },
                            ].map((item) => (
                              <div key={item.name} className="bg-white border border-[#eee] rounded-sm sm:rounded-md overflow-hidden flex-1">
                                <div className="w-full h-[24px] sm:h-[30px] md:h-[36px] overflow-hidden"><img src={item.img} alt={item.name} className="w-full h-full object-cover" /></div>
                                <div className="p-0.5 sm:p-1">
                                  <p className="text-[4px] sm:text-[5px] font-semibold text-[#1a1a1a]">{item.name}</p>
                                  <p className="text-[3px] sm:text-[4px] text-[#5c3d2e] font-semibold">{item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mobile Why Us */}
                        <div className="px-2 sm:px-2.5 py-1.5 sm:py-2 bg-[#f0ebe3]">
                          <p className="text-[5px] sm:text-[6px] md:text-[7px] font-bold text-[#3d2b1f] mb-1 text-center">Why Brew & Co?</p>
                          <div className="flex gap-1 sm:gap-1.5">
                            {[
                              { icon: '🚚', label: 'Free Ship' },
                              { icon: '☕', label: 'Fresh' },
                              { icon: '🌱', label: 'Fair Trade' },
                            ].map((item) => (
                              <div key={item.label} className="bg-white rounded-sm sm:rounded-md p-0.5 sm:p-1 text-center flex-1">
                                <span className="text-[6px] sm:text-[8px]">{item.icon}</span>
                                <p className="text-[3px] sm:text-[4px] font-semibold text-[#1a1a1a]">{item.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mobile Review */}
                        <div className="px-2 sm:px-2.5 py-1.5 sm:py-2 bg-white">
                          <div className="flex gap-0.5 text-[5px] sm:text-[6px] text-[#d4a574]">★★★★★</div>
                          <p className="text-[4px] sm:text-[5px] text-[#333] italic leading-relaxed mt-0.5">&ldquo;Best coffee subscription ever!&rdquo;</p>
                          <p className="text-[3px] sm:text-[4px] text-[#999] mt-0.5">— Sarah M.</p>
                        </div>
                      </div>

                      {/* Mobile Golum Chat Launcher */}
                      <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-[20px] sm:w-[24px] md:w-[28px] h-[20px] sm:h-[24px] md:h-[28px] bg-[#5c3d2e] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(92,61,46,0.3)]">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-[3px] sm:bottom-[4px] left-1/2 -translate-x-1/2 w-[35%] h-[2px] sm:h-[3px] bg-[#1a1a1a] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* iPhone 2 — Open Chatbot */}
            <div className="flex-shrink-0 z-20 md:mb-4 lg:mb-6">
              <div className="relative bg-[#0d0d0d] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] p-[4px] sm:p-[5px] md:p-[6px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]" style={{ width: 'clamp(140px, 35vw, 200px)' }}>
                {/* Dynamic Island */}
                <div className="absolute top-[8px] sm:top-[10px] left-1/2 -translate-x-1/2 w-[40px] sm:w-[50px] md:w-[60px] h-[12px] sm:h-[14px] md:h-[16px] bg-[#0d0d0d] rounded-full z-20"></div>
                {/* Side buttons */}
                <div className="absolute -right-[2px] top-[55px] sm:top-[65px] md:top-[70px] w-[2px] sm:w-[3px] h-[18px] sm:h-[22px] md:h-[24px] bg-[#1a1a1a] rounded-r-sm"></div>
                <div className="absolute -left-[2px] top-[48px] sm:top-[55px] md:top-[60px] w-[2px] sm:w-[3px] h-[12px] sm:h-[14px] md:h-[16px] bg-[#1a1a1a] rounded-l-sm"></div>
                <div className="absolute -left-[2px] top-[68px] sm:top-[78px] md:top-[90px] w-[2px] sm:w-[3px] h-[20px] sm:h-[24px] md:h-[28px] bg-[#1a1a1a] rounded-l-sm"></div>

                {/* Phone Screen — full chatbot UI */}
                <div className="relative bg-white rounded-[20px] sm:rounded-[23px] md:rounded-[26px] overflow-hidden" style={{ aspectRatio: '9 / 19.5' }}>
                  {/* Status bar */}
                  <div className="bg-white px-3 sm:px-4 pt-2 sm:pt-3 pb-0.5 sm:pb-1 flex items-center justify-between">
                    <span className="text-[5px] sm:text-[6px] md:text-[7px] font-semibold text-[#1a1a1a]">9:41</span>
                    <div className="flex items-center gap-0.5">
                      <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 8a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1H9a1 1 0 01-1-1V8zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                      <svg className="w-2.5 h-2 sm:w-3 sm:h-2.5 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 24 16"><rect x="0" y="2" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><rect x="21" y="5" width="2" height="6" rx="1" /><rect x="2" y="4" width="14" height="8" rx="1" fill="currentColor" /></svg>
                    </div>
                  </div>

                  {/* Chatbot Panel — takes full screen */}
                  <div className="flex flex-col bg-white" style={{ height: 'calc(100% - 28px)' }}>
                    {/* Chat header */}
                    <div className="px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2.5 flex items-center gap-1.5 sm:gap-2 border-b border-[#f1f5f9]">
                      <div className="w-[18px] sm:w-[22px] md:w-[26px] h-[18px] sm:h-[22px] md:h-[26px] rounded-full bg-[#5c3d2e] flex items-center justify-center flex-shrink-0">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[6px] sm:text-[7px] md:text-[9px] font-semibold text-[#0f172a] leading-tight">Brew & Co.</p>
                        <p className="text-[4px] sm:text-[5px] md:text-[6px] text-[#5c3d2e] font-medium leading-tight">Online now</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded flex items-center justify-center text-[#94a3b8]">
                          <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </div>
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]">
                          <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Greeting bar */}
                    <div className="bg-[#fafbfc] border-b border-[#f1f5f9] px-2 sm:px-2.5 py-0.5 sm:py-1 text-center">
                      <p className="text-[4px] sm:text-[5px] md:text-[6px] text-[#94a3b8]">Ask us anything about our coffee</p>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-hidden mockup-autoscroll bg-white" style={{ '--scroll-distance': '-80px', '--scroll-duration': '16s' } as React.CSSProperties}>
                      <div className="p-1.5 sm:p-2 md:p-2.5 space-y-1.5 sm:space-y-2 md:space-y-2.5 no-scrollbar">
                      {/* Bot welcome */}
                      <div className="flex gap-1 sm:gap-1.5 items-start">
                        <div className="w-[12px] sm:w-[14px] md:w-[18px] h-[12px] sm:h-[14px] md:h-[18px] rounded-full bg-[#5c3d2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="bg-[#f1f5f9] rounded-lg rounded-tl-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-[#1e293b] max-w-[80%] leading-relaxed">
                          Hey! Welcome to Brew & Co. How can I help you today?
                        </div>
                      </div>

                      {/* Quick reply buttons */}
                      <div className="flex flex-wrap gap-0.5 sm:gap-1 pl-4 sm:pl-5 md:pl-6">
                        <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 border border-[#e2e8f0] rounded-full text-[4px] sm:text-[5px] md:text-[6px] text-[#475569] font-medium">What do you offer?</div>
                        <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 border border-[#e2e8f0] rounded-full text-[4px] sm:text-[5px] md:text-[6px] text-[#475569] font-medium">Pricing</div>
                      </div>

                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="bg-[#5c3d2e] rounded-lg rounded-tr-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-white max-w-[80%] leading-relaxed">
                          Which blend is best for cold brew?
                        </div>
                      </div>

                      {/* Bot reply */}
                      <div className="flex gap-1 sm:gap-1.5 items-start">
                        <div className="w-[12px] sm:w-[14px] md:w-[18px] h-[12px] sm:h-[14px] md:h-[18px] rounded-full bg-[#5c3d2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="max-w-[80%]">
                          <div className="bg-[#f1f5f9] rounded-lg rounded-tl-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-[#1e293b] leading-relaxed">
                            Great choice! Our <span className="font-semibold">Colombian Dark Roast</span> is the best for cold brew — smooth, low acidity, rich chocolate notes. Steep 12-18 hours for best results.
                          </div>
                          {/* Action buttons */}
                          <div className="flex gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                            <div className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#1e293b] text-white rounded-full text-[4px] sm:text-[5px] md:text-[6px] font-medium">
                              <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              Book a Call
                            </div>
                            <div className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#25D366] text-white rounded-full text-[4px] sm:text-[5px] md:text-[6px] font-medium">
                              <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                              </svg>
                              WhatsApp
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User follow-up */}
                      <div className="flex justify-end">
                        <div className="bg-[#5c3d2e] rounded-lg rounded-tr-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-white max-w-[80%] leading-relaxed">
                          How much is it?
                        </div>
                      </div>

                      {/* Bot price reply */}
                      <div className="flex gap-1 sm:gap-1.5 items-start">
                        <div className="w-[12px] sm:w-[14px] md:w-[18px] h-[12px] sm:h-[14px] md:h-[18px] rounded-full bg-[#5c3d2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="bg-[#f1f5f9] rounded-lg rounded-tl-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-[#1e293b] max-w-[80%] leading-relaxed">
                          The Colombian Dark Roast is <span className="font-semibold">$16.99</span> for a 12oz bag. We also offer a subscription — save 15% on every order!
                        </div>
                      </div>

                      {/* User asks about subscription */}
                      <div className="flex justify-end">
                        <div className="bg-[#5c3d2e] rounded-lg rounded-tr-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-white max-w-[80%] leading-relaxed">
                          Tell me about the subscription
                        </div>
                      </div>

                      {/* Bot subscription reply */}
                      <div className="flex gap-1 sm:gap-1.5 items-start">
                        <div className="w-[12px] sm:w-[14px] md:w-[18px] h-[12px] sm:h-[14px] md:h-[18px] rounded-full bg-[#5c3d2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="bg-[#f1f5f9] rounded-lg rounded-tl-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-[#1e293b] max-w-[80%] leading-relaxed">
                          Our subscription delivers fresh beans every 2 or 4 weeks. You get <span className="font-semibold">15% off</span>, free shipping, and you can pause or cancel anytime!
                        </div>
                      </div>

                      {/* User thanks */}
                      <div className="flex justify-end">
                        <div className="bg-[#5c3d2e] rounded-lg rounded-tr-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-white max-w-[80%] leading-relaxed">
                          That sounds great, I&apos;ll try it!
                        </div>
                      </div>

                      {/* Bot closing */}
                      <div className="flex gap-1 sm:gap-1.5 items-start">
                        <div className="w-[12px] sm:w-[14px] md:w-[18px] h-[12px] sm:h-[14px] md:h-[18px] rounded-full bg-[#5c3d2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-[6px] h-[6px] sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="bg-[#f1f5f9] rounded-lg rounded-tl-sm px-1.5 sm:px-2 py-1 sm:py-1.5 text-[5px] sm:text-[6px] md:text-[7px] text-[#1e293b] max-w-[80%] leading-relaxed">
                          Awesome! Here&apos;s the link to get started. Let me know if you need anything else! ☕
                        </div>
                      </div>
                      </div>
                    </div>

                    {/* Chat input */}
                    <div className="px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 md:py-2 bg-white border-t border-[#f1f5f9]">
                      <div className="flex items-center gap-1 border border-[#e2e8f0] rounded-lg sm:rounded-xl px-1.5 sm:px-2 py-1 sm:py-1.5">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded text-[#94a3b8] flex items-center justify-center">
                          <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                          </svg>
                        </div>
                        <p className="flex-1 text-[4px] sm:text-[5px] md:text-[6px] text-[#94a3b8]">Type a message...</p>
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-[#5c3d2e] rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                          </svg>
                        </div>
                      </div>
                      {/* Powered by badge */}
                      <p className="text-center text-[3px] sm:text-[4px] md:text-[5px] text-[#c0c0c0] mt-0.5 sm:mt-1">Powered by Golum</p>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-[3px] sm:bottom-[4px] left-1/2 -translate-x-1/2 w-[35%] h-[2px] sm:h-[3px] bg-[#1a1a1a] rounded-full"></div>
                </div>
              </div>
            </div>

            </div>{/* end phones wrapper */}

          </div>
        </div>
      </section>

      {/* ====== Features Section — Giga-style ====== */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top row: heading left + mini features right */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-20 mb-14 md:mb-20">
            {/* Left — Badge + Large heading */}
            <div data-reveal="left" className="lg:max-w-lg flex-shrink-0">
              <div className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.2em] uppercase text-white/45 mb-6">
                <span className="w-2 h-2 rounded-full bg-white/60" />
                Why Golum
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight">
                Your own support agent.
                <br />
                On your website.
              </h2>
            </div>

            {/* Right — 3 mini features in a row */}
            <div data-reveal="right" className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 lg:max-w-2xl lg:pt-8">
              <div>
                <div className="text-white/45 mb-3"><PaletteIcon /></div>
                <h4 className="text-white font-medium mb-1.5">Matches Your Brand</h4>
                <p className="text-sm text-white/35 leading-relaxed">Pick your colors, logo, and tone. The chatbot looks and feels like part of your website</p>
              </div>
              <div>
                <div className="text-white/45 mb-3"><BrainIcon /></div>
                <h4 className="text-white font-medium mb-1.5">Trained on Your Info</h4>
                <p className="text-sm text-white/35 leading-relaxed">Upload your FAQ, product details, or website URL — it learns your business in seconds</p>
              </div>
              <div>
                <div className="text-white/45 mb-3"><CodeIcon /></div>
                <h4 className="text-white font-medium mb-1.5">Paste &amp; Go Live</h4>
                <p className="text-sm text-white/35 leading-relaxed">Copy one line of code, paste it on your site. The chatbot appears instantly for visitors</p>
              </div>
            </div>
          </div>

          {/* Everything You Get — full feature grid */}
          <div data-reveal="up" className="mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-white/80">Everything you get</h3>
            <p className="text-sm text-white/30 mt-1">No hidden features. No premium tiers for basics. All of this is included.</p>
          </div>
          <div data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-14 md:mb-20">
            {[
              {
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                title: 'Lead Capture',
                desc: 'Automatically collect visitor names and emails when the chatbot can\'t answer — never lose a potential customer',
              },
              {
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                title: 'Analytics Dashboard',
                desc: 'Conversations per day, busiest hours, top questions, visitor tracking — see exactly how your chatbot performs',
              },
              {
                icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Missed Questions',
                desc: 'See every question your AI couldn\'t answer. Know exactly what info to add so the bot gets smarter over time',
              },
              {
                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                title: 'AI Training Suggestions',
                desc: 'Golum tells you which questions need answers. Type the answer, click Add — bot learns it instantly',
              },
              {
                icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'CSV Export',
                desc: 'Export all conversations and leads as CSV files. Open in Excel, import to your CRM — your data, your way',
              },
              {
                icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
                title: 'WhatsApp Handoff',
                desc: 'When visitors need a human, the bot offers your WhatsApp or phone — seamless escalation, no lost leads',
              },
              {
                icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
                title: 'Full Customization',
                desc: 'Your brand colors, your logo, your welcome message. The chatbot looks native to your website — not like a third-party tool',
              },
              {
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
                title: 'Visitor Tracking',
                desc: 'Unique visitors, returning visitors, average chats per person — understand who\'s using your chatbot and how',
              },
            ].map((item) => (
              <div key={item.title} data-reveal="up" className="apple-glass p-5 md:p-6">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-4">
                  <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-1.5 text-sm">{item.title}</h4>
                <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Large showcase card */}
          <div data-reveal="up" className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left content */}
              <div className="p-8 md:p-10 lg:p-14 flex flex-col order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-5">
                  <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">Manage From One Dashboard</h3>
                </div>
                <p className="text-white/40 mb-8 leading-relaxed max-w-sm text-[15px]">
                  See what visitors are asking, read full conversations, and improve your chatbot&apos;s answers — all from a simple dashboard.
                </p>
                <Link
                  href="/register"
                  className="self-start px-6 py-3 border border-white/[0.12] text-white text-sm font-medium rounded-full hover:bg-white/[0.06] hover:border-white/[0.2] transition-all duration-300"
                >
                  Try It Free
                </Link>

                {/* Bottom list items with dividers */}
                <div className="mt-auto pt-10">
                  <div className="py-4 border-b border-white/[0.06] text-[15px] text-white/80 font-medium">Train from your website, PDFs, or just paste text</div>
                  <div className="py-4 border-b border-white/[0.06] text-[15px] text-white/80 font-medium">See missed questions and teach the bot with one click</div>
                  <div className="py-4 border-b border-white/[0.06] text-[15px] text-white/80 font-medium">Export leads and conversations to CSV anytime</div>
                  <div className="py-4 text-[15px] text-white/80 font-medium">Paste one code snippet — chatbot goes live on your site</div>
                </div>
              </div>

              {/* Right — Landscape image with stats overlay */}
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-0 order-1 lg:order-2">
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

      {/* ====== How It Works — Vertical Timeline ====== */}
      <section id="how-it-works" className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div data-reveal="up" className="text-center mb-16 md:mb-20">
            <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-4">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              3 steps. 5 minutes. Done.
            </h2>
            <p className="text-base md:text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
              No coding skills needed. No developer required. Just follow these three steps and your website gets its own AI chatbot.
            </p>
          </div>

          <div className="relative">
            <TimelineStep
              number="01"
              title="Create a Chatbot"
              description="Give it a name and pick a style. This is the chatbot that will appear on your website for visitors."
              isLast={false}
            />
            <TimelineStep
              number="02"
              title="Add Your Business Info"
              description="Upload your FAQ, product pages, pricing, or just paste your website URL. The chatbot reads it all and learns your business."
              isLast={false}
            />
            <TimelineStep
              number="03"
              title="Paste Code on Your Site"
              description="Copy one small code snippet and paste it on your website. The chatbot appears and starts answering visitor questions instantly."
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* ====== Free Trial Demo — commented out for now ====== */}
      {/* <section id="demo" className="py-24 md:py-32 px-6">
        ...
      </section> */}

      {/* ====== Pricing Section ====== */}
      <section id="pricing" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div data-reveal="up" className="text-center mb-16 md:mb-20">
            <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-4">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className="text-base md:text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
              Start free. Upgrade when you need more chatbots or messages.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {/* Free */}
            <div className="apple-glass p-6 md:p-8 flex flex-col">
              <p className="text-sm font-medium text-white/50 mb-2">Free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-sm text-white/30">/month</span>
              </div>
              <p className="text-sm text-white/35 mb-6">Try it out on your website</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>1 chatbot</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>50 messages / month</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>10 AI summaries</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Basic customization</li>
              </ul>
              <Link href="/register" className="block text-center px-5 py-2.5 border border-white/[0.12] text-white text-sm font-medium rounded-full hover:bg-white/[0.06] transition-all">
                Get Started Free
              </Link>
            </div>

            {/* Starter */}
            <div className="apple-glass p-6 md:p-8 flex flex-col">
              <p className="text-sm font-medium text-white/50 mb-2">Starter</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$12</span>
                <span className="text-sm text-white/30">/month</span>
              </div>
              <p className="text-sm text-white/35 mb-6">For small businesses</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>3 chatbots</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>2,000 messages / month</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>50 AI summaries</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>WhatsApp &amp; Calendly</li>
              </ul>
              <Link href="/pricing" className="block text-center px-5 py-2.5 border border-white/[0.12] text-white text-sm font-medium rounded-full hover:bg-white/[0.06] transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro — Popular */}
            <div className="relative apple-glass p-6 md:p-8 flex flex-col ring-1 ring-white/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white text-[#080816] text-xs font-semibold rounded-full">Most Popular</div>
              <p className="text-sm font-medium text-white/50 mb-2">Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-sm text-white/30">/month</span>
              </div>
              <p className="text-sm text-white/35 mb-6">For growing businesses</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>10 chatbots</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>10,000 messages / month</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>100 AI summaries</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>All integrations + priority support</li>
              </ul>
              <Link href="/pricing" className="block text-center px-5 py-2.5 bg-white text-[#080816] text-sm font-semibold rounded-full hover:bg-white/90 transition-all">
                Get Started
              </Link>
            </div>

            {/* Business */}
            <div className="apple-glass p-6 md:p-8 flex flex-col">
              <p className="text-sm font-medium text-white/50 mb-2">Business</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$59</span>
                <span className="text-sm text-white/30">/month</span>
              </div>
              <p className="text-sm text-white/35 mb-6">For teams &amp; agencies</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Unlimited chatbots</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>50,000 messages / month</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>200 AI summaries</li>
                <li className="flex items-start gap-2.5 text-sm text-white/60"><svg className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Custom branding + API access</li>
              </ul>
              <Link href="/pricing" className="block text-center px-5 py-2.5 border border-white/[0.12] text-white text-sm font-medium rounded-full hover:bg-white/[0.06] transition-all">
                Get Started
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-white/25 mt-8">All plans include a 7-day free trial. No credit card required to start.</p>
        </div>
      </section>

      {/* ====== Social Proof Section ====== */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Trust numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
            {[
              { number: '500+', label: 'Chatbots created' },
              { number: '50K+', label: 'Visitor questions answered' },
              { number: '99%', label: 'Uptime' },
              { number: '<2s', label: 'Average response time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</p>
                <p className="text-sm text-white/35">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                quote: 'We added Golum to our Shopify store and within a week it was handling 80% of customer questions. Our support inbox dropped dramatically.',
                name: 'Priya S.',
                role: 'E-commerce Store Owner',
              },
              {
                quote: 'My clients kept asking the same questions about pricing and services. Now the chatbot handles all of that. I just check the dashboard once a day.',
                name: 'Marco T.',
                role: 'Freelance Consultant',
              },
              {
                quote: 'Setup took literally 5 minutes. Uploaded our FAQ doc, pasted the code, done. The chatbot knew our product better than some of our staff.',
                name: 'Aisha K.',
                role: 'SaaS Founder',
              },
            ].map((t) => (
              <div key={t.name} className="apple-glass p-6 md:p-8">
                <div className="flex gap-0.5 text-white/30 mb-4 text-sm">★★★★★</div>
                <p className="text-sm text-white/60 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-medium text-white/80">{t.name}</p>
                  <p className="text-xs text-white/30">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Try It Live Callout ====== */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="apple-glass p-8 md:p-10">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">Try it right now</h3>
            <p className="text-sm text-white/40 leading-relaxed max-w-md mx-auto">
              See the chat icon in the bottom-right corner? That&apos;s a Golum chatbot running live on this page. Click it and ask anything — that&apos;s exactly what your visitors will experience.
            </p>
          </div>
        </div>
      </section>

      {/* ====== Contact Section — Minimal glass card ====== */}
      <section id="contact" className="py-24 md:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-4">Contact</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Questions? We&apos;re here.
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-lg mx-auto mb-14 leading-relaxed">
            Need help setting up? Have a question about your chatbot? Just want to see a demo? Reach out — we respond fast.
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
                <div className="w-10 h-10 rounded-[14px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.08] group-hover:border-white/[0.15] transition-all duration-300">
                  <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-white/80 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
            <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Got questions? We&apos;ve got answers.
            </h2>
            <p className="text-base md:text-lg text-white/40">
              Everything you need to know before you get started
            </p>
          </div>

          <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
            <FAQItem number="01" question="What exactly is Golum?" answer="Golum lets you add a chatbot to your website. When visitors have questions about your products, pricing, or services, the chatbot answers them instantly — using the information you provide. Think of it as a 24/7 support agent that lives on your site." />
            <FAQItem number="02" question="How does the chatbot know about my business?" answer="You upload your documents (FAQ, product info, pricing) or paste your website URL. Golum reads everything and trains the chatbot to answer questions about your business accurately — no manual setup required." />
            <FAQItem number="03" question="Do I need a developer to set it up?" answer="No. You copy one small code snippet and paste it into your website. That's it. It works on WordPress, Shopify, Wix, Squarespace, or any website. If you can paste text, you can add Golum." />
            <FAQItem number="04" question="Is my business data safe?" answer="100%. All data is encrypted and never shared. You own it, and you can delete it anytime. We're fully GDPR compliant." />
            <FAQItem number="05" question="Will the chatbot match my website design?" answer="Yes. You can customize the chatbot's colors, position, welcome message, icon, and even its name and personality. It looks like a natural part of your website." />
            <FAQItem number="06" question="What if the chatbot doesn't know the answer?" answer="It will say so honestly — no making things up. You can set a fallback message like 'Email us at...' or collect the visitor's contact info so you can follow up manually." />
          </div>
        </div>
      </section>

      {/* ====== CTA Section ====== */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative apple-glass p-10 sm:p-14 md:p-20 text-center overflow-hidden">
            {/* Glow effects */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-white/[0.06] blur-[60px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-20 bg-white/[0.03] blur-[40px]" />

            <h2 className="text-2xl md:text-4xl font-bold mb-5 text-white relative tracking-tight">
              Your visitors have questions.
              <br />
              <span className="text-white/60">Let your website answer them.</span>
            </h2>
            <p className="text-white/40 mb-10 max-w-lg mx-auto relative leading-relaxed">
              Every unanswered question is a lost customer. Add Golum to your website in 5 minutes and let the chatbot handle it.
            </p>
            <Link
              href="/register"
              className="relative inline-flex px-8 py-3.5 bg-white text-[#080816] font-semibold rounded-full transition-all duration-300 hover:bg-white/90 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
            <p className="mt-5 text-sm text-white/20 relative">Free to get started. Upgrade anytime.</p>

            {/* Custom work CTA */}
            <div className="mt-10 pt-8 border-t border-white/[0.06] relative">
              <p className="text-sm text-white/50">
                <span className="font-medium text-white/70">Need something custom?</span>{' '}
                We build AI chatbots and agents tailored to your business.{' '}
                <a href="#contact" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/60 transition-all">Talk to us &rarr;</a>
              </p>
            </div>
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
                Add an AI chatbot to your website in minutes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Product</h4>
              <ul className="space-y-3 text-sm text-white/30">
                <li><a href="#features" className="hover:text-white transition-colors duration-300">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors duration-300">Pricing</a></li>
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
              <a href="#" className="text-white/25 hover:text-white transition-colors duration-300"><TwitterIcon /></a>
              <a href="#" className="text-white/25 hover:text-white transition-colors duration-300"><GitHubIcon /></a>
              <a href="#" className="text-white/25 hover:text-white transition-colors duration-300"><LinkedInIcon /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ——— Timeline Step — Vertical connected step ——— */
function TimelineStep({ number, title, description, isLast }: { number: string; title: string; description: string; isLast: boolean }) {
  return (
    <div className="relative flex gap-6 md:gap-10 group">
      {/* Left: circle + vertical line */}
      <div className="flex flex-col items-center">
        <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center group-hover:bg-white/[0.14] group-hover:border-white/[0.25] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] transition-all duration-500">
          <span className="text-sm font-bold text-white/70 group-hover:text-white/90 transition-colors duration-500">{number}</span>
        </div>
        {!isLast && (
          <div className="w-px flex-1 my-2 bg-gradient-to-b from-white/20 to-white/[0.04]" />
        )}
      </div>

      {/* Right: content */}
      <div className={`pt-2 ${isLast ? 'pb-0' : 'pb-12 md:pb-16'}`}>
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">{title}</h3>
        <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-md">{description}</p>
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
        <span className="text-sm font-mono text-white/20 group-hover:text-white transition-colors duration-300 flex-shrink-0">{number}</span>
        <span className="flex-1 font-medium text-white/80 group-hover:text-white transition-colors duration-300">{question}</span>
        <svg
          className={`w-5 h-5 text-white/20 group-hover:text-white/60 transition-all duration-300 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}
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
