'use client';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const carouselImages = [
  { seed: 'hn-1', hint: 'fashion model' },
  { seed: 'hn-2', hint: 'clothing fabric' },
  { seed: 'hn-3', hint: 'fashion design' },
  { seed: 'hn-4', hint: 'tailoring process' },
  { seed: 'hn-5', hint: 'runway model' },
  { seed: 'hn-6', hint: 'elegant dress' },
  { seed: 'hn-7', hint: 'men suit' },
  { seed: 'hn-8', hint: 'fashion details' },
];

export function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center bg-secondary">
      {/* Desktop View: Two carousels side-by-side */}
      <div className="absolute inset-0 hidden md:grid grid-cols-2 gap-4 p-4">
        <div>
            <Carousel
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
              opts={{ loop: true }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                  {carouselImages.slice(0, 4).map((img, index) => (
                    <CarouselItem key={index}>
                        <div className="relative w-full h-full">
                          <Image
                              src={`https://picsum.photos/seed/${img.seed}/800/1200`}
                              alt={`Fashion photo ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                              data-ai-hint={img.hint}
                              priority={index < 2}
                          />
                        </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>
        </div>
        <div>
            <Carousel
              plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
              opts={{ loop: true }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                  {carouselImages.slice(4, 8).map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-full">
                        <Image
                            src={`https://picsum.photos/seed/${img.seed}/800/1200`}
                            alt={`Fashion photo ${index + 5}`}
                            fill
                            className="object-cover rounded-lg"
                            data-ai-hint={img.hint}
                            priority={index < 2}
                        />
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>
        </div>
      </div>

      {/* Mobile View: Single carousel */}
      <div className="absolute inset-0 md:hidden">
         <Carousel
            plugins={[Autoplay({ delay: 3200, stopOnInteraction: false })]}
            opts={{ loop: true }}
            className="w-full h-full"
            >
            <CarouselContent className="h-full">
                {carouselImages.map((img, index) => (
                  <CarouselItem key={index}>
                      <div className="relative w-full h-full">
                        <Image
                            src={`https://picsum.photos/seed/${img.seed}/800/1200`}
                            alt={`Fashion photo ${index + 1}`}
                            fill
                            className="object-cover"
                            data-ai-hint={img.hint}
                            priority={index < 1}
                        />
                      </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>
      </div>
      
      {/* Centered Text Overlay */}
      <div className="relative z-10 text-center bg-background/50 backdrop-blur-sm p-8 rounded-xl">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground">
          HUMAN NATURE
        </h1>
        <p className="mt-2 text-lg text-foreground/80">hnmoda</p>
      </div>
    </section>
  );
}
