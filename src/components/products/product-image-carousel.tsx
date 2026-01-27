"use client";

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  
  if (images.length <= 1) {
    return (
      <Card className="overflow-hidden rounded-lg">
        <Image
            src={images[0]}
            alt={alt}
            width={800}
            height={1000}
            className="w-full h-auto object-cover aspect-[4/5]"
            priority
          />
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-lg">
        <Image
          src={mainImage}
          alt={alt}
          width={800}
          height={1000}
          className="w-full h-auto object-cover aspect-[4/5] transition-opacity duration-300"
          priority
        />
      </Card>
      <div className="px-12">
        <Carousel opts={{ align: 'start' }}>
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/4">
                <div onClick={() => setMainImage(image)}>
                   <Card className={cn("overflow-hidden cursor-pointer rounded-md", mainImage === image ? 'border-primary border-2' : 'border')}>
                      <Image
                        src={image}
                        alt={`${alt} - thumbnail ${index + 1}`}
                        width={200}
                        height={250}
                        className="w-full h-auto object-cover aspect-[4/5]"
                      />
                   </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
