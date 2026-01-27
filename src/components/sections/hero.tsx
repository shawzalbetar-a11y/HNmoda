'use client';
import Image from 'next/image';

export function Hero() {
  const heroImageUrl = "https://storage.googleapis.com/maker-studio-project-files-prod/9e00a58a-f748-433b-b153-f11181832168/images/84105434-2e5a-436f-87e3-057088924b61";

  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center">
      <Image
        src={heroImageUrl}
        alt="Fashion design workspace with fabrics and tools"
        fill
        className="object-cover"
        data-ai-hint="fashion design workspace"
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
