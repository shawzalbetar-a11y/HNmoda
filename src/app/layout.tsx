import type { Metadata, Viewport } from 'next';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/language-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/theme-provider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HUMAN NATURE | High Quality Women\'s Fashion in Istanbul',
    template: '%s | HUMAN NATURE'
  },
  description: 'Discover the best of fashion with HNmoda. High-quality textile and design collections in Istanbul, Turkey. ملابس نسائية راقية في إسطنبول.',
  keywords: ['fashion', 'istanbul', 'women clothing', 'textile', 'wholesale', 'hnmoda', 'human nature', 'ملابس نسائية', 'اسطنبول', 'تركيا', 'moda'],
  manifest: '/manifest.json',
  verification: {
    google: 'fICrYb_DNgHsTS4l7dJfdZzrrQBJYetbUvVD5rA_vL8',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hnmoda.tr',
    title: 'HUMAN NATURE | High Quality Women\'s Fashion',
    description: 'Explore our latest collections of high-quality women\'s fashion and textiles.',
    siteName: 'HUMAN NATURE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HUMAN NATURE | Fashion',
    description: 'High Quality Women\'s Fashion in Istanbul.',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <body className={cn('font-body antialiased', playfair.variable, ptSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <LanguageProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <WhatsAppButton />
              <Toaster />
            </LanguageProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

