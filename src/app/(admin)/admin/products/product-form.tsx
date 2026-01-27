"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name_en: z.string().min(2, "English name must be at least 2 characters."),
  name_tr: z.string().min(2, "Turkish name must be at least 2 characters."),
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters."),
  description_en: z.string().min(10, "English description must be at least 10 characters."),
  description_tr: z.string().min(10, "Turkish description must be at least 10 characters."),
  description_ar: z.string().min(10, "Arabic description must be at least 10 characters."),
  images: z.string().min(1, "Please provide at least one image URL."),
  status: z.enum(["available", "sold_out"]),
  videoUrl: z.string().url().optional().or(z.literal('')),
});

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_en: product?.name.en || "",
      name_tr: product?.name.tr || "",
      name_ar: product?.name.ar || "",
      description_en: product?.description.en || "",
      description_tr: product?.description.tr || "",
      description_ar: product?.description.ar || "",
      images: product?.images.join('\n') || "",
      status: product?.status || "available",
      videoUrl: product?.videoUrl || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    toast({
      title: "Product Saved",
      description: `Product "${values.name_en}" has been successfully saved.`,
    });
    router.push('/admin/products');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin_product_name')}</CardTitle>
                <CardDescription>Provide the product name in all supported languages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name_en" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="name_tr" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Turkish)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="name_ar" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Arabic)</FormLabel>
                    <FormControl><Input {...field} dir="rtl"/></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin_product_description')}</CardTitle>
                <CardDescription>Provide a detailed description in all supported languages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField control={form.control} name="description_en" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (English)</FormLabel>
                    <FormControl><Textarea {...field} rows={5} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                 <FormField control={form.control} name="description_tr" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Turkish)</FormLabel>
                    <FormControl><Textarea {...field} rows={5} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                 <FormField control={form.control} name="description_ar" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Arabic)</FormLabel>
                    <FormControl><Textarea {...field} rows={5} dir="rtl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin_product_status')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">{t('available')}</SelectItem>
                          <SelectItem value="sold_out">{t('sold_out')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin_product_images')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="images" render={({ field }) => (
                  <FormItem>
                    <FormControl><Textarea {...field} rows={6} /></FormControl>
                    <FormDescription>{t('admin_product_images_hint')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin_product_video')}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                  <FormItem>
                    <FormControl><Input {...field} placeholder="https://youtube.com/..." /></FormControl>
                    <FormDescription>{t('admin_product_video_hint')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}/>
              </CardContent>
            </Card>
          </div>
        </div>
        <Button type="submit">{t('admin_save_changes')}</Button>
      </form>
    </Form>
  );
}
