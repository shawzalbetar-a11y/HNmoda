'use client';

import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Copyright, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AboutUsModal } from '@/components/sections/about-us';
import { ContactUsModal } from '@/components/sections/contact-us-modal';
import { siteConfig } from '@/lib/config';
import { Icons } from '@/components/shared/icons';

export function Footer() {
    const { language } = useLanguage();
    const t = translations[language];
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
                        <li><button onClick={() => setIsAboutModalOpen(true)} className="bg-transparent border-none p-0 text-left hover:underline">{t.header.about}</button></li>
                        <li><Link href="/#our-work" className="hover:underline">{t.header.gallery}</Link></li>
                        <li><button onClick={() => setIsContactModalOpen(true)} className="bg-transparent border-none p-0 text-left hover:underline">{t.header.contact}</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">{t.footer.contactInfo}</h4>
                    <address className="mt-2 space-y-1 text-sm not-italic text-muted-foreground">
                        <p>{t.footer.address}</p>
                        <p>{siteConfig.contact.address}</p>
                    </address>
                    <div className="flex items-center space-x-4 mt-4">
                        <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Icons.tiktok className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t border-border pt-4 flex items-center justify-center text-xs text-muted-foreground">
                <Copyright className="h-4 w-4 mr-1" />
                {new Date().getFullYear()} HUMAN NATURE. {t.footer.rightsReserved}
            </div>
            <AboutUsModal isOpen={isAboutModalOpen} onOpenChange={setIsAboutModalOpen} />
            <ContactUsModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
        </footer>
    )
}
