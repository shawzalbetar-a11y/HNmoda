'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const allWork = [
    // Placeholder data
    { id: 1, category: 'models', season: 'all', type: 'all', src: `https://picsum.photos/seed/a/600/800`, name: 'Elegant Dress' },
    { id: 2, category: 'collections', season: 'all', type: 'all', src: `https://picsum.photos/seed/b/600/800`, name: 'Summer Collection' },
    { id: 3, category: 'products', season: 'all', type: 'all', src: `https://picsum.photos/seed/c/600/800`, name: 'Casual Shirt' },
    { id: 4, category: 'models', season: 'all', type: 'all', src: `https://picsum.photos/seed/d/600/800`, name: 'Formal Suit' },
    { id: 5, category: 'collections', season: 'all', type: 'all', src: `https://picsum.photos/seed/e/600/800`, name: 'Winter Wear' },
    { id: 6, category: 'products', season: 'all', type: 'all', src: `https://picsum.photos/seed/f/600/800`, name: 'Denim Jeans' },
];

type WorkItem = typeof allWork[0];


export function OurWork() {
    const { language } = useLanguage();
    const t = translations[language].ourWork;

    const filters = [
        { key: 'all', label: t.filters.all },
        { key: 'models', label: t.filters.models },
        { key: 'collections', label: t.filters.collections },
        { key: 'products', label: t.filters.products },
    ];
    
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const [formState, setFormState] = useState({
        name: '',
        surname: '',
        phone: '',
        size: '',
        note: '',
    });

    const filteredWork = activeFilter === 'all'
        ? allWork
        : allWork.filter(work => work.category === activeFilter);
        
    const handleOrderSubmit = () => {
        const message = `
            ${t.orderForm.whatsappMessageHeader}
            -----------------------------
            ${t.orderForm.product}: ${selectedWork?.name}
            ${t.orderForm.name}: ${formState.name} ${formState.surname}
            ${t.orderForm.phone}: ${formState.phone}
            ${t.orderForm.size}: ${formState.size}
            ${t.orderForm.note}: ${formState.note}
            -----------------------------
        `.trim().replace(/^\s+/gm, '');
        const encodedMessage = encodeURIComponent(message);
        // Replace with your WhatsApp number
        const whatsappUrl = `https://wa.me/905449996865?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        setIsOrderModalOpen(false);
    };


    return (
        <section className="py-20 bg-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display">{t.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
                </div>
                
                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    {filters.map(filter => (
                        <Button
                            key={filter.key}
                            variant={activeFilter === filter.key ? 'default' : 'outline'}
                            onClick={() => setActiveFilter(filter.key)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredWork.map(work => (
                        <Card key={work.id} className="overflow-hidden cursor-pointer" onClick={() => setSelectedWork(work)}>
                            <CardContent className="p-0">
                                <div className="relative aspect-[3/4]">
                                    <Image src={work.src} alt={work.name} fill className="object-cover" data-ai-hint="fashion product" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {selectedWork && (
                <Dialog open={!!selectedWork} onOpenChange={(open) => !open && setSelectedWork(null)}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{selectedWork.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                            <div className="relative aspect-[3/4]">
                                <Image src={selectedWork.src} alt={selectedWork.name} fill className="object-cover rounded-md" data-ai-hint="fashion product" />
                            </div>
                            <div>
                                <DialogDescription>
                                    <p className="mb-4">{t.imagePopup.description}</p>
                                    {/* More details can be added here */}
                                </DialogDescription>
                                <Button onClick={() => {
                                    setSelectedWork(null);
                                    setTimeout(() => setIsOrderModalOpen(true), 150);
                                    setSelectedWork(selectedWork);
                                }}>{t.imagePopup.orderButton}</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            
            <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.orderForm.title}</DialogTitle>
                        <DialogDescription>{t.orderForm.description}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">{t.orderForm.name}</Label>
                            <Input id="name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="surname" className="text-right">{t.orderForm.surname}</Label>
                            <Input id="surname" value={formState.surname} onChange={e => setFormState({...formState, surname: e.target.value})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">{t.orderForm.phone}</Label>
                            <Input id="phone" value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="size" className="text-right">{t.orderForm.size}</Label>
                            <Input id="size" value={formState.size} onChange={e => setFormState({...formState, size: e.target.value})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="note" className="text-right">{t.orderForm.note}</Label>
                            <Textarea id="note" value={formState.note} onChange={e => setFormState({...formState, note: e.target.value})} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleOrderSubmit}>{t.orderForm.submitButton}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
