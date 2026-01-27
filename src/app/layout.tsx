import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/context/language-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'HN TextileVerse',
  description: 'Discover the finest in fashion with HN TextileVerse. Explore our collections of high-quality textiles and designs.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#6A869A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <ClientRootLayout>{children}</ClientRootLayout>
    </LanguageProvider>
  );
}

// Client component to handle language direction
function ClientRootLayout({ children }: { children: React.ReactNode }) {
  // A simple way to get language without a full context/hook which might cause issues in root layout
  const lang = typeof window !== 'undefined' ? (localStorage.getItem('language') || 'en') : 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={cn('font-body antialiased', { 'font-headline': false })}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
