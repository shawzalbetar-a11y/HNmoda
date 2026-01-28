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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from '@/lib/utils';


type WorkItem = {
    id: string;
    category: string;
    url: string;
    imageUrl2?: string;
    imageUrl3?: string;
    imageUrl4?: string;
    videoUrl?: string;
    name: string;
    price?: number;
    inventoryStatus: 'available' | 'sold out' | 'by request';
    itemType: string;
    season: 'Spring/Summer' | 'Fall/Winter' | 'All-Season';
    description?: string;
};

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            const videoIdParam = urlObj.searchParams.get('v');
            if (urlObj.pathname.includes('/watch') && videoIdParam) {
                videoId = videoIdParam;
            } else if (urlObj.pathname.includes('/shorts/')) {
                videoId = urlObj.pathname.split('/shorts/')[1].split('?')[0];
            } else if (urlObj.pathname.includes('/embed/')) {
                videoId = urlObj.pathname.split('/embed/')[1].split('?')[0];
            }
        } else if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.substring(1).split('?')[0];
        }
    } catch (e) {
        return null;
    }
    return videoId;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
    return null;
};

const getYouTubeThumbnailUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
};


export function OurWork() {
    const { language } = useLanguage();
    const t = translations[language].ourWork;
    const tAdmin = translations[language].admin;
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

    const seasonFilters = [
        { key: 'all', label: t.filters.all },
        { key: 'Spring/Summer', label: tAdmin.springSummer },
        { key: 'Fall/Winter', label: tAdmin.fallWinter },
        { key: 'All-Season', label: tAdmin.allSeason },
    ];
    
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeSeasonFilter, setActiveSeasonFilter] = useState('all');
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
        : allWork.filter(work => {
            const categoryMatch = activeFilter === 'all' || work.category === activeFilter;
            const seasonMatch = activeSeasonFilter === 'all' || work.season === activeSeasonFilter;
            return categoryMatch && seasonMatch;
        });
        
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

    const getTranslation = (key: string) => {
        const keyMap: { [key: string]: keyof typeof tAdmin } = {
            'Spring/Summer': 'springSummer',
            'Fall/Winter': 'fallWinter',
            'All-Season': 'allSeason',
            'available': 'available',
            'sold out': 'soldOut',
            'by request': 'byRequest',
        };
        const mappedKey = keyMap[key];
        return tAdmin[mappedKey] || key;
    };

    const mediaForSelectedWork = useMemo(() => {
        if (!selectedWork) return [];
        const media = [];
        if (selectedWork.url) {
            const mainUrlIsYoutube = !!getYouTubeVideoId(selectedWork.url);
            if (mainUrlIsYoutube) {
                media.push({ type: 'video', url: selectedWork.url });
            } else {
                media.push({ type: 'image', url: selectedWork.url });
            }
        }
        if (selectedWork.imageUrl2) media.push({ type: 'image', url: selectedWork.imageUrl2 });
        if (selectedWork.imageUrl3) media.push({ type: 'image', url: selectedWork.imageUrl3 });
        if (selectedWork.imageUrl4) media.push({ type: 'image', url: selectedWork.imageUrl4 });
        if (selectedWork.videoUrl) media.push({ type: 'video', url: selectedWork.videoUrl });
        return media;
    }, [selectedWork]);


    return (
        <section id="our-work" className="py-20 bg-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display">{t.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
                </div>
                
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex items-center justify-center flex-wrap gap-2">
                        <span className="text-sm font-medium text-muted-foreground mr-2">{t.filters.category}:</span>
                        {filters.map(filter => (
                            <Button
                                key={filter.key}
                                variant={activeFilter === filter.key ? 'default' : 'outline'}
                                onClick={() => setActiveFilter(filter.key)}
                                size="sm"
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center justify-center flex-wrap gap-2">
                        <span className="text-sm font-medium text-muted-foreground mr-2">{t.filters.season}:</span>
                        {seasonFilters.map(filter => (
                            <Button
                                key={filter.key}
                                variant={activeSeasonFilter === filter.key ? 'default' : 'outline'}
                                onClick={() => setActiveSeasonFilter(filter.key)}
                                size="sm"
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center py-8">
                        <Spinner className="h-8 w-8" />
                    </div>
                )}

                {!loading && filteredWork && filteredWork.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredWork.map(work => {
                            const mainUrlIsYoutube = !!getYouTubeVideoId(work.url);
                            const thumbnailUrl = mainUrlIsYoutube ? getYouTubeThumbnailUrl(work.url) || work.url : work.url;

                            let isInvalidUrl = false;
                            try {
                                new URL(thumbnailUrl);
                            } catch (e) {
                                isInvalidUrl = true;
                            }
                            if (isInvalidUrl) return null;

                            return (
                                <Card key={work.id} className="overflow-hidden cursor-pointer group transition-shadow duration-300 ease-in-out hover:shadow-xl" onClick={() => setSelectedWork(work)}>
                                    <CardContent className="p-0">
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <Image src={thumbnailUrl} alt={work.name} fill className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" data-ai-hint="fashion product" />
                                            {(work.videoUrl || mainUrlIsYoutube) && (
                                                <PlayCircle className="absolute bottom-2 right-2 h-8 w-8 text-white bg-black/40 rounded-full p-1" />
                                            )}
                                            {work.inventoryStatus === 'sold out' && (
                                                <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded">{t.soldOut}</div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <div className="p-3 border-t">
                                        <p className="font-semibold truncate text-sm text-center">{work.name}</p>
                                        {work.category === 'products' && work.price && (
                                            <p className="text-sm font-bold text-primary text-center mt-1">{work.price} TL</p>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
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
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {mediaForSelectedWork.map((media, index) => (
                                        <CarouselItem key={index}>
                                            <div className="relative aspect-[3/4]">
                                                {media.type === 'image' ? (
                                                    <Image src={media.url} alt={`${selectedWork.name} - ${index + 1}`} fill className="object-cover rounded-md" />
                                                ) : getYouTubeEmbedUrl(media.url) ? (
                                                    <iframe
                                                        className="w-full h-full rounded-md"
                                                        src={getYouTubeEmbedUrl(media.url)}
                                                        title={selectedWork.name}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                ) : (
                                                    <video src={media.url} className="w-full h-full object-cover rounded-md" controls autoPlay muted loop playsInline />
                                                )}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {mediaForSelectedWork.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </>
                                )}
                            </Carousel>
                            <div className="flex flex-col">
                                <div className="space-y-4">
                                    {selectedWork.category === 'products' && selectedWork.price && (
                                        <p className="text-2xl font-bold text-primary">{selectedWork.price} TL</p>
                                    )}

                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <p><span className="font-semibold text-foreground">{t.imagePopup.itemType}:</span> {selectedWork.itemType}</p>
                                        <p><span className="font-semibold text-foreground">{t.imagePopup.season}:</span> {getTranslation(selectedWork.season)}</p>
                                        <p><span className="font-semibold text-foreground">{t.imagePopup.inventoryStatus}:</span> <span className={cn('font-bold', {
                                            'text-destructive': selectedWork.inventoryStatus === 'sold out',
                                            'text-green-600': selectedWork.inventoryStatus === 'available',
                                            'text-primary': selectedWork.inventoryStatus === 'by request',
                                        })}>{getTranslation(selectedWork.inventoryStatus)}</span></p>
                                    </div>

                                    {selectedWork.description && (
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">{t.imagePopup.descriptionHeader}</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{selectedWork.description}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <Button
                                        onClick={() => { setIsOrderModalOpen(true); }}
                                        disabled={selectedWork.inventoryStatus === 'sold out'}
                                    >
                                        {selectedWork.inventoryStatus === 'sold out' ? t.soldOut : t.imagePopup.orderButton}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            
            <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                <DialogContent className="overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{t.orderForm.title}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{t.orderForm.description}</p>
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
