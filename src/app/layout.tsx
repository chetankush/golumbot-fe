import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
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
