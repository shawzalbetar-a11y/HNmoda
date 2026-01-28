'use client';
import { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection, useFirestore } from '@/firebase';
import { addGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/firebase/firestore/gallery';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type GalleryItem = {
    id: string;
    url: string;
    type: 'image' | 'video';
    category: 'models' | 'collections' | 'products';
    name: string;
    createdAt: any;
};

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    url: z.string().url({ message: "Please enter a valid URL." }),
    category: z.enum(['models', 'collections', 'products']),
    type: z.enum(['image', 'video']),
});

type FormValues = z.infer<typeof formSchema>;


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
            name: '',
            url: '',
            category: 'models',
            type: 'image',
        },
    });

    const { reset, setValue } = form;

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!firestore) return;
        
        if (editingItem) {
            updateGalleryItem(firestore, editingItem.id, data);
            toast({ title: t.itemUpdated });
            setEditingItem(null);
        } else {
            addGalleryItem(firestore, data);
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
        setValue('name', item.name);
        setValue('url', item.url);
        setValue('category', item.category);
        setValue('type', item.type);
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
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.url}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.webp" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t.type}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="image">{t.image}</SelectItem>
                                                    <SelectItem value="video">{t.video}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                            {galleryItems.map((item) => (
                                <Card key={item.id} className="group relative overflow-hidden">
                                    <div className="relative aspect-[3/4]">
                                        {item.type === 'image' ? (
                                            <Image src={item.url} alt={item.name} fill className="object-cover"/>
                                        ) : (
                                            <video src={item.url} className="w-full h-full object-cover" muted loop playsInline />
                                        )}
                                    </div>
                                    <div className="p-2 text-sm">
                                        <p className="font-semibold truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.category} / {item.type}</p>
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
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
