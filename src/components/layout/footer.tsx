'use client';

import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Copyright } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <footer className="bg-secondary text-secondary-foreground py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold font-display">HUMAN NATURE</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t.footer.experience}</p>
                </div>
                <div>
                    <h4 className="font-semibold">{t.footer.quickLinks}</h4>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li><Link href="/about" className="hover:underline">{t.header.about}</Link></li>
                        <li><Link href="/gallery" className="hover:underline">{t.header.gallery}</Link></li>
                        <li><Link href="/contact" className="hover:underline">{t.header.contact}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">{t.footer.contactInfo}</h4>
                    <address className="mt-2 space-y-1 text-sm not-italic text-muted-foreground">
                        <p>{t.footer.address}</p>
                        <p>Istanbul, Turkey</p>
                    </address>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t border-border pt-4 flex items-center justify-center text-xs text-muted-foreground">
                <Copyright className="h-4 w-4 mr-1" />
                {new Date().getFullYear()} HUMAN NATURE. {t.footer.rightsReserved}
            </div>
        </footer>
    )
}
