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

export function Header() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language].header;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/categories', label: t.categories },
    { href: '/gallery', label: t.gallery },
    { href: '/contact', label: t.contact },
    { href: '/about', label: t.about },
    { href: '/special-order', label: t.specialOrder, isButton: true },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
           <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'red',
                backgroundImage: "url('/logo.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              role="img"
              aria-label="HUMAN NATURE Logo"
            />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) =>
            link.isButton ? (
              <Button key={link.href} asChild variant="default" size="sm">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
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
            {navLinks.map((link) =>
              link.isButton ? (
                <Button key={link.href} asChild variant="default" className="w-4/5">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
