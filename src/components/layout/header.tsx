'use client';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, Instagram, Facebook } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Icons } from '@/components/shared/icons';
import { siteConfig } from '@/lib/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AboutUsModal } from '@/components/sections/about-us';
import { ContactUsModal } from '@/components/sections/contact-us-modal';
import { SpecialOrderModal } from '@/components/sections/special-order-modal';

export function Header() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language].header;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSpecialOrderModalOpen, setIsSpecialOrderModalOpen] = useState(false);

  const navItems = [
    { type: 'link', href: '/', label: t.home },
    { type: 'link', href: '/#what-we-do', label: t.categories },
    { type: 'link', href: '/#our-work', label: t.gallery },
    { type: 'modal', label: t.contact, action: () => setIsContactModalOpen(true) },
    { type: 'modal', label: t.about, action: () => setIsAboutModalOpen(true) },
    { type: 'button', label: t.specialOrder, action: () => setIsSpecialOrderModalOpen(true) },
  ];

  const renderNavItem = (item: (typeof navItems)[0], isMobile = false) => {
    const mobileProps = isMobile ? { onClick: () => setIsMobileMenuOpen(false) } : {};
    const mobileModalProps = isMobile ? { onClick: () => { item.action(); setIsMobileMenuOpen(false); } } : { onClick: item.action };

    switch (item.type) {
      case 'link':
        return (
          <Link
            key={item.href}
            href={item.href}
            className={isMobile ? "text-lg font-medium text-foreground hover:text-primary transition-colors" : "text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"}
            {...mobileProps}
          >
            {item.label}
          </Link>
        );
      case 'modal':
        return (
          <button
            key={item.label}
            className={isMobile ? "text-lg font-medium text-foreground hover:text-primary transition-colors" : "text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"}
            {...mobileModalProps}
          >
            {item.label}
          </button>
        );
      case 'button':
        return (
          <Button key={item.label} onClick={mobileModalProps.onClick} variant="default" size={isMobile ? undefined : "sm"} className={isMobile ? 'w-4/5' : ''}>
            {item.label}
          </Button>
        );
      default:
        return null;
    }
  };


  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div
            className="relative"
            style={{
              width: '48px',
              height: '48px',
            }}
          >
            <img src="/images/logo.png" alt="HUMAN NATURE Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        <ThemeToggle />
        <div className="hidden md:flex items-center space-x-2">
          <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-foreground transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-foreground transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-foreground transition-colors">
            <Icons.tiktok className="h-4 w-4" />
          </a>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('tr')}>Türkçe</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ar')}>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {
        isMobileMenuOpen && (
          <div
            className={cn(
              'md:hidden bg-background/95 backdrop-blur-sm absolute top-20 left-0 w-full z-40',
              'transition-all duration-300 ease-in-out'
            )}
          >
            <nav className="flex flex-col items-center space-y-4 py-8">
              {navItems.map((item) => renderNavItem(item, true))}
              <div className="flex items-center space-x-4 mt-4">
                <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
                  <Icons.tiktok className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </div>
        )
      }
      <AboutUsModal isOpen={isAboutModalOpen} onOpenChange={setIsAboutModalOpen} />
      <ContactUsModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
      <SpecialOrderModal isOpen={isSpecialOrderModalOpen} onOpenChange={setIsSpecialOrderModalOpen} />
    </header >
  );
}
