'use client';

import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

interface ContactUsModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function ContactUsModal({ isOpen, onOpenChange }: ContactUsModalProps) {
  const { language } = useLanguage();
  const t = translations[language].contactUs;

  const contactMethods = [
      { icon: <Phone className="w-6 h-6" />, text: t.phone, value: "+90 5449996865" },
      { icon: <Mail className="w-6 h-6" />, text: t.email, value: "info@hnmoda.tr" },
      { icon: <MapPin className="w-6 h-6" />, text: t.office, value: "Istanbul, Turkey" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{t.title}</DialogTitle>
          <DialogDescription className="pt-4 text-base text-muted-foreground">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
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
                    <a href="https://wa.me/905449996865" target="_blank" rel="noopener noreferrer">
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
      </DialogContent>
    </Dialog>
  );
}
