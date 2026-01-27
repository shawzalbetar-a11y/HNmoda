'use client';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
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

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/#what-we-do', label: t.categories },
    { href: '/#our-work', label: t.gallery },
    { href: '/contact', label: t.contact },
    { href: '/about', label: t.about },
    { href: '/special-order', label: t.specialOrder, isButton: true },
  ];

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
              <img src="/images/logo.png" alt="HUMAN NATURE Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
            </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
             if (link.href === '/about') {
              return (
                <button
                  key={link.href}
                  onClick={() => setIsAboutModalOpen(true)}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              );
            }
            if (link.href === '/contact') {
              return (
                <button
                  key={link.href}
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              );
            }
            if (link.isButton) {
              return (
                <Button key={link.href} onClick={() => setIsSpecialOrderModalOpen(true)} variant="default" size="sm">
                  {link.label}
                </Button>
              )
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-4">
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
      </div>
      {isMobileMenuOpen && (
        <div
          className={cn(
            'md:hidden bg-background/95 backdrop-blur-sm absolute top-20 left-0 w-full z-40',
            'transition-all duration-300 ease-in-out'
          )}
        >
          <nav className="flex flex-col items-center space-y-4 py-8">
            {navLinks.map((link) => {
              if (link.href === '/about') {
                return (
                   <button
                    key={link.href}
                    onClick={() => {
                      setIsAboutModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                )
              }
              if (link.href === '/contact') {
                return (
                   <button
                    key={link.href}
                    onClick={() => {
                      setIsContactModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                )
              }
              if (link.isButton) {
                return (
                  <Button key={link.href} onClick={() => { setIsSpecialOrderModalOpen(true); setIsMobileMenuOpen(false); }} className="w-4/5">
                    {link.label}
                  </Button>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
       <AboutUsModal isOpen={isAboutModalOpen} onOpenChange={setIsAboutModalOpen} />
       <ContactUsModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
       <SpecialOrderModal isOpen={isSpecialOrderModalOpen} onOpenChange={setIsSpecialOrderModalOpen} />
    </header>
  );
}
