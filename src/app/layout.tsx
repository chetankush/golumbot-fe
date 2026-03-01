import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Golum - AI Chat Assistant for Your Website',
  description: 'Build and deploy custom AI chat assistants in minutes. No coding required. Train with your content, embed with one line of code.',
  keywords: ['AI chatbot', 'website chat assistant', 'customer support AI', 'no-code chatbot'],
  openGraph: {
    title: 'Golum - AI Chat Assistant for Your Website',
    description: 'Build and deploy custom AI chat assistants in minutes. No coding required.',
    type: 'website',
    siteName: 'Golum',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golum - AI Chat Assistant for Your Website',
    description: 'Build and deploy custom AI chat assistants in minutes. No coding required.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
