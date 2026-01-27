"use client";

import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { VideoPlayerModal } from './video-player-modal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const [isVideoOpen, setVideoOpen] = useState(false);

  const productName = product.name[language] || product.name['en'];
  const statusText = t(product.status);

  return (
    <>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0 relative">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.images[0]}
              alt={productName}
              width={600}
              height={800}
              className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          {product.status === 'sold_out' && (
            <Badge
              variant="destructive"
              className="absolute top-3 left-3"
            >
              {statusText}
            </Badge>
          )}
          {product.videoUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full backdrop-blur-sm"
              onClick={(e) => { e.preventDefault(); setVideoOpen(true); }}
              aria-label={t('watch_video')}
            >
              <PlayCircle className="h-10 w-10" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold font-headline truncate">
            <Link href={`/products/${product.id}`} className="hover:underline">{productName}</Link>
          </CardTitle>
          <p className="text-sm text-primary mt-1">{`Model: ${product.model}`}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild className="w-full" variant="outline">
            <Link href={`/products/${product.id}`}>
              <Eye className="mr-2 h-4 w-4" /> {t('view_details')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
      {product.videoUrl && (
        <VideoPlayerModal
          isOpen={isVideoOpen}
          onOpenChange={setVideoOpen}
          videoUrl={product.videoUrl}
          productName={productName}
        />
      )}
    </>
  );
}
