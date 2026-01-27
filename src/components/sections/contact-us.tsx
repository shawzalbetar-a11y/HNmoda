'use client';

import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

export function ContactUs() {
    const { language } = useLanguage();
    const t = translations[language].contactUs;

    const contactMethods = [
        { icon: <Phone className="w-6 h-6" />, text: t.phone, value: "+90 500 000 00 00" },
        { icon: <Mail className="w-6 h-6" />, text: t.email, value: "contact@hn-textile.com" },
        { icon: <MapPin className="w-6 h-6" />, text: t.office, value: "Istanbul, Turkey" },
    ];
    
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display">{t.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
                </div>
                
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="text-primary mb-2">{method.icon}</div>
                            <h3 className="font-semibold">{method.text}</h3>
                            <p className="text-sm text-muted-foreground">{method.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center flex-wrap gap-4">
                    <Button asChild size="lg">
                        <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
                        </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <a href="https://t.me/your_telegram_username" target="_blank" rel="noopener noreferrer">
                            <Send className="mr-2 h-5 w-5" /> Telegram
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
