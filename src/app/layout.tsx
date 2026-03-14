import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://golum.app'),
  title: 'Golum - Add an AI Chatbot to Your Website',
  description: 'Add a chatbot to your website that answers visitor questions about your business — automatically, 24/7. Upload your info, paste one line of code, done.',
  keywords: ['AI chatbot for website', 'website chat widget', 'customer support chatbot', 'add chatbot to website', 'no-code chatbot'],
  openGraph: {
    title: 'Golum - Add an AI Chatbot to Your Website',
    description: 'Add a chatbot to your website that answers visitor questions about your business — automatically, 24/7.',
    type: 'website',
    siteName: 'Golum',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golum - Add an AI Chatbot to Your Website',
    description: 'Add a chatbot to your website that answers visitor questions about your business — automatically, 24/7.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload widget script so browser starts downloading immediately during HTML parse */}
        <link rel="preconnect" href="https://golum-widget.netlify.app" />
        <link rel="preconnect" href="https://golum-be.onrender.com" />
        <link rel="preload" href="https://golum-widget.netlify.app/widget.js" as="script" />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.GOLUM_CONFIG = { apiKey: 'pk_WtOK_KVO5GhBuVv8ikS3xEXpH8DGMnYL', apiUrl: 'https://golum-be.onrender.com' };`,
          }}
        />
        <script src="https://golum-widget.netlify.app/widget.js" async />
      </body>
    </html>
  );
}
