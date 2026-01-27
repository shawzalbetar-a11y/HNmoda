
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/hooks/use-language';

export default function Home() {
  const { t } = useLanguage();
  const featuredProducts = products.slice(0, 4);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div>
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline leading-tight shadow-md animate-fade-in-down">
            {t('hero_title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200 animate-fade-in-up [animation-delay:0.2s]">
            {t('hero_subtitle')}
          </p>
          <Button asChild size="lg" className="mt-8 animate-fade-in-up [animation-delay:0.4s]">
            <Link href="/products">{t('hero_cta')}</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">{t('featured_products')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
