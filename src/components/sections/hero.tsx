'use client';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export function Hero() {
  const { heroBackground } = placeholderImages;

  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center">
      <Image
        src={`https://picsum.photos/seed/${heroBackground.seed}/${heroBackground.width}/${heroBackground.height}`}
        alt="Fashion design workspace with fabrics and tools"
        fill
        className="object-cover"
        data-ai-hint={heroBackground.hint}
        priority
      />
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
