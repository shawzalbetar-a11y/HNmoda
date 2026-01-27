'use client';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/config';

export function WhatsAppButton() {
    return (
        <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50"
        >
            <Button size="icon" className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg">
                <MessageCircle className="w-8 h-8" />
            </Button>
        </a>
    )
}
