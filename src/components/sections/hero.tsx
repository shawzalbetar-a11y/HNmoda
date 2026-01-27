'use client';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const images = [
  '/placeholder1.webp',
  '/placeholder2.webp',
  '/placeholder3.webp',
  '/placeholder4.webp',
];

export function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center bg-secondary">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="hidden md:block">
            <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            opts={{ loop: true }}
            className="w-full h-full"
            >
            <CarouselContent className="h-full">
                {images.slice(0, 2).map((src, index) => (
                <CarouselItem key={index}>
                    <div className="relative w-full h-full">
                    <Image
                        src={`https://picsum.photos/seed/${index+1}/800/1200`}
                        alt={`Fashion Model ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint="fashion model"
                    />
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>
        </div>
        <div className="hidden md:block">
            <Carousel
            plugins={[Autoplay({ delay: 3500 })]}
            opts={{ loop: true }}
            className="w-full h-full"
            >
            <CarouselContent className="h-full">
                {images.slice(2, 4).map((src, index) => (
                <CarouselItem key={index}>
                    <div className="relative w-full h-full">
                    <Image
                        src={`https://picsum.photos/seed/${index+3}/800/1200`}
                        alt={`Fashion Model ${index + 3}`}
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint="clothing design"

                    />
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>
        </div>
      </div>
      <div className="md:hidden absolute inset-0">
         <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            opts={{ loop: true }}
            className="w-full h-full"
            >
            <CarouselContent className="h-full">
                {images.map((src, index) => (
                <CarouselItem key={index}>
                    <div className="relative w-full h-full">
                    <Image
                        src={`https://picsum.photos/seed/${index+5}/800/1200`}
                        alt={`Fashion Model ${index + 5}`}
                        fill
                        className="object-cover"
                        data-ai-hint="fashion model"
                    />
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>
      </div>
      <div className="relative z-10 text-center bg-background/50 backdrop-blur-sm p-8 rounded-xl">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground">
          HUMAN NATURE
        </h1>
        <p className="mt-2 text-lg text-foreground/80">HN TextileVerse</p>
      </div>
    </section>
  );
}
