'use client';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1516762689617-e1cff2436c88?q=80&w=1974&auto=format&fit=crop"
        alt="Fashion design workspace with fabrics and tools"
        fill
        className="object-cover"
        data-ai-hint="fashion workspace"
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
