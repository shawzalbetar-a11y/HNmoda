
"use client";

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products, collections } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { ProductImageCarousel } from '@/components/products/product-image-carousel';
import { VideoPlayerModalClient } from '@/components/products/video-player-modal-client';
import { useMemo } from 'react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, language } = useLanguage();
  
  const product = useMemo(() => products.find((p) => p.id === params.id), [params.id]);

  if (!product) {
    notFound();
  }

  const productName = product.name[language] || product.name.en;
  const productDescription = product.description[language] || product.description.en;
  const productCollection = collections.find(c => c.id === product.collection);
  const collectionName = productCollection?.name[language] || productCollection?.name.en || product.collection;

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="flex flex-col gap-4">
          <ProductImageCarousel images={product.images} alt={productName} />
          {product.videoUrl && (
             <VideoPlayerModalClient videoUrl={product.videoUrl} productName={productName} />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{productName}</h1>
          
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant={product.status === 'available' ? 'outline' : 'destructive'} className="text-sm px-3 py-1">
              {t(product.status)}
            </Badge>
            <span className="text-sm text-muted-foreground">Model: {product.model}</span>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed mt-2">{productDescription}</p>

          <div className="border-t my-4"></div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-semibold text-foreground">{t('season')}:</div>
            <div className="text-muted-foreground">{t(product.season)}</div>
            <div className="font-semibold text-foreground">{t('type')}:</div>
            <div className="text-muted-foreground">{t(product.type)}</div>
            <div className="font-semibold text-foreground">{t('collection')}:</div>
            <div className="text-muted-foreground">{collectionName}</div>
          </div>
          
          <div className="border-t my-4"></div>

          <a href={`https://wa.me/901234567890?text=I'm interested in product ${product.model}: ${productName}`} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full md:w-auto">
              <Zap className="mr-2 h-5 w-5" />
              {t('inquire_on_whatsapp')}
            </Button>
          </a>

        </div>
      </div>
    </div>
  );
}
