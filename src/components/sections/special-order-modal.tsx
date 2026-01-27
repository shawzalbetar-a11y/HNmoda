'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { whatsappUrl as siteWhatsappUrl } from '@/lib/config';

interface SpecialOrderModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function SpecialOrderModal({ isOpen, onOpenChange }: SpecialOrderModalProps) {
    const { language } = useLanguage();
    const t = translations[language].specialOrder;

    const [formState, setFormState] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        details: '',
        quantity: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormState(prevState => ({ ...prevState, [id]: value }));
    };

    const handleOrderSubmit = () => {
        const message = `
            *${t.whatsappMessageHeader}*
            -----------------------------
            ${t.name}: ${formState.name} ${formState.surname}
            ${t.phone}: ${formState.phone}
            ${t.email}: ${formState.email}
            ${t.quantity}: ${formState.quantity}
            -----------------------------
            *${t.details}*
            ${formState.details}
            -----------------------------
        `.trim().replace(/^\s+/gm, '');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `${siteWhatsappUrl}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display">{t.title}</DialogTitle>
                    <DialogDescription className="pt-2">
                        {t.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t.name}</Label>
                            <Input id="name" value={formState.name} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="surname">{t.surname}</Label>
                            <Input id="surname" value={formState.surname} onChange={handleInputChange} />
                        </div>
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">{t.phone}</Label>
                            <Input id="phone" value={formState.phone} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input id="email" type="email" value={formState.email} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">{t.quantity}</Label>
                        <Input id="quantity" type="number" placeholder={t.quantity_placeholder} value={formState.quantity} onChange={handleInputChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="details">{t.details}</Label>
                        <Textarea id="details" placeholder={t.details_placeholder} value={formState.details} onChange={handleInputChange} rows={5} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleOrderSubmit} className="w-full md:w-auto">{t.submitButton}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
