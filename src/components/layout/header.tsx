"use client";

import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/shared/logo';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Package2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/products', label: t('nav_products') },
    { href: '/admin', label: t('nav_admin') },
  ];

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground",
        pathname === href ? "text-foreground font-semibold" : "text-muted-foreground"
      )}
      onClick={() => setSheetOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto hidden md:flex">
          <Logo />
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center justify-end flex-1 gap-2">
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Logo />
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">{t('appName')}</span>
                </Link>
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
                ))}
                <div className="absolute bottom-4 right-4">
                  <LanguageSwitcher />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
