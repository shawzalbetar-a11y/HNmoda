'use client';
import { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection, useFirestore } from '@/firebase';
import { addGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/firebase/firestore/gallery';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { PlayCircle } from 'lucide-react';
import { format } from 'date-fns';

type GalleryItem = {
    id: string;
    productCode?: string;
    url: string;
    imageUrl2?: string;
    imageUrl3?: string;
    imageUrl4?: string;
    videoUrl?: string;
    category: 'models' | 'collections' | 'products';
    name: string;
    itemType: string;
    season: 'Spring/Summer' | 'Fall/Winter' | 'All-Season';
    inventoryStatus: 'available' | 'sold out' | 'by request';
    description?: string;
    createdAt: Timestamp;
    price?: number;
};

const formSchema = z.object({
    productCode: z.string().optional(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    url: z.string().url({ message: "Please enter a valid URL." }),
    imageUrl2: z.preprocess((val) => (val === "" ? undefined : val), z.string().url({ message: "Please enter a valid URL." }).optional()),
    imageUrl3: z.preprocess((val) => (val === "" ? undefined : val), z.string().url({ message: "Please enter a valid URL." }).optional()),
    imageUrl4: z.preprocess((val) => (val === "" ? undefined : val), z.string().url({ message: "Please enter a valid URL." }).optional()),
    videoUrl: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().url({ message: "Please enter a valid URL." }).optional()
    ),
    category: z.enum(['models', 'collections', 'products']),
    itemType: z.string().min(1, { message: "Item type is required." }),
    season: z.enum(['Spring/Summer', 'Fall/Winter', 'All-Season']),
    inventoryStatus: z.enum(['available', 'sold out', 'by request']),
    description: z.string().optional(),
    price: z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.coerce.number({invalid_type_error: "Please enter a valid number."}).positive({ message: "Price must be positive." }).optional()
    ),
});

type FormValues = z.infer<typeof formSchema>;

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

const getYouTubeThumbnailUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
};


export function GalleryManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = translations[language].admin;

    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    const galleryQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'gallery'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: galleryItems, loading } = useCollection<GalleryItem>(galleryQuery);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productCode: '',
            name: '',
            url: '',
            imageUrl2: '',
            imageUrl3: '',
            imageUrl4: '',
            videoUrl: '',
            category: 'models',
            itemType: '',
            season: 'All-Season',
            inventoryStatus: 'available',
            description: '',
            price: undefined,
        },
    });

    const { reset, setValue, watch } = form;
    const category = watch('category');

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!firestore) return;
        
        const submissionData: any = { ...data };

        // Firestore does not support 'undefined' values. Clean up optional fields.
        Object.keys(submissionData).forEach(key => {
            if (submissionData[key] === undefined || submissionData[key] === '') {
                delete submissionData[key];
            }
        });
        
        if (submissionData.category !== 'products') {
            delete submissionData.price;
        }

        if (editingItem) {
            updateGalleryItem(firestore, editingItem.id, submissionData);
            toast({ title: t.itemUpdated });
            setEditingItem(null);
        } else {
            addGalleryItem(firestore, submissionData);
            toast({ title: t.itemAdded });
        }
        reset();
    };
    
    const handleDelete = (id: string) => {
        if (!firestore) return;
        deleteGalleryItem(firestore, id);
        toast({ title: t.itemDeleted });
    };
    
    const handleEdit = (item: GalleryItem) => {
        setEditingItem(item);
        setValue('productCode', item.productCode || '');
        setValue('name', item.name);
        setValue('url', item.url);
        setValue('imageUrl2', item.imageUrl2 || '');
        setValue('imageUrl3', item.imageUrl3 || '');
        setValue('imageUrl4', item.imageUrl4 || '');
        setValue('videoUrl', item.videoUrl || '');
        setValue('category', item.category);
        setValue('itemType', item.itemType);
        setValue('season', item.season);
        setValue('inventoryStatus', item.inventoryStatus);
        setValue('description', item.description || '');
        setValue('price', item.price);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        reset();
    };


    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{editingItem ? t.edit : t.addNewItem}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="productCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.productCode}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 0001" {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.name}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Elegant Dress" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="itemType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.itemType}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Dress, Shirt" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                             <div className="space-y-4 rounded-md border p-4">
                                <h4 className="font-medium text-center">Media URLs</h4>
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Main Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/main-image.webp" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="imageUrl2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image URL 2 <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="imageUrl3"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image URL 3 <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="imageUrl4"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image URL 4 <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.videoUrl}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.description}</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Detailed description of the item..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.category}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="models">{t.models}</SelectItem>
                                                    <SelectItem value="collections">{t.collections}</SelectItem>
                                                    <SelectItem value="products">{t.products}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="season"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.season}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a season" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Spring/Summer">{t.springSummer}</SelectItem>
                                                    <SelectItem value="Fall/Winter">{t.fallWinter}</SelectItem>
                                                    <SelectItem value="All-Season">{t.allSeason}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="inventoryStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.inventoryStatus}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="available">{t.available}</SelectItem>
                                                    <SelectItem value="sold out">{t.soldOut}</SelectItem>
                                                    <SelectItem value="by request">{t.byRequest}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {category === 'products' && (
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.price || 'Price'}</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="19.99" {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? t.adding : (editingItem ? t.save : t.addItem)}
                                </Button>
                                {editingItem && (
                                    <Button variant="outline" onClick={handleCancelEdit}>{t.cancel}</Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.galleryManagement}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading && (
                        <div className="flex justify-center py-8">
                            <Spinner className="h-8 w-8" />
                        </div>
                    )}
                    {!loading && galleryItems && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {galleryItems.map((item) => {
                                let displayUrl = item.url;
                                let isInvalidUrl = false;
                                
                                const mainUrlIsYoutube = !!getYouTubeVideoId(item.url);
                                if (mainUrlIsYoutube) {
                                    displayUrl = getYouTubeThumbnailUrl(item.url) || item.url;
                                }
                        
                                try {
                                    new URL(displayUrl);
                                } catch (error) {
                                    isInvalidUrl = true;
                                }

                                return (
                                    <Card key={item.id} className="group relative overflow-hidden">
                                        <div className="relative aspect-[3/4]">
                                            {isInvalidUrl ? (
                                                <div className="flex h-full w-full items-center justify-center bg-destructive text-destructive-foreground p-2 text-center text-xs font-semibold">
                                                    Invalid<br/>Image URL
                                                </div>
                                            ) : (
                                                <Image src={displayUrl} alt={item.name} fill className="object-cover"/>
                                            )}
                                            
                                            {item.inventoryStatus === 'sold out' && !isInvalidUrl && (
                                                <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded-md">{t.soldOut.toUpperCase()}</div>
                                            )}

                                            {(item.videoUrl || mainUrlIsYoutube) && !isInvalidUrl && (
                                                <PlayCircle className="absolute bottom-2 right-2 h-8 w-8 text-white bg-black/40 rounded-full p-1" />
                                            )}
                                        </div>
                                        <div className="p-2 text-sm">
                                            <p className="font-semibold truncate">{item.name}</p>
                                            {item.productCode && <p className="text-xs font-mono text-muted-foreground">{item.productCode}</p>}
                                            <p className="text-xs text-muted-foreground">{item.category}</p>
                                            <p className="text-xs text-muted-foreground">{item.itemType} - {item.season}</p>
                                            {item.createdAt && (
                                                <p className="text-xs text-muted-foreground italic">
                                                    {format(item.createdAt.toDate(), 'dd/MM/yyyy')}
                                                </p>
                                            )}
                                            {item.category === 'products' && item.price && (
                                                <p className="font-semibold text-sm pt-1">{item.price} TL</p>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="sm" onClick={() => handleEdit(item)}>{t.edit}</Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive">{t.delete}</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {t.deleteConfirmDescription}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(item.id)}>{t.delete}</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
