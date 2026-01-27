"use client";

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/hooks/use-language';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.254 4.579 4.66-1.225z" />
    </svg>
);


export function WhatsAppButton() {
  const { t } = useLanguage();
  // Replace with your actual WhatsApp number
  const whatsappNumber = "901234567890"; 

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('whatsapp_chat')}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button size="icon" className="h-14 w-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600">
              <WhatsAppIcon />
            </Button>
          </a>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{t('whatsapp_chat')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
