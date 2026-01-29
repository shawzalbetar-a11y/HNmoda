import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/language-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'HUMAN NATURE',
  description: 'HNmoda ile modanın en iyisini keşfedin. Yüksek kaliteli tekstil ve tasarım koleksiyonlarımızı inceleyin..',
  manifest: '/manifest.json',
  verification: 'fICrYb_DNgHsTS4l7dJfdZzrrQBJYetbUvVD5rA_vL8',
  };

 export const metadata = {
  title: 'hnmoda',
  description: 'hnmoda',
  title: 'Human Nature - ملابس نسائية في إسطنبول',
  description: 'أفضل التصاميم النسائية من شركة HNmoda في تركيا',
  title: 'Human Nature - İstanbulda kadın giyim',
   description: 'HN Moda en iyi mankenlere sahip.',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
         <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={cn('font-body antialiased')}>
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
      </body>
    </html>
  );
}
