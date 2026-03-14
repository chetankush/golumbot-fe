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
        <link rel="preconnect" href="https://golum-widget.netlify.app" />
        <link rel="preconnect" href="https://golum-be.onrender.com" />
      </head>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {/* Inline facade: renders chat icon instantly as part of page HTML (0ms delay).
            Full widget loads on hover/click/idle and replaces the facade. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.GOLUM_CONFIG={apiKey:'pk_WtOK_KVO5GhBuVv8ikS3xEXpH8DGMnYL',apiUrl:'https://golum-be.onrender.com'};
(function(){
  var c=window.GOLUM_CONFIG||{},d=document;
  var color=c.primaryColor||'#00875A';
  var pos=c.position==='bottom-left'?'left:20px':'right:20px';
  var b=d.createElement('div');
  b.id='golum-facade';
  b.setAttribute('role','button');
  b.setAttribute('aria-label','Chat');
  b.setAttribute('tabindex','0');
  b.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  b.style.cssText='position:fixed;bottom:20px;'+pos+';width:56px;height:56px;background:'+color+';border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2147483647;box-shadow:0 4px 16px rgba(0,0,0,0.16);border:none;transition:transform 0.2s ease,box-shadow 0.2s ease;';
  b.onmouseenter=function(){b.style.transform='scale(1.05)';b.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)';loadW();};
  b.onmouseleave=function(){b.style.transform='scale(1)';b.style.boxShadow='0 4px 16px rgba(0,0,0,0.16)';};
  b.onclick=function(){loadW(true);};
  var loaded=false;
  function loadW(open){
    if(loaded)return;loaded=true;
    var s=d.createElement('script');
    s.src='https://golum-widget.netlify.app/widget.js';
    s.onload=function(){
      var f=d.getElementById('golum-facade');
      if(f)f.remove();
    };
    d.body.appendChild(s);
  }
  if(window.requestIdleCallback){window.requestIdleCallback(function(){loadW();},{timeout:3000});}
  else{setTimeout(function(){loadW();},3000);}
  if(d.body){d.body.appendChild(b);}
  else{d.addEventListener('DOMContentLoaded',function(){d.body.appendChild(b);});}
})();`,
          }}
        />
      </body>
    </html>
  );
}
