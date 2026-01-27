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

interface AboutUsModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function AboutUsModal({ isOpen, onOpenChange }: AboutUsModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{t.aboutUs.title}</DialogTitle>
          <DialogDescription className="pt-4 text-base text-muted-foreground">
            {t.aboutUs.intro}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 text-sm">
            <div>
                <h3 className="font-semibold text-foreground">{t.aboutUs.specialT}</h3>
                <p className="mt-1 text-muted-foreground">{t.aboutUs.specialT_desc}</p>
            </div>
            <div>
                <h3 className="font-semibold text-foreground">{t.aboutUs.clients}</h3>
                <p className="mt-1 text-muted-foreground">{t.aboutUs.clients_desc}</p>
            </div>
            <div>
                <h3 className="font-semibold text-foreground">{t.aboutUs.mission}</h3>
                <p className="mt-1 text-muted-foreground">{t.aboutUs.mission_desc}</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
