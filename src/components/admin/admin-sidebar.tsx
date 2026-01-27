"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingCart, Settings, Package2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const adminNavItems = [
  { href: '/admin', labelKey: 'admin_dashboard', icon: LayoutDashboard },
  { href: '/admin/products', labelKey: 'admin_products', icon: ShoppingCart },
  { href: '/admin/settings', labelKey: 'admin_settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold font-headline">
            <Package2 className="h-6 w-6" />
            <span className="">{t('nav_admin')}</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))) && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
