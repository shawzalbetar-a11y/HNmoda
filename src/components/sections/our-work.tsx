'use client';

import { useState, useMemo } from 'react';
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
import { whatsappUrl as siteWhatsappUrl } from '@/lib/config';
import { PlayCircle } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Spinner } from '@/components/ui/spinner';


type WorkItem = { 
    id: string, 
    category: string, 
    url: string, 
    name: string,
    type: 'image' | 'video' 
};


export function OurWork() {
    const { language } = useLanguage();
    const t = translations[language].ourWork;
    const firestore = useFirestore();

    const galleryQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'gallery'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: allWork, loading } = useCollection<WorkItem>(galleryQuery);

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

    const filteredWork = !allWork 
        ? [] 
        : activeFilter === 'all'
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
        const whatsappUrl = `${siteWhatsappUrl}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        setIsOrderModalOpen(false);
    };


    return (
        <section id="our-work" className="py-20 bg-secondary">
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

                {loading && (
                    <div className="flex justify-center py-8">
                        <Spinner className="h-8 w-8" />
                    </div>
                )}

                {!loading && filteredWork && filteredWork.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredWork.map(work => (
                            <Card key={work.id} className="overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl" onClick={() => setSelectedWork(work)}>
                                <CardContent className="p-0">
                                    <div className="relative aspect-[3/4]">
                                        <Image src={work.url} alt={work.name} fill className="object-cover" data-ai-hint="fashion product" />
                                        {work.type === 'video' && (
                                            <PlayCircle className="absolute bottom-2 right-2 h-8 w-8 text-white bg-black/40 rounded-full p-1" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                 {!loading && (!filteredWork || filteredWork.length === 0) && (
                    <p className="text-center text-muted-foreground">No items to display in this category.</p>
                )}
            </div>

            {selectedWork && (
                <Dialog open={!!selectedWork} onOpenChange={(open) => !open && setSelectedWork(null)}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{selectedWork.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                            <div className="relative aspect-[3/4]">
                                {selectedWork.type === 'image' ? (
                                    <Image src={selectedWork.url} alt={selectedWork.name} fill className="object-cover rounded-md" data-ai-hint="fashion product" />
                                ) : (
                                    <video src={selectedWork.url} className="w-full h-full object-cover rounded-md" controls autoPlay muted loop playsInline />
                                )}
                            </div>
                            <div>
                                <DialogDescription>
                                    <p className="mb-4">{t.imagePopup.description}</p>
                                </DialogDescription>
                                <Button onClick={() => {
                                    setIsOrderModalOpen(true);
                                }}>{t.imagePopup.orderButton}</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            
            <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                <DialogContent className="overflow-y-auto max-h-[90vh]">
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
